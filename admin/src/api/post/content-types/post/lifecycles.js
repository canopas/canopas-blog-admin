const { YupValidationError } = require("@strapi/utils").errors;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const convertToHTML = require("./convertData");
const axios = require("axios");
const request = require("request");
const puppeteer = require("puppeteer");

module.exports = {
  async beforeCreate(event) {
    await modifyContentAndSetErrorMsg(event);
    triggerGithubWorkflow(false);
  },

  async beforeUpdate(event) {
    await modifyContentAndSetErrorMsg(event);
  },

  async afterUpdate(event) {
    if (event.params.data.publishedAt) {
      if (!event.result.is_published) {
        await strapi.db.query("api::post.post").update({
          where: { id: event.result.id },
          data: {
            is_published: true,
          },
        });

        const user = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            fields: "email",
            filters: { is_subscribed: true },
          }
        );

        for (i = 0; i < user.length; i++) {
          const emailTemplatePath = path.join(
            __dirname,
            "../../../../../public/emailTemplates/subscribe.html"
          );
          const emailTemplate = handlebars.compile(
            fs.readFileSync(emailTemplatePath, "utf8")
          )({
            postTitle: event.result.title,
            summary: event.result.summary,
            slug: event.result.slug,
            imageUrl: event.result.image ? event.result.image.url : "",
            userEmail: user[i].email,
          });
          let emailData = {
            to: user[i].email,
            from: process.env.HR_FROM_MAIL,
            subject: event.result.title,
            html: emailTemplate,
          };
          await strapi.plugins["email"].services.email.send(emailData);
        }

        triggerGithubWorkflow(true);
      }
    } else {
      triggerGithubWorkflow(false);
    }
  },
};

function triggerGithubWorkflow(publishing) {
  const config = {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + process.env.GH_PERSONAL_ACCESS_TOKEN,
    },
  };

  axios
    .get(
      "https://api.github.com/repos/canopas/canopas-website/actions/runs?branch=master",
      config
    )
    .then((res) => {
      let devWorkflow = res.data["workflow_runs"].filter(function (workflow) {
        return workflow.name == "DeployFrontendDev";
      });

      axios.post(
        "https://api.github.com/repos/canopas/canopas-website/actions/runs/" +
          devWorkflow[0].id +
          "/rerun",
        null,
        {
          headers: config.headers,
        }
      );

      if (publishing) {
        let prodWorkflow = res.data["workflow_runs"].filter(function (
          workflow
        ) {
          return workflow.name == "DeployFrontendProd";
        });

        axios.post(
          "https://api.github.com/repos/canopas/canopas-website/actions/runs/" +
            prodWorkflow[0].id +
            "/rerun",
          null,
          {
            headers: config.headers,
          }
        );
      }

      /** submit sitemap on google after 10 mins (After workflow run will complete and generated sitemap )  */
      setTimeout(request(sitemapUrl), 10 * 60 * 1000);
    })
    .catch((err) => {
      console.error(err.message);
    });
}

async function modifyContentAndSetErrorMsg(event) {
  const result = event.params.data;

  if (result) {
    // validate input fields
    validateFields(result);

    if (result.is_resource && result.title) {
      // generate slug from title
      event.params.data.slug = generateSlug(result.title, result.slug);
    }

    // generate table of contents
    await generateTOC(result, event);
    await generateNewToc(result, event);
    await generatePreview(event);
    event.params.data.reading_time = getReadingTime(event.params.data.content);
  }
}

function generateSlug(title, slug) {
  let slugName = "";
  if (title) {
    if (!slug || slug === "post") {
      slugName =
        title
          .replace(/[^A-Za-z0-9 ]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase() +
        "-" +
        generateRandomNumber();
    } else {
      const slugMatch = slug.match(/^([A-Za-z0-9-]+)-(\d+)$/);
      const randomNumber = slugMatch
        ? parseInt(slugMatch[2])
        : generateRandomNumber();

      slugName =
        title
          .replace(/[^A-Za-z0-9 ]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase() +
        "-" +
        (randomNumber.toString().length < 10
          ? generateRandomNumber()
          : randomNumber);
    }
  }
  return slugName;
}

async function TagsInput(tags) {
  let tagsData = [];
  for (i = 0; i < tags.length; i++) {
    let existingTag = await strapi.db.query("api::tag.tag").findOne({
      where: {
        name: {
          $eqi: tags[i].name,
        },
      },
    });

    if (existingTag == null) {
      let slug = tags[i].name
        .replace(/\s/g, "-")
        .replace(/[^A-Za-z-]/g, "")
        .toLowerCase();
      existingTag = await strapi.db.query("api::tag.tag").create({
        data: {
          slug,
          name: tags[i].name,
        },
      });
    }

    const exists = tagsData.some((item) => item.id === existingTag.id);

    if (!exists) {
      tagsData.push(existingTag);
    }
  }

  return tagsData;
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function validateFields(result) {
  // set required message for summary,tags and meta_description
  if (result.tags && result.tags.length == 0) {
    const error = new YupValidationError({
      path: "tags",
      message: "This value is required.",
    });
    throw error;
  }
  if (result.summary && result.summary.length > 200) {
    const error = new YupValidationError({
      path: "summary",
      message: "Allow max 200 chars only",
    });
    throw error;
  }
  if (result.meta_description && result.meta_description.length > 160) {
    const error = new YupValidationError({
      path: "meta_description",
      message: "Allow max 160 chars only",
    });
    throw error;
  }
}

async function generateTOC(result, event) {
  if (result.blog_content) {
    const dom = new JSDOM(result.blog_content);
    let toc = createToc(dom);

    event.params.data.content = dom.serialize();
    event.params.data.toc = toc += "</ul></li>";
    event.params.data.tags = await TagsInput(result.tags);

    // set published on
    if (!event.params.data.published_on) {
      event.params.data.published_on = new Date();
    }
  }
}

async function generateNewToc(result, event) {
  if (result.new_blog_content) {
    const dom = new JSDOM(convertToHTML(result.new_blog_content));
    let toc = createToc(dom);

    event.params.data.new_content = dom.serialize();
    event.params.data.new_toc = toc += "</ul>";
    event.params.data.tags = await TagsInput(result.tags);

    // set published on
    if (!event.params.data.published_on) {
      event.params.data.published_on = new Date();
    }
  } else {
    event.params.data.new_content = null;
    event.params.data.new_toc = null;
  }
}

async function generatePreview(event) {
  const dom = new JSDOM(event.params.data.content);
  const doc = dom.window.document;
  const embeds = doc.querySelectorAll("oembed[url]");
  for (const element of embeds) {
    let string = "";
    if (["mp4", "webm"].some((v) => element.attributes.url.value.includes(v))) {
      string = `<video style="margin:auto;max-height:70vh" autoplay loop muted>
        <source src="${element.attributes.url.value}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`;
    } else if (
      ["png", "jpg", "jpeg", "webp"].some((v) =>
        element.attributes.url.value.includes(v)
      )
    ) {
      string = "";
    } else {
      let data = await runScraper(element.attributes.url.value);
      string = ` <div
      style="
        overflow-wrap: break-word;
        box-shadow: rgb(242, 242, 242) 0px 0px 0px 1px inset;
      "
    >
      <a href="${element.attributes.url.value}" target="_blank" style="text-decoration: none; ">
        <div style="display: flex">
          <div
            style="
              padding: 16px 20px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1 1 auto;
            "
          >
            <h2
              style="
                max-height:40px;
                margin: 0 !important;
                overflow: hidden;
                color: #242424;
                text-overflow: ellipsis;
                font-size: 16px !important;
                font-weight: 700;
                -webkit-line-clamp: 2;
                -webkit-box-orient:vertical;
              "
            >
              ${data.title}
            </h2>
            <div style="margin-top: 8px">
              <h3
                style="
                  max-height:40px;
                  margin: 0 !important;
                  overflow: hidden;
                  color: #6b6b6b;
                  text-overflow: ellipsis;
                  font-size: 16px !important;
                  line-height: 20px;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient:vertical;
                "
              >
                ${data.description}
              </h3>
            </div>
            <div>
              <p
                style="
                  max-height:40px;
                  margin: 0 !important;
                  color: #6b6b6b;
                  font-size: 13px !important;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient:vertical;
                  text-overflow: ellipsis;
                "
              >
                ${data.domain}
              </p>
            </div>
          </div>
          <div style="width: 160px">
            <div
              style="
                background-image: url('${data.img}');
                background-position: 50% 50%;
                height: 167px;
                width: 160px;
                background-size: cover;
              "
            ></div>
          </div></div
      ></a>
    </div>
`;
    }
    element.innerHTML = string;
    event.params.data.content = dom.serialize();
  }
}

async function runScraper(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-features=site-per-process"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    const obj = {
      title: await getTitle(page),
      description: await getDescription(page),
      domain: await getDomainName(page, url),
      img: await getImg(page, url),
    };
    await browser.close();
    return obj;
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

const createToc = (dom) => {
  const doc = dom.window.document;

  // find all header tags in the document
  const headers = doc.querySelectorAll("h1, h2");

  // table of contents field
  let toc = `<ul style="list-style-type: disc">`;
  let lastNode = 6; // max header node
  let childNode = false;

  headers.forEach((header, index) => {
    let currentNode = parseInt(header.nodeName.at(-1));
    let text = header.textContent
      .replace(/\s/g, "-")
      .replace(/[^A-Za-z-]/g, "")
      .toLowerCase();

    text = text + "-" + index;

    if (currentNode > lastNode || (currentNode == lastNode && childNode)) {
      toc = childNode
        ? toc
        : toc +
          "<li style='list-style-type: none'><ul style='list-style-type: square'>";
      toc += `<li style='margin:1px 0px'><a href="#${text}">${header.textContent}</a></li>`;
      childNode = true;
    } else {
      toc = childNode ? toc + "</ul>" : toc;
      toc += `<li style='margin:1px 0px'><a href="#${text}">${header.textContent}</a></li>`;
      childNode = false;
    }

    lastNode = currentNode;
    header.setAttribute("id", `${text}`);
  });

  return toc;
};

const getTitle = async (page) => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1El = document.querySelector("h1");
    const h1 = h1El ? h1El.innerHTML : null;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2El = document.querySelector("h2");
    const h2 = h2El ? h2El.innerHTML : null;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};

const getDescription = async (page) => {
  const description = await page.evaluate(() => {
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription != null && ogDescription.content.length > 0) {
      return ogDescription.content;
    }
    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDescription != null && twitterDescription.content.length > 0) {
      return twitterDescription.content;
    }
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription != null && metaDescription.content.length > 0) {
      return metaDescription.content;
    }
    let paragraphs = document.querySelectorAll("p");
    let fstVisibleParagraph = null;
    for (const element of paragraphs) {
      if (
        // if object is visible in dom
        element.offsetParent !== null &&
        !element.childElementCount != 0
      ) {
        fstVisibleParagraph = element.textContent;
        break;
      }
    }
    return fstVisibleParagraph;
  });
  return description;
};

const getDomainName = async (page, uri) => {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null
    ? new URL(domainName).hostname.replace("www.", "")
    : new URL(uri).hostname.replace("www.", "");
};

const getImg = async (page, uri) => {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg != null && ogImg.content.length > 0) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (imgRelLink != null && imgRelLink.href.length > 0) {
      return imgRelLink.href;
    }
    const twitterImg = document.querySelector('meta[name="twitter:image"]');
    if (twitterImg != null && twitterImg.content.length > 0) {
      return twitterImg.content;
    }

    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter((img) => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else if (img.naturalHeight / img.naturalWidth > 3) {
          addImg = false;
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      if (imgs.length > 0) {
        imgs.forEach((img) =>
          img.src.indexOf("//") === -1
            ? (img.src = `${new URL(uri).origin}/${img.src}`)
            : img.src
        );
        return imgs[0].src;
      }
    }
    return null;
  });
  return img;
};

function getReadingTime(content) {
  if (!content) return 0;
  const numberOfWords = content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split(/\s/g)
    .filter((e) => e !== "").length;
  return Math.ceil(numberOfWords / 265);
}

const { YupValidationError } = require("@strapi/utils").errors;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const convertToHTML = require("./convertData");
const axios = require("axios");
const request = require("request");

module.exports = {
  async beforeCreate(event) {
    await modifyContentAndSetErrorMsg(event);
    triggerGithubWorkflow(false);
  },

  async beforeUpdate(event) {
    await modifyContentAndSetErrorMsg(event);
    triggerGithubWorkflow(false);
  },

  async afterUpdate(event) {
    if (event.params.data.publishedAt) {
      if (!event.result.is_published) {
        await strapi.db.query("api::post.post").update({
          where: { id: event.result.id },
          data: {
            is_published: true,
            published_on: event.params.data.publishedAt,
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

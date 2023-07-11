import config from "./config";
import Avatar from "./assets/images/user.png";
import canopasIcon from "./assets/images/canopas-icon.svg";

// Calculate reading time
function getReadingTime(content) {
  if (!content) return;
  const numberOfWords = content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split(/\s/g).length;
  return Math.ceil(numberOfWords / config.WORDS_PER_MINUTE);
}

// Formate date and time from millis
function formateDate(date) {
  if (!date) return [null, null];
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // time formate
  const formattedTime = newDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return [formattedDate, formattedTime];
}

function setPostFields(post, slug) {
  const publishedDate =
    post.attributes.published_on !== null
      ? post.attributes.published_on
      : post.attributes.publishedAt;
  const [date, _] = formateDate(publishedDate);
  post.attributes.published_on = date || "Draft";
  post.attributes.readingTime = getReadingTime(post.attributes.content);
  post.attributes.image_url =
    post.attributes.image.data && post.attributes.image.data.attributes.url
      ? post.attributes.image.data.attributes.url
      : canopasIcon;
  if (post.attributes.author.data != null) {
    const author = post.attributes.author.data.attributes;
    post.attributes.authorName = author.username ? author.username : "author";
    post.attributes.authorImage = author.image.data
      ? author.image.data.attributes.url
      : Avatar;
    post.attributes.authorAltText = author
      ? author.username + " images"
      : "author";
  } else {
    post.attributes.authorName = "author";
    post.attributes.authorImage = Avatar;
    post.attributes.authorAltText = "author";
  }

  if (slug && post.attributes.tags[0]) {
    post.attributes.tags.map((tag) => {
      if (tag.slug == slug) {
        post.tagName = tag.name;
      }
    });
  }
}

function calculateWeight(post, keyword) {
  let weight = 0;
  if (post.attributes.title.toLowerCase().includes(keyword.toLowerCase())) {
    weight = post.attributes.title
      .toLowerCase()
      .match(new RegExp(keyword.toLowerCase(), "g")).length;
    weight *= 5;
  }
  if (post.attributes.content.toLowerCase().includes(keyword.toLowerCase())) {
    weight = post.attributes.content
      .toLowerCase()
      .match(new RegExp(keyword.toLowerCase(), "g")).length;
    weight *= 2;
  }
  if (post.attributes.tags) {
    post.attributes.tags.data.map((tag) => {
      if (tag.attributes.name.toLowerCase().includes(keyword.toLowerCase())) {
        weight = tag.attributes.name
          .toLowerCase()
          .match(new RegExp(keyword.toLowerCase(), "g")).length;
        weight *= 1;
      }
    });
  }

  return weight;
}

function filterPostsByCategory(post, keyword) {
  return post.filter(
    (result) =>
      result.attributes.category.data != null &&
      result.attributes.category.data.attributes.name == keyword,
  );
}

function isValidEmail(email) {
  var emailRegx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !emailRegx.test(email);
}
function isValidPhoneNumber(phonenumber) {
  var NumberRegx =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return !NumberRegx.test(phonenumber);
}

function filterPostsByCategoryAndTag(post, posts) {
  const relatedPosts = [];
  const postTags = post.tags.map((tag) => tag.name);

  if (posts) {
    const postCategoryName = post.category.data
      ? post.category.data.attributes.name
      : "";

    if (postCategoryName || postTags.length > 0) {
      posts.forEach((post) => {
        var index = 0;
        const relatedTags = post.attributes.tags.map((tag) => tag.name);
        const relatedCategoryName = post.attributes.category.data
          ? post.attributes.category.data.attributes.name
          : "";

        if (relatedCategoryName && postCategoryName === relatedCategoryName) {
          index += 3;
        }
        if (postTags.some((tag) => relatedTags.includes(tag))) {
          index +=
            1 * postTags.filter((tag) => relatedTags.includes(tag)).length;
        }

        if (index > 0) {
          post.attributes.index = index;
          relatedPosts.push(post);
        }
      });
    }
  }
  return relatedPosts;
}

export {
  getReadingTime,
  formateDate,
  setPostFields,
  calculateWeight,
  filterPostsByCategory,
  isValidEmail,
  isValidPhoneNumber,
  filterPostsByCategoryAndTag,
};

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
  const author = post.attributes.author.data.attributes;
  post.attributes.published_on = date || "Draft";
  post.attributes.readingTime = getReadingTime(post.attributes.content);
  post.attributes.image_url =
    post.attributes.image.data && post.attributes.image.data.attributes.url
      ? post.attributes.image.data.attributes.url
      : canopasIcon;
  post.attributes.authorName = author.username;
  post.attributes.authorImage = author.image_url ? author.image_url : Avatar;
  post.attributes.authorAltText = author
    ? author.username + " images"
    : "author";

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
      result.attributes.category.data.attributes.name == keyword
  );
}

export {
  getReadingTime,
  formateDate,
  setPostFields,
  calculateWeight,
  filterPostsByCategory,
};

import config from "./config";
import Avatar from "./assets/images/user.png";
import icon from "./assets/images/icon.svg";

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
  return date
    ? [
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      ]
    : [null, null];
}

function setPostFields(post, slug) {
  const publishedDate =
    post.attributes.published_on || post.attributes.publishedAt;

  const [date] = formateDate(publishedDate);

  post.attributes.published_on = date || "Draft";

  post.attributes.readingTime = getReadingTime(post.attributes.content);

  post.attributes.image_url =
    post.attributes.image.data?.attributes.url || icon;
  post.attributes.alternativeText =
    post.attributes.image.data?.attributes.alternativeText ||
    post.attributes.title;

  const author = post.attributes.author.data?.attributes;
  post.attributes.authorName = author?.username || "author";
  post.attributes.authorImage = author?.image.data
    ? author.image.data?.attributes.url
    : Avatar;
  post.attributes.authorAltText = author
    ? author.username + " image"
    : "author";
  post.attributes.authorBio = author?.bio || "";
  post.attributes.authorRole = author?.role || "Editor for Canopas";

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
  const lowercaseKeyword = keyword.toLowerCase();

  if (post.attributes.title.toLowerCase().includes(lowercaseKeyword)) {
    weight +=
      post.attributes.title
        .toLowerCase()
        .match(new RegExp(lowercaseKeyword, "g")).length * 5;
  }

  if (post.attributes.content.toLowerCase().includes(lowercaseKeyword)) {
    weight +=
      post.attributes.content
        .toLowerCase()
        .match(new RegExp(lowercaseKeyword, "g")).length * 2;
  }

  if (post.attributes.tags) {
    weight += post.attributes.tags.reduce((acc, tag) => {
      if (tag.name.toLowerCase().includes(lowercaseKeyword)) {
        acc +=
          tag.name.toLowerCase().match(new RegExp(lowercaseKeyword, "g"))
            .length * 1;
      }
      return acc;
    }, 0);
  }

  return weight;
}

const filterPostsByCategory = (posts, keyword) =>
  posts.filter(
    (result) => result.attributes.category.data?.attributes.name === keyword,
  );

const isValidEmail = (email) =>
  !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );

const isValidPhoneNumber = (phonenumber) =>
  !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
    phonenumber,
  );

function filterPostsByCategoryAndTag(post, posts) {
  const relatedPosts = [];
  const postTags = post?.tags.map((tag) => tag.name);
  const postCategoryName = post?.category.data?.attributes.name ?? null;

  if (posts && (postCategoryName || postTags?.length > 0)) {
    posts.forEach((post) => {
      let index = 0;

      const relatedTags = post.attributes.tags.map((tag) => tag.name);
      const relatedCategoryName =
        post.attributes.category.data?.attributes.name ?? null;

      index +=
        postCategoryName &&
        relatedCategoryName &&
        postCategoryName === relatedCategoryName
          ? 3
          : 0;

      index += postTags.filter((tag) => relatedTags.includes(tag)).length;

      if (index > 0) {
        post.attributes.index = index;
        relatedPosts.push(post);
      }
    });
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

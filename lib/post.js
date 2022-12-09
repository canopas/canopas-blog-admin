import config from "../config";
const STRAPI_URL = config.STRAPI_URL;
const WORDS_PER_MINUTE = 200;

// GET the posts and post by id from Strapi
async function fetchPost(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/posts/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/posts?populate=deep&status=published`;
  const response = await fetch(requestUrl, {
    method: "GET",
  });
  const data = await response.json();
  return [response.status, data];
}
// Insert the comment on post
async function addComment(data) {
  if (!data) return;
  const requestUrl = `${STRAPI_URL}/v1/comments?populate=deep`;
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return [response.status, res];
}

// Create the commentator user for the post
async function addUser(data) {
  if (!data) return;
  const requestUrl = `${STRAPI_URL}/v1/commentators?populate=deep`;
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return [response.status, res];
}

// Update the comment after insert the commentator data
async function updateCommentator(id, data) {
  if (!data) return;
  const requestUrl = `${STRAPI_URL}/v1/comments/${id}?populate=deep`;
  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return [response.status, res];
}
// GET the posts and post by id from Strapi
async function fetchCategory(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/categories/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/categories?populate=deep`;
  const response = await fetch(requestUrl, {
    method: "GET",
  });
  const data = await response.json();
  return [response.status, data];
}

// GET the post by author from Strapi
async function fetchAuthor(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/authors/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/authors?populate=deep`;
  const response = await fetch(requestUrl, {
    method: "GET",
  });
  const data = await response.json();
  return [response.status, data];
}

// GET the tag and tag by id from Strapi
async function fetchTag(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/tags/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/tags?populate=deep`;
  const response = await fetch(requestUrl, {
    method: "GET",
  });
  const data = await response.json();
  return [response.status, data];
}

// Calculate reading time of article
async function getReadingTime(content) {
  if (!content) return;
  const numberOfWords = content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split(/\s/g).length;
  return Math.ceil(numberOfWords / WORDS_PER_MINUTE) + " min read ";
}

// Formate date of article
async function formateDate(date) {
  if (!date) return;
  const publishedDate = new Date(date);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  // time formate for the comments
  const formattedTime = publishedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return [formattedDate, formattedTime];
}

// GET the posts On search from Strapi
async function searchPost(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/posts?populate=deep&filters[content][$contains]=${slug}`
    : `${STRAPI_URL}/v1/posts?populate=deep&filters[title][$contains]=${slug}`;
  const response = await fetch(requestUrl, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

export {
  fetchPost,
  getReadingTime,
  formateDate,
  fetchAuthor,
  fetchCategory,
  fetchTag,
  searchPost,
  addComment,
  addUser,
  updateCommentator,
};

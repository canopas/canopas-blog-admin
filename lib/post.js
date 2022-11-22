import config from "../config";

const STRAPI_URL = config.STRAPI_URL;
const WORDS_PER_MINUTE = 200;

// GET the posts and post by id from Strapi
async function fetchPost(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/posts/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/posts?populate=deep`;
  const response = await fetch(requestUrl);
  const data = response.json();
  return await data;
}

// GET the post by author from Strapi
async function fetchAuthor(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/authors/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/authors?populate=deep`;
  const response = await fetch(requestUrl);
  const data = response.json();
  return await data;
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
  return formattedDate;
}

export { fetchPost, getReadingTime, formateDate, fetchAuthor };

import config from "../config";
const STRAPI_URL = config.STRAPI_URL;

// Get posts
async function fetchPost(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/posts/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/posts?populate=deep&status=published`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
    });
    const data = await response.json();
    return [response.status, data];
  } catch (err) {
    console.log(err);
    return [config.SERVER_ERROR, null];
  }
}

export { fetchPost };

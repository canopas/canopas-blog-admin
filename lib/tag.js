import config from "../config";
const STRAPI_URL = config.STRAPI_URL;

// Get tags
async function fetchTag(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/tags/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/tags?populate=deep`;

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

export { fetchTag };

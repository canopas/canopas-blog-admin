import config from "../config";
const STRAPI_URL = config.STRAPI_URL;

// Get categories
async function fetchCategory(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/categories/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/categories?populate=deep`;

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

export { fetchCategory };

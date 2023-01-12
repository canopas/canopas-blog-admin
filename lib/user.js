import config from "../config";
const STRAPI_URL = config.STRAPI_URL;

// Get author
async function fetchUser(slug) {
  const requestUrl = slug
    ? `${STRAPI_URL}/v1/users/${slug}?populate=deep`
    : `${STRAPI_URL}/v1/users?populate=deep`;

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

export { fetchUser };

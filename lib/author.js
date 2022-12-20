import config from "../config";
const STRAPI_URL = config.STRAPI_URL;

// Get author
async function fetchAuthor(slug) {
    const requestUrl = slug
        ? `${STRAPI_URL}/v1/authors/${slug}?populate=deep`
        : `${STRAPI_URL}/v1/authors?populate=deep`;

    try {
        const response = await fetch(requestUrl, {
            method: "GET",
        });
        const data = await response.json();
        return [response.status, data];
    } catch (err) {
        console.log(err)
        return [config.SERVER_ERROR, null];
    }
}

export {
    fetchAuthor
};
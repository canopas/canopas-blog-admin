import config from "../config";
const STRAPI_URL = config.STRAPI_URL;

// Add comment
async function addComment(data) {
  if (!data) return;
  const requestUrl = `${STRAPI_URL}/v1/comments?populate=deep`;

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return [response.status, res];
  } catch (err) {
    console.log(err);
    return [config.SERVER_ERROR, null];
  }
}

// Create commentator
async function addCommentator(data) {
  if (!data) return;
  const requestUrl = `${STRAPI_URL}/v1/commentators?populate=deep`;

  try {
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return [response.status, res];
  } catch (err) {
    console.log(err);
    return [config.SERVER_ERROR, null];
  }
}

// Update comment
async function updateComment(id, data) {
  if (!data) return;
  const requestUrl = `${STRAPI_URL}/v1/comments/${id}?populate=deep`;

  try {
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return [response.status, res];
  } catch (err) {
    console.log(err);
    return [config.SERVER_ERROR, null];
  }
}

export { addComment, addCommentator, updateComment };

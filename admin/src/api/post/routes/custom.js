module.exports = {
  routes: [
    {
      method: "GET",
      path: "/posts/:slug",
      handler: "post.findOne",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/tag/:tag",
      handler: "post.getBlogByTagName",
      config: {
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/post/autosave",
      handler: "post.autosave",
      config: {
        auth: false,
      },
    },
  ],
};

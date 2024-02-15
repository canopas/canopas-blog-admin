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
      method: "GET",
      path: "/paginate",
      handler: "post.findPaginate",
      config: {
        auth: false,
      },
    },
  ],
};

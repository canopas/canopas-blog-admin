module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tags/suggestions",
      handler: "tag.suggestions",
      config: {
        auth: false,
      },
    },
  ],
};

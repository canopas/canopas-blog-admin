export default Object.freeze({
  STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
  WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  API_BASE: process.env.NEXT_PUBLIC_API_BASE,

  WORDS_PER_MINUTE: 200,

  // status codes
  SUCCESS: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,

  POST_NOT_FOUND_MESSAGE: `Stay tuned, we have some exciting posts in the works that we'll be sharing with you shortly.`,
  SEO_META_DATA: {
    title:
      "Web and Mobile app development resources to help you make an informed decision",
    description:
      "Explore our Web and Mobile app development resources to equip yourself with the software development process.",
    authorName: "canopas",
  },

  SHOW_DRAFT_POSTS: false,
  SHOW_SEARCH_POSTS: false,
  SHOW_CATEGORY_POSTS: false,
  SHOW_HEADER_TITLE: false,
  SHOW_COMMENT_SECTION: false,

  FACEBOOK_URL: "https://www.facebook.com/canopassoftware",
  INSTAGRAM_URL: "https://www.instagram.com/canopassoftware/",
  TWITTER_URL: "https://twitter.com/canopassoftware",
  BLOG_URL: "https://blog.canopas.com/",
  LINKEDIN_URL: "https://www.linkedin.com/company/canopasinc",
  YOUTUBE_URL:
    "https://www.youtube.com/channel/UC77VyeTVJ45HiUS_o2GNcBA/videos",
});

"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.db.query("api::post.post").findOne({
      where: { slug },
      populate: {
        author: {
          populate: {
            image: true,
          },
        },
        tags: true,
        category: true,
        image: true,
        cta: true,
        comments: {
          populate: {
            user: true,
          },
        },
      },
    });

    return this.transformResponse(entity);
  },

  async find(ctx) {
    let posts = await strapi.entityService.findMany("api::post.post", {
      filters: ctx.query.filters,
      publicationState: ctx.query.publicationState,
      sort: { published_on: "desc" },
      populate: {
        author: {
          populate: {
            image: true,
          },
        },
        tags: true,
        category: true,
        image: true,
        comments: {
          populate: {
            user: true,
          },
        },
      },
    });

    return this.transformResponse(posts);
  },
  async getBlogByTagName(ctx) {
    const { tag } = ctx.params;

    let posts = await strapi.entityService.findMany("api::post.post", {
      sort: { published_on: "desc" },
      populate: {
        author: {
          populate: {
            image: true,
          },
        },
        tags: true,
        category: true,
        image: true,
      },
      publicationState: "live",
    });

    posts = posts.filter((post) => {
      if (post.tags) {
        return post.tags.some((tagSlug) => tagSlug.slug === tag);
      }
    });

    return this.transformResponse(posts);
  },
}));

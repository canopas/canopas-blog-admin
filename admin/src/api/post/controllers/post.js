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

    if (!entity.is_resource) {
      entity.recommandedPosts = [];
    } else {
      const recommandedPosts = await strapi.db
        .query("api::post.post")
        .findMany({
          where: {
            $and: [
              {
                slug: { $ne: entity.slug },
              },
              {
                is_resource: entity.is_resource,
              },
            ],
          },
          sort: { published_on: "desc" },
          populate: {
            author: {
              populate: {
                image: true,
              },
            },
            image: true,
          },
        });

      entity.recommandedPosts = recommandedPosts
        .filter((post) => {
          return entity.tags
            .map((t) => t.name)
            .some((r) => post.tags.map((t) => t.name).includes(r));
        })
        .slice(0, 3);
    }

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
        image: true,
      },
    });

    return this.transformResponse(posts);
  },
  async getBlogByTagName(ctx) {
    const { tag } = ctx.params;

    let posts = await strapi.db.query("api::post.post").findMany({
      sort: { published_on: "desc" },
      populate: {
        author: {
          populate: {
            image: true,
          },
        },
        tags: true,
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

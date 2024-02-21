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

    if (entity) {
      entity.recommandedPosts = [];
      if (entity.is_resource) {
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
    }

    return this.transformResponse(entity);
  },

  async find(ctx) {
    const count = await strapi.entityService.count("api::post.post", {
      filters: ctx.query.filters,
      publicationState: ctx.query.publicationState,
    });

    let filterObject = {
      filters: ctx.query.filters,
      fields: ctx.query.fields,
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
    };

    if (ctx.query.pagination) {
      filterObject.start = ctx.query.pagination.start || 0;
      filterObject.limit = ctx.query.pagination.limit || 10;
    }

    const posts = await strapi.entityService.findMany(
      "api::post.post",
      filterObject
    );

    if (ctx.query.filters) {
      ctx.query.filters.is_featured = true;
    } else {
      ctx.queryfilters = {
        is_featured: true,
      };
    }

    const featuredPosts = await strapi.entityService.findMany(
      "api::post.post",
      {
        filters: ctx.query.filters,
        fields: ctx.query.fields,
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
      }
    );

    return this.transformResponse({
      posts: posts,
      featuredPosts: featuredPosts,
      count: count,
    });
  },

  async getBlogByTagName(ctx) {
    const { tag } = ctx.params;
    let posts = await strapi.entityService.findMany("api::post.post", {
      fields: ctx.query.fields,
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

    posts = posts.filter((post) => {
      if (post.tags) {
        return post.tags.some((tagSlug) => tagSlug.slug === tag);
      }
    });

    return this.transformResponse(posts);
  },

  async findPaginate(ctx) {
    let filterObject = {
      filters: ctx.query.filters,
      fields: ctx.query.fields,
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
    };

    if (ctx.query.pagination) {
      filterObject.start = ctx.query.pagination.start || 0;
      filterObject.limit = ctx.query.pagination.limit || 10;
    }

    const posts = await strapi.entityService.findMany(
      "api::post.post",
      filterObject
    );

    return this.transformResponse(posts);
  },
}));

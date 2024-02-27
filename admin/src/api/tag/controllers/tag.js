"use strict";

/**
 * tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tag.tag", ({ strapi }) => ({
  async suggestions(ctx) {
    return await strapi.entityService.findMany("api::tag.tag", {
      fields: ctx.query.fields,
    });
  },
}));

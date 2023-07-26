"use strict";

/**
 * comment service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::comment.comment");

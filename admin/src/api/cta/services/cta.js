"use strict";

/**
 * cta service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::cta.cta");

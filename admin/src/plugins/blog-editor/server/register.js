"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "editor",
    plugin: "blog-editor",
    type: "json",
  });
};

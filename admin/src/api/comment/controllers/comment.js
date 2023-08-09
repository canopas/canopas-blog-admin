"use strict";

/**
 * comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { env } = require("process");

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  async create(ctx) {
    const { comment, postId, parent_id, name, email } = ctx.request.body.data;
    let user;

    const existingUser = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email,
        },
      });

    if (existingUser) {
      if (existingUser.name === name) {
        user = existingUser;
      } else {
        await strapi.entityService
          .update("plugin::users-permissions.user", existingUser.id, {
            data: {
              name,
            },
          })
          .then((response) => {
            user = response;
          });
      }
    } else {
      try {
        user = await strapi.plugins["users-permissions"].services.user.add({
          name,
          email,
          password: "",
          role: 2,
          provider: "local",
        });
      } catch {
        ctx.throw(404, "Please enter your email correctly!!");
      }
    }

    const newComment = await strapi.entityService.create(
      "api::comment.comment",
      {
        data: {
          comment: comment,
          post: postId,
          parent_id: parent_id ? parent_id : null,
          user: user.id,
          publishedAt: new Date().toISOString(),
        },
        populate: {
          post: {
            populate: {
              author: true,
              comments: {
                populate: {
                  user: true,
                },
              },
            },
          },
        },
      },
    );

    //  Send email
    const emailTemplatePath = path.join(
      __dirname,
      "../../../../public/emailTemplates/comment.html",
    );

    const emailTemplate = handlebars.compile(
      fs.readFileSync(emailTemplatePath, "utf8"),
    )({
      parent_id: parent_id,
      emailTitle: `${
        parent_id == null
          ? `New comment by ${name}`
          : `Reply comment by ${name}`
      }`,
      comment: comment,
      postTitle: newComment.post.title,
      summary: newComment.post.summary,
      slug: newComment.post.slug,
    });

    const authorEmail = newComment.post.author.email;
    let emailData = {
      to: authorEmail,
      from: process.env.HR_FROM_MAIL,
      subject: `New comment: ${newComment.post.title}.`,
      html: emailTemplate,
    };

    if (parent_id != null) {
      const id = parent_id;
      let userEmail = await strapi.db.query("api::comment.comment").findOne({
        where: { id },
        populate: { user: true },
      });
      emailData.cc = userEmail.user[0].email;
    }

    await strapi.plugins["email"].services.email.send(emailData);

    return this.transformResponse(newComment);
  },
}));

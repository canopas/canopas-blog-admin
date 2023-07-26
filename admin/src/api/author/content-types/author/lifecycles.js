const { YupValidationError } = require("@strapi/utils").errors;

module.exports = {
  async beforeCreate(event) {
    await validateAspectRatio(event);
    await createAdminUser(event);
  },

  async beforeUpdate(event) {
    await validateAspectRatio(event);
  },
};
async function validateAspectRatio(event) {
  const id = event.params.data.image;

  if (id) {
    const image = await strapi.db
      .query("plugin::upload.file")
      .findOne({ where: { id } });

    const diff = image.width - image.height;

    if (diff > 10 || diff < -10) {
      // if different above 10 or below -10

      throw new YupValidationError({
        path: "image",
        message: "Image height and width should be same (1:1)",
      });
    }
  }
}

async function createAdminUser(event) {
  const { username, email, name, password } = event.params.data;

  const user = await strapi.db
    .query("admin::user")
    .findOne({ where: { email } });

  if (user == null) {
    await strapi.db
      .query("admin::user")
      .create({
        data: {
          firstname: name,
          lastname: "Canopas",
          username,
          email,
          password,
          roles: 3,
          isActive: true,
        },
      })
      .then(() => {
        console.log("success!!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

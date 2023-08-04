module.exports = (plugin) => {
  plugin.controllers.user.subscribeUser = async (ctx) => {
    const email = ctx.request.body.email;

    let existingUser = await strapi
      .query("plugin::users-permissions.user")
      .update({
        where: { email },
        data: { is_subscribed: true },
      });

    if (!existingUser) {
      await strapi.plugins["users-permissions"].services.user
        .add({
          email,
          password: "Canopas",
          username: email,
          role: 2,
          provider: "local",
          is_subscribed: true,
        })
        .then((response) => {
          existingUser = response;
        });
    }
    return existingUser;
  };

  plugin.controllers.user.unSubscribeUser = async (ctx) => {
    let user = await strapi.query("plugin::users-permissions.user").update({
      where: { email: ctx.query.email },
      data: { is_subscribed: false },
    });

    return user;
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/subscribeUser",
    handler: "user.subscribeUser",
    config: {
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/unSubscribeUser",
    handler: "user.unSubscribeUser",
    config: {
      prefix: "",
    },
  });
  return plugin;
};

import pluginId from "./pluginId";

export default {
  register(app) {
    app.customFields.register({
      name: "editor",
      pluginId: pluginId,
      type: "text",
      intlLabel: {
        id: "blog-editor.editor.label",
        defaultMessage: "BlogEditor",
      },
      intlDescription: {
        id: "blog-editor.editor.description",
        defaultMessage: "BlogEditor to add blog content",
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "input-component" */ "./components/Wysiwyg"
          ),
      },
    });
  },
  bootstrap() {},
};

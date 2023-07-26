import AuthLogo from "./extensions/auth-logo.png";
import favicon from "./extensions/favicon.ico";

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    locales: ["fr", "de"],
    menu: {
      logo: AuthLogo,
    },
    theme: {
      light: {
        colors: {
          primary100: "#f6ecfc",
          primary200: "#e0c1f4",
          primary500: "#ac73e6",
          primary600: "#9736e8",
          primary700: "#8312d1",
          danger700: "#b72b1a",
        },
      },
      dark: {},
    },
    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "Dashboard",
        "app.components.LeftMenu.navbrand.workplace": "Blogs",
        "Auth.form.welcome.title": "Welcome to admin panel",
        "Auth.form.welcome.subtitle": "Login to explore!!",
      },
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { release: false },
  },

  bootstrap() {
    document.title = "Login to blog admin panel";
  },
};

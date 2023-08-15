module.exports = ({ env }) => ({
  ckeditor: {
    enabled: true,
    config: {
      editor: {
        mediaEmbed: {
          providers: [
            {
              name: "iframely previews",
              url: /.+/,
              html: (match) => {
                let iframeUrl =
                  "//cdn.iframe.ly/api/iframe?app=1&api_key=" +
                  env("IFRAMELY_API_KEY") +
                  "&url=" +
                  encodeURIComponent(match[0]);
                return (
                  // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                  '<div class="iframely-embeddddd">' +
                  '<div class="iframely-responsive">' +
                  `<iframe src="${iframeUrl}" ` +
                  'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                  "</iframe>" +
                  "</div>" +
                  "</div>"
                );
              },
            },
          ],
        },
        codeBlock: {
          languages: [
            { language: "bash", label: "Bash", class: "bash" },
            { language: "c", label: "C", class: "c" },
            { language: "c++", label: "C++", class: "c-plus-plus" },
            { language: "c#", label: "C#", class: "c-sharp" },
            { language: "css", label: "CSS", class: "css" },
            { language: "dart", label: "Dart", class: "dart" },
            { language: "diff", label: "Diff", class: "diff" },
            { language: "golang", label: "Go", class: "go" },
            { language: "graphql", label: "GraphQL", class: "graphql" },
            { language: "java", label: "Java", class: "java" },
            {
              language: "javascript",
              label: "JavaScript",
              class: "javascript",
            },
            { language: "json", label: "JSON", class: "json" },
            { language: "kotlin", label: "Kotlin", class: "kotlin" },
            { language: "less", label: "Less", class: "less" },
            { language: "lua", label: "Lua", class: "lua" },
            { language: "makefile", label: "Makefile", class: "makefile" },
            { language: "perl", label: "Perl", class: "perl" },
            { language: "php", label: "PHP", class: "php" },
            { language: "plaintext", label: "Plain text", class: "plain-text" },
            { language: "python", label: "Python", class: "python" },
            { language: "r", label: "R", class: "r" },
            { language: "ruby", label: "Ruby", class: "ruby" },
            { language: "rust", label: "Rust", class: "rust" },
            { language: "scss", label: "SCSS", class: "scss" },
            { language: "shell", label: "Shell", class: "shell" },
            { language: "sql", label: "SQL", class: "sql" },
            { language: "swift", label: "Swift", class: "swift" },
            {
              language: "typescript",
              label: "Typescript",
              class: "typescript",
            },
            { language: "yaml", label: "YAML", class: "yaml" },
          ],
        },
      },
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  guidelines: {
    enabled: true,
    resolve: "./src/plugins/guidelines", // path to guidelines folder
  },
  sentry: {
    enabled: true,
    config: {
      dsn: env("SENTRY_DSN"),
      sendMetadata: true,
    },
  },
  scheduler: {
    enabled: true,
    config: {
      contentTypes: {
        "api::post.post": {},
      },
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
        region: env("AWS_REGION"),
        params: {
          Bucket: env("AWS_BUCKET"),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "amazon-ses",
      providerOptions: {
        key: env("AWS_ACCESS_KEY_ID"),
        secret: env("AWS_SECRET_ACCESS_KEY"),
        amazon: `https://email.${env("AWS_REGION")}.amazonaws.com`,
      },
    },
  },
});

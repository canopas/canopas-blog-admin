<p align="center"><a href="https://canopas.com/contact"><img src="./assets/banner.png"></a></p>

# Feature-Rich Blog Admin Platform for writing and publishing your content

This is our open-source Strapi blog admin panel of [canopas](https://canopas.com). This application is designed to help bloggers and content creators build and manage their online presence with an emphasis on search engine optimization (SEO). Whether you are a beginner blogger or an experienced content creator, our project provides a seamless and user-friendly experience to showcase your expertise and attract more traffic through superior SEO techniques.

## Showcase

This repository contains the admin panel of [our resources](https://canopas.com/resources) and [blog](https://canopas.com/blog).

### Admin panel preview

![Admin panel](https://github.com/canopas/canopas-blog-admin/assets/115449373/7542ff05-08ca-45ae-a4c6-24785419ae35)

---

# Table of contents

- [Key features](https://github.com/canopas/canopas-blog-admin#key-features)
- [Requirements](https://github.com/canopas/canopas-blog-admin#requirements)
- [Setup](https://github.com/canopas/canopas-blog-admin#setup)
- [Customization](https://github.com/canopas/canopas-blog-admin#customization)
- [Formatting and Linting](https://github.com/canopas/canopas-blog-admin#formatting-and-linting)
- [Deployment](https://github.com/canopas/canopas-blog-admin#deployment)
- [Dependencies](https://github.com/canopas/canopas-blog-admin#dependencies)
- [Licence](https://github.com/canopas/canopas-blog-admin#licence)

---

# Key Features

1. **Strapi CMS in Admin Panel:**: This project created with Strapi. This provides us CMS with API as backend. We can use both for Creating Editing, and Publishing the blogs and its relavant content seamlessly.

2. **SEO-friendly URLs and Metadata:** Each posts has SEO fields like meta tags, URL structures and sitemaps. You can customize all the essentia; fields for Optimal SEO.

3. **Automatic previews:** We created custom previews like medium in Blog Editor.Your blog post will have preview of links based on its data like images or videos. You need to just paste the links and it will geneate preview on save and you can see it at your frontend.

4. **CI/CD and Deployment:** With CI in place, every code change is automatically tested and integrated into the main codebase. This ensures that the main branch always remains stable, reducing the chances of bugs and allowing for rapid deployment.
5. **Recommended Posts:** Enhance user engagement by showcasing recommended posts to your audience. This feature suggests relevant content based on the user's reading history, keeping visitors on your website for longer.

6. **Email Subscription:** Engage your readers effectively with our built-in subscription system. Visitors can subscribe to your blog and receive updates whenever you publish new content, helping you build a loyal readership base. Users can also unsubscribe from emails.

---

**Note:** Admin panel code resides in the `admin` directory

# Requirements

- Node.js: v18
- Postgres

# Setup

### Database

- Create a database in postgres to store blog data.

### Setup environment variables

- Go to `admin` using `cd admin`
- Copy `.env.example` to `.env`
- Add your variables and keys in the `.env` file

### Install dependencies

- Install all required dependencies using,

  ```
  yarn install
  ```

### Start admin panel using,

```
yarn develop
```

- Application will start on http://localhost:1337/admin

# Customization

- All email templates reside in `admin/public/emailTemplates`. You can customize them as per your requirement.
- You can update titles, descriptions, and logos of your admin panel from `admin/src/admin/app.js`.

- The admin panel has its own guidelines to guide writers about adding content. You can add/update guidelines for your admins or writers in `admin/src/plugins/guidelines/admin/src/pages/guidelines.md`.

---

# Formatting and Linting

The pre-commit hook will automatically lint and format your code before committing.

## To enable pre-commit hook

```
git config core.hooksPath .githooks
```

---

# Deployment

- NGINX has been used as a proxy for the admin panel. Find configuration at `admin/nginx`.
- Both the admin panel and website have been deployed on Amazon Web Services(AWS). You can find workflows in `.github/workflows`.

- Deployment stacks:

  - Admin panel: Docker, Docker swarm, AWS [ECR](https://aws.amazon.com/ecr/) and [EC2](https://aws.amazon.com/ec2/)

---

# Dependencies

The following are main dependencies used by the project

- [Strapi](https://github.com/strapi/strapi)
- [Ckeditor](https://github.com/nshenderov/strapi-plugin-ckeditor)
- [Tagsinput](https://market.strapi.io/plugins/strapi-plugin-tagsinput)

---

# Credits

This repository is owned and maintained by the [Canopas team](https://canopas.com/). If you are interested in building web applications, admin panels or designing products, please let us know. We'd love to hear from you!

<a href="https://canopas.com/contact"><img src="./assets/cta.png" width=300></a>

# Licence

This repository is released under the [MIT](https://github.com/canopas/canopas-blog-admin/blob/master/LICENSE).

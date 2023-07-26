# Feature-Rich Blog Platform for writing and publishing your content

This is our open-source Next.js blog website of [canopas](https://canopas.com). This powerful and feature-rich application is designed to help bloggers and content creators build and manage their online presence with an emphasis on search engine optimization (SEO). Whether you are a beginner blogger or an experienced content creator, our project provides a seamless and user-friendly experience to showcase your expertise and attract more traffic through superior SEO techniques.

## Showcase

This repository contains working code of [our resources](https://articles.canopas.com/resources). You can checkout link to view live example of this repository.

---

# Table of contents

- [Key features](https://github.com/canopas/canopas-blog#key-features)
- [Admin panel -- Backend](https://github.com/canopas/canopas-blog#admin-panel----backend)
  - [Requirements](https://github.com/canopas/canopas-blog#requirements)
  - [Setup](https://github.com/canopas/canopas-blog#setup)
  - [Customization](https://github.com/canopas/canopas-blog#customization)
- [Blogs website -- Frontend](https://github.com/canopas/canopas-blog#blogs-website----frontend)
  - [Requirements](https://github.com/canopas/canopas-blog#requirements-1)
  - [Setup](https://github.com/canopas/canopas-blog#setup-1)
- [Formatting and Linting](https://github.com/canopas/canopas-blog#formatting-and-linting)
- [Deployment](https://github.com/canopas/canopas-blog#deployment)
- [Dependencies](https://github.com/canopas/canopas-blog#dependencies)
- [Licence](https://github.com/canopas/canopas-blog#licence)

---

# Key Features

1. **Next.js in Website:** Our blog website is built Next.js, a powerful React framework known for its server-side rendering (SSR) and static site generation (SSG) capabilities. This ensures lightning-fast page loading and optimal performance, enhancing the user experience and search engine rankings.
2. **Strapi CMS in Admin Panel:**: Seamlessly manage your website's content using Strapi CMS. The admin panel allows easy content creation, editing, and publishing, making it simple for non-technical users to update the website's content.

3. **SEO-friendly URLs and Metadata:** We prioritize SEO best practices to ensure that your blog posts receive the visibility they deserve in search engines. From meta tags to URL structure and sitemaps, our blog website is equipped with all the essential elements for optimal SEO.

4. **Schema Markup and Rich Snippets:** Leveraging structured data and schema markup, our blog website enables search engines to display rich snippets in search results. This visually enhances your listings and provides valuable information, enticing users to click through to your blog.

5. **Responsive and Mobile-friendly Design:** We understand the importance of a mobile-friendly design in modern SEO. Our blog website is fully responsive and adapts seamlessly to various screen sizes, providing a positive user experience across devices.

6. **Open Graph and Twitter Card Integration:** Sharing blog posts on social media is crucial for driving traffic. Our project integrates Open Graph and Twitter Card meta tags, allowing for optimized sharing on social platforms, complete with engaging previews and relevant information.

7. **Image Optimization:** Images play a significant role in SEO and user experience. Our project automatically optimizes images, reducing their file sizes without compromising quality, resulting in faster loading times and better search rankings.
8. **CI/CD and Deployment:** With CI in place, every code change is automatically tested and integrated into the main codebase. This ensures that the main branch always remains stable, reducing the chances of bugs and allowing for rapid deployment.

9. **Code formatting and linting:** Clean, readable, and consistent code is the foundation of any successful project. This website follows strict code formatting and linting rules, which are enforced through automated tools. This ensures that the codebase remains maintainable and adheres to industry best practices.
10. **Recommended Posts:** Enhance user engagement by showcasing recommended posts to your audience. This feature suggests relevant content based on the user's reading history, keeping visitors on your website for longer.
11. **reCAPTCHA Integration:** Security is paramount, especially when it comes to user-generated content. Our blog website integrates reCAPTCHA, a widely trusted CAPTCHA service, to protect your site from spam and abuse while maintaining a user-friendly experience.

12. **Email Subscription:** Engage your readers effectively with our built-in subscription system. Visitors can subscribe to your blog and receive updates whenever you publish new content, helping you build a loyal readership base. Users can also unsubscribe from emails.

---

# Admin panel -- Backend

**Note:** Admin panel code resides in `admin` directory

## Requirements

- Node.js: v18
- Postgres

## Setup

### Database

- Create database in postgres to store blogs data.

### Setup environment variables

- Go to `admin` using `cd admin`
- Copy `.env.example` to `.env`
- Add your variables and keys in `.env` file

### Install dependencies

- Install all requied dependencies using,

  ```
  yarn install
  ```

### Start admin panel using,

```
yarn develop
```

- Application will be start on http://localhost:1337/admin

## Customization

- All email templates resides in `admin/pubic/emailTemplates`. You can customize them as per your requirement.
- You can update titles, description and logo of your admin panel from `admin/src/admin/app.js`.

- Admin panel have its own guidelines to guide writers about adding contents. You can add/update guidelines for your admins or writers in `admin/src/plugins/guidelines/admin/src/pages/guidelines.md`.

---

# Blogs website -- Frontend

**Note:** Website code resides in `frontend` directory

## Requirements

- Node.js: v20

## Setup

### Setup environment variables

- Go to `frontend` using `cd frontend`
- Copy `.env.example` to `.env`
- Add your variables and keys in `.env` file

### Install dependencies

- Install all requied dependencies using,

  ```
  yarn install
  ```

### Start website in dev mode using,

```
yarn dev
```

- Application will be start on http://localhost:3000

### To Start website in production mode,

```
yarn build && yarn start
```

- Application will be start on http://localhost:3000

---

# Formatting and Linting

Pre-commit hook will be automatically lint and format your code before commiting.

## To enable pre-commit hook

```
git config core.hooksPath .githooks
```

---

# Deployment

- NGINX has been used as proxy for admin panel. Find configuration at `admin/nginx`.
- Both admin panel and website has been deployed on Amazon Web Services(AWS). You can find workflows in `.github/workflows`.

- Deployment stacks:

  - Admin panel: Docker, Docker swarm, AWS [ECR](https://aws.amazon.com/ecr/) and [EC2](https://aws.amazon.com/ec2/)
  - Website: [AWS Amplify](https://aws.amazon.com/amplify/)

---

# Dependencies

Following are main dependencies used by the project

- [Strapi](https://github.com/strapi/strapi)
- [NextJs](https://github.com/vercel/next.js/)

- [Ckeditor](https://github.com/nshenderov/strapi-plugin-ckeditor)
- [Swiper](https://swiperjs.com/swiper-api)

- [Tailwind CSS](https://tailwindcss.com/)

- [FontAwesome](https://github.com/FortAwesome/Font-Awesome)
- [highlight.js](https://github.com/highlightjs/highlight.js)

---

# Licence

This repository is released under the [MIT](https://github.com/canopas/canopas-blog/blob/master/LICENSE).

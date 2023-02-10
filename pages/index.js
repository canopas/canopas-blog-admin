import Image from "next/image";
import Link from "next/link";
import ServerError from "../components/errors/serverError";
import Avatar from "../assets/images/user.png";
import config from "../config";
import axios from "axios";
import Seo from "./seo";
import { setPostFields } from "../utils";

export async function getServerSideProps() {
  const response = await axios.get(
    config.STRAPI_URL + "/v1/posts?populate=deep&status=published"
  );
  const status = response.status;
  const posts = response.data.data;
  posts.forEach((post) => setPostFields(post));
  return { props: { posts, status } };
}

export default function Home({ posts, status }) {
  const count = posts.length;

  return (
    <>
      <Seo
        title="Canopas blogs"
        description="Canopas blogs will help you to become a better software developer. We are sharing knowledge on Web, Backend, iOS, Android, and Flutter development"
        authorName="canopas"
      />
      <section className="container my-16 mx-2 sm:mx-auto font-product-sans">
        <div className="my-16 w-full bg-black-900">
          <div className="flex flex-col space-y-2 py-4 px-14 md:px-28 xl:px-44">
            <div className="w-20 md:w-1/5 ">
              <hr className="border-1 border-[#ff9472]" />
            </div>
            <div className="text-[1.5rem] md:text-[1.60rem] xl:text-[1.67rem] text-white font-semibold leading-tight md:leading-snug text-left tracking-wider">
              On a mission to help you become a better{" "}
              <span className="text-[#ff9472]">Software Engineer</span>. Sharing
              knowlegde on{" "}
              <span className="text-[#ff9472]">
                #android, #iOS, #web, & #programming.
              </span>
            </div>
          </div>
        </div>
        <hr className="mb-10" />
        <div
          className={`grid gap-10 md:gap-5 lg:gap-10 md:grid-cols-3 ${
            count % 3 === 1 ? "md:col-span-1" : ""
          }`}
        >
          {status == 0 ? (
            ""
          ) : status != config.SUCCESS ? (
            status == config.NOT_FOUND ? (
              <div className="text-[1.25rem] text-center">
                There is no any posts.
              </div>
            ) : (
              <ServerError />
            )
          ) : (
            posts.map((post, i) => {
              post = post.attributes;

              return (
                <div
                  key={i}
                  className={`space-y-5 ${
                    i === 0 && count % 3 === 1
                      ? "md:flex md:space-x-6 md:col-span-3"
                      : ""
                  }`}
                >
                  <div
                    className={`my-4 w-auto h-60 border border-1 border-gray-300 bg-white transition-all aspect-auto hover:scale-105 ${
                      i === 0 && count % 3 === 1
                        ? "md:w-2/4 md:h-auto"
                        : "md:h-48 lg:h-60"
                    }`}
                  >
                    <Link href={"/post/" + post.slug}>
                      <Image
                        width={200}
                        height={100}
                        src={post.image_url || ""}
                        alt={post.alternativeText || ""}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>

                  <div
                    className={`flex flex-col flex-[1_0_0%] space-y-2 ${
                      i === 0 && count % 3 === 1 ? "" : "justify-between"
                    }`}
                  >
                    <div
                      className={`text-[1.375rem] font-semibold leading-7 tracking-wider text-black-900 ${
                        i === 0 && count % 3 === 1
                          ? "md:text-[1.5rem] lg:text-[1.875rem] md:font-bold md:leading-8 lg:leading-10"
                          : "lg:text-[1.5rem] lg:leading-8"
                      }`}
                    >
                      <Link href={"/post/" + post.slug}>{post.title}</Link>
                    </div>
                    <div className="text-[1.0625rem] md:text-[1.125rem] lg:text-[1.13rem] lg:leading-7 tracking-wider text-gray-500">
                      <Link href={"/post/" + post.slug}>
                        <p className="line-clamp-3">{post.summary}</p>
                      </Link>
                    </div>
                    <div className="flex flex-row items-center pt-3 text-[0.875rem] lg:text-[1.125rem] text-gray-500">
                      <div className="relative w-[38px] h-[38px]">
                        <Image
                          width={200}
                          height={200}
                          className="absolute h-full w-full rounded-full object-cover inset-0"
                          src={post.authorImage}
                          alt={post.authorAltText}
                        />
                      </div>
                      <div className="pl-3 text-[0.875rem] md:text-[0.922rem] leading-5 tracking-wider">
                        <span className="text-green-700">
                          {post.authorName}
                        </span>

                        <div>
                          <span>{post.published_on}</span>
                          <span className="after:content-['\00B7'] after:mx-1"></span>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}

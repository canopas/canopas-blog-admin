import Image from "next/image";
import Link from "next/link";
import ServerError from "../components/errors/serverError";
import config from "../config";
import axios from "axios";
import Seo from "./seo";
import { setPostFields } from "../utils";

export async function getServerSideProps() {
  var response = null;
  var posts = [];
  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/posts?populate=deep&status=published"
    );
    posts = response.data.data;
    posts.forEach((post) => setPostFields(post));
  } catch (err) {
    response = err.response;
  }

  const status = response ? response.status : config.NOT_FOUND;
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
      <section className="container my-16 mx-2 sm:mx-auto">
        <div className="my-16 w-full bg-black-900">
          <div className="flex flex-col space-y-2 py-4 px-14 md:px-28 xl:px-44">
            <div className="w-20 md:w-1/5 ">
              <hr className="border-1 border-[#ff9472]" />
            </div>
            <div className="text-[1.5rem] md:text-[1.60rem] xl:text-[1.67rem] text-white font-semibold leading-tight md:leading-snug text-left tracking-wide">
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

        {count == 0 || status == config.NOT_FOUND ? (
          <div className="mt-20 text-[1.4rem] text-center text-black-900 ">
            {config.POST_NOT_FOUND_MESSAGE}
          </div>
        ) : status != config.SUCCESS ? (
          <ServerError />
        ) : (
          <div
            className={`grid gap-10 md:gap-5 lg:gap-10 md:grid-cols-3 ${
              count % 3 === 1 ? "md:col-span-1" : ""
            }`}
          >
            {posts.map((post, i) => {
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
                    className={`my-4 w-auto h-auto border border-1 border-gray-300 bg-white transition-all aspect-auto hover:scale-105 ${
                      i === 0 && count % 3 === 1 ? "md:w-3/5 lg:w-2/4" : ""
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
                      className={`text-[1.375rem] font-semibold leading-7 tracking-wide text-black-900 hover:underline underline-offset-4 transition-all hover:scale-[0.96] ${
                        i === 0 && count % 3 === 1
                          ? "md:text-[1.5rem] lg:text-[1.875rem] md:font-bold md:leading-8 lg:leading-10"
                          : "lg:text-[1.5rem] lg:leading-8"
                      }`}
                    >
                      <Link href={"/post/" + post.slug}>{post.title}</Link>
                    </div>
                    <div className="text-[1.0625rem] md:text-[1.125rem] lg:text-[1.13rem] lg:leading-7 tracking-wide text-gray-500">
                      <Link href={"/post/" + post.slug}>
                        <p className="line-clamp-3">{post.summary}</p>
                      </Link>
                    </div>
                    <div className="flex flex-row items-center pt-3 text-[0.875rem] lg:text-[1.125rem] text-gray-500">
                      <div className="relative w-[38px] h-[38px]">
                        <Link href={"/post/" + post.slug}>
                          <Image
                            width={200}
                            height={200}
                            className="absolute h-full w-full rounded-full object-cover inset-0"
                            src={post.authorImage}
                            alt={post.authorAltText}
                          />
                        </Link>
                      </div>
                      <Link href={"/post/" + post.slug}>
                        <div className="pl-3 text-[0.875rem] md:text-[0.922rem] leading-5 tracking-wide">
                          <span className="text-green-700">
                            {post.authorName}
                          </span>

                          <div>
                            <span>{post.published_on}</span>
                            <span className="after:content-['\00B7'] after:mx-1"></span>
                            <span>{post.readingTime} min read</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

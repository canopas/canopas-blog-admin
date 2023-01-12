import { fetchPost } from "../lib/post";
import { getReadingTime, formateDate } from "../utils";
import Image from "next/image";
import Link from "next/link";
import md from "markdown-it";
import Loader from "../components/loader";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import ServerError from "../components/errors/serverError";
import Avatar from "../assets/images/user.png";
import config from "../config";

export default function Home({ posts, status }) {
  const [query, setQuery] = useState("");
  const [searchBlogs, setResults] = useState(posts);

  const searchPost = (event) => {
    const query = event.target.value;
    setQuery(query);
    if (!query) {
      setResults(posts);
    } else {
      const filteredPosts = {};
      filteredPosts.data = posts.data.filter(function (post) {
        return post.attributes.slug.includes(query);
      });
      setResults(filteredPosts);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        {status != config.SUCCESS ? (
          status == config.NOT_FOUND ? (
            <div className="text-xl text-center">There is no any posts.</div>
          ) : (
            <ServerError />
          )
        ) : !searchBlogs || !searchBlogs.data ? (
          <Loader />
        ) : searchBlogs.data.length === 0 ? (
          <div className="text-xl text-center">There is no any posts.</div>
        ) : (
          searchBlogs.data.length != 0 &&
          searchBlogs.data.map((post) => {
            post = post.attributes;
            var authorData = post.authors.data.attributes.image.data;
            var authorImage = authorData ? authorData.attributes.url : Avatar;
            var authorAltText = authorData
              ? authorData.attributes.alternativeText
              : "author";
            return (
              <div
                key={post.id}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 xl:grid-cols-3 h-20 container"
              >
                <div
                  className="flex flex-col basis-[30%] justify-center hover:animate-jump-card -translate-y-6 m-2.5 flex-[1_1_0%] z-0 border shadow-md rounded-xl"
                  key={post.id}
                >
                  <div className="rounded-t-lg overflow-hidden relative pt-[52%]">
                    <div className="absolute inset-0">
                      <div className="relative">
                        {post.image.data.map((image) => (
                          <>
                            <Link
                              key={image.attributes.id}
                              href={"/post/" + post.slug}
                            >
                              <Image
                                layout="responsive"
                                objectFit="contain"
                                width={500}
                                height={500}
                                src={image.attributes.url || ""}
                                alt={image.alternativeText || ""}
                              />
                            </Link>
                          </>
                        ))}
                        <Link
                          href={
                            "/categories/" +
                            post.categories.data.attributes.slug
                          }
                          className="px-5 py-2 bg-pink-600 rounded-lg absolute top-[15px] right-[20px] cursor-pointer z-10 text-white hover:text-white active:scale-[0.98]"
                        >
                          {post.categories.data.attributes.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg">
                    <Link
                      href={"/post/" + post.slug}
                      className="text-black text-xl"
                    >
                      {post.title}
                    </Link>
                    <div>
                      <div
                        className="text-gray-800 mt-5 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: md({
                            html: true,
                          }).render(post.content),
                        }}
                      ></div>
                      <div className="pt-4">
                        <div className="flex flex-row items-center justify-between">
                          <div className="relative flex">
                            <Link
                              href={
                                "/author/" + post.authors.data.attributes.slug
                              }
                              className="relative w-[40px] h-[40px]"
                            >
                              <Image
                                className="rounded-full h-full w-full object-cover absolute inset-0"
                                layout="fill"
                                objectFit="cover"
                                src={authorImage}
                                alt={authorAltText}
                              />
                            </Link>
                            <div className="pl-3 text-sm">
                              <Link
                                href={
                                  "/author/" + post.authors.data.attributes.slug
                                }
                                className="text-gray-800 "
                              >
                                {post.authors.data.attributes.name}
                              </Link>
                              <div className="text-gray-500 ">
                                <span>{post.publishedAt}</span>
                                <span className=" after:content-['\00B7'] after:mx-1 "></span>
                                <span>{post.readingTime} min read</span>
                              </div>
                            </div>
                          </div>

                          <span className="pl-4 text-gray-500">
                            <FontAwesomeIcon
                              icon={faMessage}
                              className="pr-1 text-sm"
                            />
                            {post.comments.data.length}
                          </span>
                        </div>
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
  );
}

export async function getStaticProps() {
  const [status, posts] = await fetchPost();

  if (posts && posts.data) {
    for (let i = 0; i < posts.data.length; i++) {
      const post = posts.data[i].attributes;
      var [date, _] = await formateDate(post.publishedAt);
      post.publishedAt = date;
      post.readingTime = await getReadingTime(post.content);
    }
  }
  return {
    props: {
      posts,
      status,
    },
  };
}

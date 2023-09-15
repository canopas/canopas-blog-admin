import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import config from "../config";
import axios from "axios";
import Seo from "./seo";
import {
  setPostFields,
  calculateWeight,
  filterPostsByCategory,
} from "../utils";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
const ServerError = dynamic(() => import("../components/errors/serverError"), {
  ssr: false,
});

export async function getServerSideProps({ req, res }) {
  var response = null;
  var posts = [];
  var categories = [];

  try {
    let published = config.SHOW_DRAFT_POSTS
      ? "&publicationState=preview"
      : "&publicationState=live";
    let url = config.STRAPI_URL + "/v1/posts?populate=deep" + published;
    response = await axios.get(url);
    posts = response.data.data;
    posts.forEach((post) => setPostFields(post));
  } catch (err) {
    response = err.response;
  }

  const status = response ? response.status : config.NOT_FOUND;

  // fetch All Categories
  if (config.SHOW_CATEGORY_POSTS) {
    try {
      response = await axios.get(
        config.STRAPI_URL + "/v1/categories?populate=deep",
      );
      categories = response.data.data;
    } catch (err) {
      console.log(err);
    }
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59",
  );

  return { props: { posts, status, categories } };
}

export default function Home({ posts, status, categories, mixpanel }) {
  const [results, setResults] = useState(posts);
  const [displayedPosts, setDisplayedPosts] = useState(10);
  const featurePosts = results.filter((post) => post.attributes.is_featured);
  const [categoryPosts, setCategoryPosts] = useState(posts);
  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const count = results.length;
  const category = "home";

  console.log("hello");
  const filterBlogs = (event) => {
    setDisplayedPosts(10);
    if (event.target.innerHTML == category) {
      setCategoryPosts(posts);
      setResults(posts);
    } else {
      let results = filterPostsByCategory(posts, event.target.innerHTML);
      setCategoryPosts(results);
      setResults(results);
    }
  };

  const searchBlogs = (keyword) => {
    const result = categoryPosts
      .map((post) => ({
        post,
        weight: calculateWeight(post, keyword),
      }))
      .filter((result) => result.weight > 0);

    result.sort((a, b) => b.weight - a.weight);

    return result.map((result) => result.post);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setDisplayedPosts((prev) => prev + 5);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Seo
        title={config.SEO_META_DATA.title}
        description={config.SEO_META_DATA.description}
        authorName={config.SEO_META_DATA.authorName}
      />
      <section className="container min-h-[50vh] my-14 mx-2 sm:mx-auto 3xl:px-24">
        {config.SHOW_HEADER_TITLE && (
          <div className="my-16 w-full bg-black-900">
            <div className="flex flex-col space-y-2 py-4 px-14 md:px-28 xl:px-44">
              <div className="w-20 md:w-1/5 ">
                <hr className="border-1 border-[#ff9472]" />
              </div>
              <div className="text-[1.5rem] md:text-[1.60rem] xl:text-[1.67rem] text-white font-semibold leading-tight md:leading-snug text-left tracking-normal">
                On a mission to help you become a better{" "}
                <span className="text-[#ff9472]">Software Engineer</span>.
                Sharing knowlegde on{" "}
                <span className="text-[#ff9472]">
                  #android, #iOS, #web, & #programming.
                </span>
              </div>
            </div>
          </div>
        )}

        {(config.SHOW_CATEGORY_POSTS || config.SHOW_SEARCH_POSTS) && (
          <div className="flex flex-col 2xl:flex-row space-y-8 2xl:space-y-0 2xl:justify-between 2xl:items-center my-14 category-swiper">
            {categories.length != 0 ? (
              <div className="2xl:basis-8/12 h-10 border-b border-[#e6e6e6]">
                <Swiper
                  navigation={true}
                  onClick={(swiper) => setActiveIndex(swiper.clickedIndex)}
                  modules={[Navigation]}
                  breakpoints={{
                    0: {
                      slidesPerView: 2,
                    },
                    576: {
                      slidesPerView: 3,
                    },
                    1200: {
                      slidesPerView: 4,
                    },
                  }}
                >
                  <SwiperSlide
                    onClick={filterBlogs}
                    className={`pb-[0.9rem] capitalize ${
                      activeIndex == "0"
                        ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] gradient-text "
                        : ""
                    }`}
                  >
                    {category}
                  </SwiperSlide>

                  {categories.map((category, index) => {
                    return (
                      <SwiperSlide
                        key={category.id}
                        onClick={filterBlogs}
                        className={`pb-[0.9rem] capitalize ${
                          activeIndex == index + 1
                            ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r from-[#f2709c] to-[#ff9472] gradient-text "
                            : ""
                        }`}
                      >
                        {category.attributes.name}
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            ) : null}

            {config.SHOW_SEARCH_POSTS && (
              <div className="flex flex-row items-center 2xl:basis-3/12 w-80 h-12 rounded-[10px] !bg-gray-100 pl-3">
                <span>
                  <i className="rounded-full text-black-core/[0.65] cursor-pointer">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="w-[1.1rem] h-5 pr-1 text-sm"
                    />
                  </i>
                </span>
                <input
                  className="!border-0 !bg-gray-100 ml-1.5 focus:outline-none"
                  placeholder="Search Blogs"
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setResults(searchBlogs(e.target.value));
                  }}
                />
              </div>
            )}
          </div>
        )}
        {count == 0 || status == config.NOT_FOUND ? (
          <div className="py-40 text-[1.4rem] text-center text-black-900 ">
            {config.POST_NOT_FOUND_MESSAGE}
          </div>
        ) : status != config.SUCCESS ? (
          <ServerError />
        ) : (
          <>
            {/* Featured Posts Section */}
            {featurePosts.length != 0 ? (
              <>
                <span className="text-[2.375rem] tracking-none font-inter font-bold">
                  Featured
                </span>
                <div className="grid gap-10 md:gap-5 lg:gap-10 md:grid-cols-3 mt-8">
                  {featurePosts.map((featurePost, i) => {
                    featurePost = featurePost.attributes;
                    if (i < 6) {
                      return (
                        <div key={featurePost.slug} className="space-y-2">
                          <div
                            className={`w-auto h-auto border border-1 border-gray-300 transition-all aspect-auto hover:scale-105 md:h-[7.742rem] lg:h-[10.085rem] xl:h-[12.195rem] 2xl:h-[14.304em] ${
                              featurePost.image.data == null
                                ? "bg-black-900"
                                : ""
                            } `}
                          >
                            <Link
                              href={"/" + featurePost.slug}
                              aria-label={
                                "Read more about " + featurePost.title
                              }
                            >
                              <Image
                                width={100}
                                height={100}
                                src={featurePost.image_url || ""}
                                alt={featurePost.alternativeText || ""}
                                loading="lazy"
                                className={`${
                                  featurePost.image.data == null
                                    ? "w-[45%] h-4/5 mx-auto my-[5%]"
                                    : "w-full h-full"
                                } object-cover`}
                              />
                            </Link>
                          </div>
                          <div className="items-center !text-black-core/[0.65]">
                            <Link href={"/" + featurePost.slug}>
                              <div className="flex flex-row justify-between text-sm tracking-wide">
                                <div>
                                  <span>{featurePost.published_on}</span>
                                  <span className="hidden lg:inline-block after:content-['\00B7'] after:mx-1"></span>
                                  <span className="hidden lg:inline-block">
                                    {featurePost.readingTime} min read
                                  </span>
                                </div>
                                <span className="text-green-700 capitalize line-clamp-1">
                                  {featurePost.authorName}
                                </span>
                              </div>
                              <div
                                className="my-2 text-[1.3125rem] leading-7 md:text-xl lg:text-[1.4375rem] lg:leading-8 tracking-none text-black-core/[0.87] hover:underline underline-offset-4 transition-all hover:scale-[0.96]
                         font-inter font-semibold"
                                onClick={() => {
                                  mixpanel.track("tap_blog_title", {
                                    Title: featurePost.title,
                                  });
                                }}
                              >
                                {featurePost.title}
                              </div>
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                {featurePosts.length > 6 ? (
                  <div className="flex justify-end mt-10">
                    <Link
                      href="/featured"
                      className="relative rounded-full border border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] py-2 font-inter font-semibold text-white"
                    >
                      <span className="py-4 px-[1.05rem] tracking-none hoverable-text">
                        Read More Featured
                      </span>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                <hr className="my-10" />
                <span className="text-[2.375rem] tracking-none font-inter font-bold">
                  Blogs
                </span>
              </>
            ) : (
              ""
            )}
            <div
              className={`grid gap-10 md:gap-5 lg:gap-10 md:grid-cols-3 mt-5 ${
                count % 3 === 1 ? "md:col-span-1" : ""
              }`}
            >
              {results.slice(0, displayedPosts).map((post, i) => {
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
                      className={`my-4 w-auto h-auto border border-1 border-gray-300 transition-all aspect-auto hover:scale-105 ${
                        i === 0 && count % 3 === 1
                          ? `md:w-3/5 lg:w-2/4 md:h-[14.7rem] lg:h-[16.51rem] xl:h-[19.67rem] 2xl:h-[22.836rem] ${
                              post.image.data == null ? " bg-black-900" : ""
                            }`
                          : `md:h-[7.742rem] lg:h-[10.085rem] xl:h-[12.195rem] 2xl:h-[14.304em] ${
                              post.image.data == null ? " bg-black-900" : ""
                            } `
                      }`}
                    >
                      <Link
                        href={"/" + post.slug}
                        aria-label={"Read more about " + post.title}
                      >
                        <Image
                          width={100}
                          height={100}
                          src={post.image_url || ""}
                          alt={post.alternativeText || ""}
                          loading="lazy"
                          className={`${
                            post.image.data == null
                              ? "w-[46%] h-4/5 mx-auto my-[5%]"
                              : "w-full h-full"
                          } object-cover`}
                        />
                      </Link>
                    </div>

                    <div
                      className={`flex flex-col flex-[1_0_0%] space-y-2 ${
                        i === 0 && count % 3 === 1 ? "" : "justify-between"
                      }`}
                    >
                      <div
                        className={`text-[1.3125rem] leading-7 sm:text-[1.375rem] sm:leading-[1.875rem] tracking-none text-black-core/[0.87] hover:underline underline-offset-4 transition-all hover:scale-[0.96] font-inter font-semibold ${
                          i === 0 && count % 3 === 1
                            ? "md:text-2xl xl:text-3xl xl:leading-10"
                            : "md:text-xl lg:text-[1.4375rem] lg:leading-8"
                        }`}
                      >
                        <Link
                          href={"/" + post.slug}
                          onClick={() => {
                            mixpanel.track("tap_blog_title", {
                              Title: post.title,
                            });
                          }}
                        >
                          {post.title}
                        </Link>
                      </div>
                      <div className="text-[1.0625rem] md:text-base lg:text-lg tracking-wide text-black-core/[0.65]">
                        <Link href={"/" + post.slug}>
                          <p className="line-clamp-3 ">{post.summary}</p>
                        </Link>
                      </div>
                      <div className="flex flex-row items-center pt-3 text-sm xl:text-lg text-black-core/[0.65]">
                        <div className="relative w-10 md:w-[41px] h-10 max-w-full max-h-full overflow-hidden">
                          <Link href={"/" + post.slug}>
                            <Image
                              width={40}
                              height={40}
                              className="absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] rounded-full object-cover"
                              src={post.authorImage}
                              alt={post.authorAltText}
                              loading="lazy"
                            />
                          </Link>
                        </div>
                        <Link href={"/" + post.slug}>
                          <div className="pl-3 text-sm tracking-wide">
                            <span className="text-green-700 capitalize">
                              {post.authorName}
                            </span>

                            <div>
                              <span>{post.published_on}</span>
                              <span className="after:content-['\00B7'] after:mx-1"></span>
                              <span>{post.readingTime} min read</span>
                              {post.publishedAt == null ? (
                                <>
                                  <span className="after:content-['\00B7'] after:mx-1"></span>
                                  <span className="text-green-700 capitalize">
                                    draft
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
}

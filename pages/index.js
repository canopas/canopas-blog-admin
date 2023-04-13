import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ServerError from "../components/errors/serverError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import config from "../config";
import axios from "axios";
import Seo from "./seo";
import { setPostFields, calculateWeight } from "../utils";

export async function getServerSideProps() {
  var response = null;
  var posts = [];
  var categories = [];

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

  // fetch All Categories
  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/categories?populate=deep"
    );
    categories = response.data.data;
  } catch (err) {
    response = err.response;
  }

  return { props: { posts, status, categories } };
}

function searchBlogs(posts, keyword) {
  const results = posts
    .map((post) => ({
      post,
      weight: calculateWeight(post, keyword),
    }))
    .filter((result) => result.weight > 0);

  results.sort((a, b) => b.weight - a.weight);

  return results.map((result) => result.post);
}

export default function Home({ posts, status, categories }) {
  var [results, setResults] = useState(posts);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Categories");
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const count = results.length;

  const filterBlogs = (event) => {
    setCategory(event.target.innerText);
    if (event.target.innerText == "Categories") {
      setResults(posts);
    } else {
      results = posts.filter(
        (result) =>
          result.attributes.category.data != null &&
          result.attributes.category.data.attributes.name ==
            event.target.innerText
      );
      setResults(results);
    }
    setdropdownOpen(false);
  };

  return (
    <>
      <Seo
        title="Canopas Blogs"
        description="Canopas Blogs will help you to become a better software developer. We are sharing knowledge on Web, Backend, iOS, Android, and Flutter development"
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

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:justify-between md:items-center mb-20">
          <div className="pl-3 w-72 rounded-[10px] !bg-gray-100">
            <span>
              <i className="w-16 h-16 rounded-full text-gray-500 cursor-pointer">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="pr-1 text-sm"
                />
              </i>
            </span>
            <input
              className="!border-0 !bg-gray-100"
              placeholder="Search Blogs"
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setResults(searchBlogs(posts, e.target.value));
              }}
            />
          </div>

          {categories.length != 0 ? (
            <div
              className="order-last w-72 rounded-[10px] !bg-gray-100"
              onMouseEnter={() => setdropdownOpen(true)}
              onMouseLeave={() => setdropdownOpen(false)}
            >
              <div
                className="grid grid-cols-3 justify-items-stretch items-center bg-transparent p-1.5 lg:text-md text-gray-600 outline-none
                            hover:cursor-pointer"
              >
                <span className="col-span-2 p-2 line-clamp-1">{category}</span>

                <span className="justify-self-end mr-4 w-2">
                  <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
                </span>
              </div>

              <div
                className={`${
                  dropdownOpen ? `opacity-100 visible` : "opacity-0 invisible"
                } absolute mt-1 rounded-[10px] drop-shadow-md bg-white py-1 transition-all`}
              >
                <div
                  onClick={filterBlogs}
                  className="block my-3 pl-4 w-72 text-base lg:text-[1.06rem] text-slate-600 hover:bg-gradient-to-r from-pink-300 to-orange-300 hover:text-transparent hover:bg-clip-text hover:cursor-pointer"
                >
                  Categories
                </div>

                {categories.map((category) => {
                  return (
                    <div
                      key={category.id}
                      onClick={filterBlogs}
                      className="block my-3 pl-4 w-72 text-base lg:text-[1.06rem] text-slate-600 hover:bg-gradient-to-r from-pink-300 to-orange-300 hover:text-transparent hover:bg-clip-text hover:cursor-pointer"
                    >
                      {category.attributes.name}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

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
            {results.map((post, i) => {
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
                        ? `md:w-3/5 lg:w-2/4 ${
                            post.image.data == null
                              ? "md:h-[14.7rem] lg:h-[16.51rem] xl:h-[19.67rem] 2xl:h-[22.836rem] bg-black-900"
                              : ""
                          }`
                        : `${
                            post.image.data == null
                              ? "md:h-[7.742rem] lg:h-[10.085rem] xl:h-[12.195rem] 2xl:h-[14.304em] bg-black-900"
                              : ""
                          } `
                    }`}
                  >
                    <Link
                      href={"/resources/" + post.slug}
                      aria-label={"Read more about " + post.title}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={post.image_url || ""}
                        alt={post.alternativeText || ""}
                        loading="eager"
                        className={`${
                          post.image.data == null
                            ? "w-[45%] h-4/5 mx-auto my-[5%]"
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
                      className={`text-[1.375rem] font-semibold leading-7 tracking-wide text-[#000000d6] hover:underline underline-offset-4 transition-all hover:scale-[0.96] ${
                        i === 0 && count % 3 === 1
                          ? "md:text-[1.5rem] lg:text-[1.875rem] md:font-bold md:leading-8 lg:leading-10"
                          : "lg:text-[1.5rem] lg:leading-8"
                      }`}
                    >
                      <Link href={"/resources/" + post.slug}>{post.title}</Link>
                    </div>
                    <div className="text-[1.0625rem] md:text-[1.125rem] lg:text-[1.13rem] lg:leading-7 tracking-wide text-gray-500">
                      <Link href={"/resources/" + post.slug}>
                        <p className="line-clamp-3">{post.summary}</p>
                      </Link>
                    </div>
                    <div className="flex flex-row items-center pt-3 text-[0.875rem] lg:text-[1.125rem] text-gray-500">
                      <div className="relative w-[38px] h-[38px]">
                        <Link href={"/resources/" + post.slug}>
                          <Image
                            width={200}
                            height={200}
                            className="absolute h-full w-full rounded-full object-cover inset-0"
                            src={post.authorImage}
                            alt={post.authorAltText}
                          />
                        </Link>
                      </div>
                      <Link href={"/resources/" + post.slug}>
                        <div className="pl-3 text-[0.875rem] md:text-[0.922rem] leading-5 tracking-wide">
                          <span className="text-green-700 capitalize">
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

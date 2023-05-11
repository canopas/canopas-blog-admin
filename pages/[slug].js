import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import config from "../config";
import Seo from "./seo";
import NotFound from "./404";
import Comment from "../components/comments/index";
import RecommandedPosts from "../components/posts/recommandedPosts";
import { setPostFields } from "../utils";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faTags,
  faLink,
  faXmark,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faReddit,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import hljs from "highlight.js";

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  var response,
    postData = null;
  var categoryPosts = [];

  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/posts/" + slug + "?populate=deep"
    );
    postData = response.data.data;
    setPostFields(postData);
  } catch (err) {
    response = err.response;
  }

  const status = response ? response.status : config.NOT_FOUND;

  // fetch posts other than this post by category name
  try {
    response = await axios.get(
      config.STRAPI_URL +
        "/v1/posts?filters[category][name][$eq]=" +
        postData.attributes.category.data.attributes.name +
        "&filters[slug][$ne]=" +
        slug
    );
    categoryPosts = response.data.data;
    categoryPosts.forEach((post) => setPostFields(post));
  } catch (err) {
    response = err.response;
  }

  return { props: { postData, status, categoryPosts } };
}

export default function Post({ postData, status, categoryPosts, mixpanel }) {
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  setTimeout(() => {
    setLoaded(true);
  }, 50);

  if (copied) {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (postData) {
    var post = postData.attributes;
    if (post.published_on == "Draft" && !config.SHOW_DRAFT_POSTS) {
      status = config.NOT_FOUND;
    } else {
      var published_on = post.published_on.replace(",", "");
      var published_time = new Date(post.publishedAt).toLocaleTimeString();
      var tags = [];
      if (post.tags) {
        tags = post.tags.map((tag) => {
          return tag.name;
        });
      }

      var tagsString = tags.join(", ");

      var indexContent = null;
      var blogContent = post.content.replace(
        /<img/g,
        '<img class="mx-auto aspect-w-2 sm:object-cover" style="width:min-content;height:min-content"'
      );

      // table of contents formation
      if (post.toc) {
        indexContent = post.toc.replace(/<a\s+href="(.*?)"/g, (match, href) => {
          let classes =
            "text-ellipsis hover:bg-gradient-to-r from-pink-300 to-orange-300 hover:text-transparent hover:bg-clip-text";
          if (href === activeId) {
            classes +=
              " relative bg-gradient-to-r bg-clip-text text-transparent after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gradient-to-r";
          }
          return `<a href="${href}" class="${classes}"`;
        });
      }

      var handleClick = (event) => {
        event.preventDefault();
        var linkHref = event.target.getAttribute("href");
        var element = contentRef.current.querySelector(linkHref);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 90,
            behavior: "smooth",
          });
        }
      };
    }
  }

  const handleScroll = () => {
    const headers = contentRef.current.querySelectorAll("h1, h2");
    headers.forEach((header, index) => {
      const documentHeight = document.body.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      if (currentScroll > documentHeight) {
        setActiveId("#" + header.id);
      } else {
        if (header.offsetTop - window.pageYOffset <= 200) {
          setActiveId("#" + header.id);
        }
      }
    });
  };

  const copyLink = () => {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  };

  const shareBlog = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.meta_description,
        url: config.CANOPAS_URL + "/resources/" + post.slug,
      });
    } catch (err) {}
  };

  useEffect(() => {
    if (postData) {
      hljs.highlightAll();
      setLoaded(false);

      document.querySelectorAll("oembed[url]").forEach((element) => {
        if (
          typeof iframely !== "undefined" &&
          !element.getAttribute("data-loaded")
        ) {
          iframely.load(element, element.attributes.url.value);
          element.setAttribute("data-loaded", true);
        }
      });
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [blogContent]);

  useLayoutEffect(() => {
    import("smoothscroll-polyfill").then(({ default: smoothscroll }) => {
      smoothscroll.polyfill();
    });

    window.__forceSmoothScrollPolyfill__ = true;
  }, []);

  return (
    <>
      <Script
        src={
          "//cdn.iframe.ly/embed.js?card=small&key=" +
          process.env.NEXT_PUBLIC_IFRAMELY_KEY
        }
        onLoad={() => {
          // Load media preview
          document.querySelectorAll("oembed[url]").forEach((element) => {
            iframely.load(element, element.attributes.url.value);
          });
        }}
      />

      <section className="container my-16">
        <div>
          {status == config.NOT_FOUND || post == null ? (
            <NotFound />
          ) : (
            <>
              <Seo
                title={post.title}
                description={post.meta_description}
                authorName={post.authorName}
                url={`${config.CANOPAS_URL}/resources/${post.slug}`}
                date={post.published_on}
                image_url={post.image_url}
                publishedAt={post.published_on}
                publishedTime={published_time}
                readingTime={post.readingTime}
                article={true}
              />
              <div key={post.id} className="flex flex-col space-y-20">
                {/* Header */}
                <div className="grid grid-flow-row xl:grid-flow-col gap-10 xl:gap-8 w-90 h-90 rounded-3xl md:bg-[#14161E] md:py-20 md:px-10 xl:py-14 xl:px-8 ">
                  <div className="md:container w-full xl:w-[35rem] 2xl:w-[42rem] h-auto sm:h-[18rem] md:h-[21rem] lg:h-[30rem] xl:h-[19rem] 2xl:h-[23rem]">
                    <Image
                      width={200}
                      height={200}
                      src={post.image_url || ""}
                      alt={post.alternativeText || ""}
                      loading="eager"
                      className={`${
                        post.image.data == null
                          ? "w-[45%] h-4/5 mx-auto my-[5%]"
                          : `mx-auto rounded-2xl lg:rounded-3xl object-cover ${
                              loaded
                                ? "w-full h-full transition-all duration-[800ms] ease-out"
                                : "w-[95%] h-[95%] opacity-10"
                            }`
                      } `}
                    />
                  </div>

                  <div className="flex flex-col space-y-5 md:text-white ">
                    <h1 className="text-[2.20rem] lg:text-[2.50rem] xl:text-[2.80rem] font-normal leading-10 lg:leading-tight tracking-wide">
                      {post.title}
                    </h1>
                    <div className="flex flex-row items-center space-x-4 text-[1rem] leading-6 tracking-wide">
                      <div className="w-5 h-5">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="w-full h-full text-sm"
                        />
                      </div>
                      <div>
                        <span>{published_on}</span> ·{" "}
                        <span> {post.readingTime} min read</span>
                      </div>
                    </div>
                    {tagsString ? (
                      <div className="flex flex-row items-center space-x-4 text-[1rem] leading-6 tracking-wide">
                        <div className="w-5 h-5">
                          <FontAwesomeIcon
                            icon={faTags}
                            className="w-full h-full text-sm"
                          />
                        </div>
                        <div className="capitalize">{tagsString}</div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="text-[1rem] md:text-[1.09rem] xl:text-[1.13rem] leading-6 md:leading-7 tracking-wide">
                      {post.summary}
                    </div>
                    <div className="grid grid-cols-2 items-center text-sm">
                      <div className="flex flex-row items-center space-x-4">
                        <div className="relative w-[45px] h-[45px]">
                          <Image
                            width={200}
                            height={200}
                            className="absolute w-full h-full rounded-full object-cover inset-0"
                            src={post.authorImage}
                            alt={post.authorAltText}
                          />
                        </div>
                        <div className="text-[1rem] md:text-[1.09rem] xl:text-[1.13rem] leading-5 tracking-wide">
                          {post.authorName}
                        </div>
                      </div>

                      <div className="justify-self-end">
                        <div className="mr-4 lg:hidden">
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="w-6 h-6 sm:w-7 sm:h-7 hover:cursor-pointer"
                            onClick={() => {
                              mixpanel.track("tap_share_mobile"), shareBlog();
                            }}
                          />
                        </div>

                        <div className="hidden lg:flex flex-row space-x-4 mr-4">
                          <FontAwesomeIcon
                            icon={faFacebook}
                            className="w-7 h-7 sm:w-6 sm:h-6 hover:cursor-pointer"
                            onClick={() => {
                              mixpanel.track("tap_share_facebook");
                              window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                  config.CANOPAS_URL + "/resources/" + post.slug
                                )}`,
                                "_blank"
                              );
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faLinkedinIn}
                            className="w-7 h-7 sm:w-6 sm:h-6 hover:cursor-pointer"
                            onClick={() => {
                              mixpanel.track("tap_share_linkedin");
                              window.open(
                                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                  config.CANOPAS_URL + "/resources/" + post.slug
                                )}`,
                                "_blank"
                              );
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faTwitter}
                            className="w-7 h-7 sm:w-6 sm:h-6 hover:cursor-pointer"
                            onClick={() => {
                              mixpanel.track("tap_share_twitter");
                              window.open(
                                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                  post.title
                                )}&url=${encodeURIComponent(
                                  config.CANOPAS_URL + "/resources/" + post.slug
                                )}`,
                                "_blank"
                              );
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faReddit}
                            className="w-7 h-7 sm:w-6 sm:h-6 hover:cursor-pointer"
                            onClick={() => {
                              mixpanel.track("tap_share_reddit");
                              window.open(
                                `https://www.reddit.com/submit?url=${encodeURIComponent(
                                  config.CANOPAS_URL + "/resources/" + post.slug
                                )}`,
                                "_blank"
                              );
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faLink}
                            className="w-7 h-7 sm:w-6 sm:h-6 hover:cursor-pointer"
                            onClick={() => {
                              mixpanel.track("tap_copy_link"), copyLink();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table of Contents */}
                <div
                  className={`flex flex-col xl:flex-row space-y-20 xl:space-y-0 ${
                    categoryPosts.length != 0 && config.SHOW_RECOMMANDED_POSTS
                      ? "xl:space-x-6 2xl:space-x-8 3xl:space-x-12 xl:mx-0"
                      : "xl:space-x-10 2xl:space-x-20 xl:mx-8 2xl:mx-20 3xl:mx-32"
                  }  mx-2 lg:mx-24 rounded-3xl text-[1.125rem]`}
                >
                  <div className="relative w-full xl:w-[40%]">
                    <div className="xl:sticky top-24 flex flex-col">
                      {indexContent != null ? (
                        <div className="w-full h-fit border border-1 border-black-900 rounded-[12px]">
                          <div className="rounded-t-[12px] bg-gray-100 py-5 pl-4">
                            Table of contents
                          </div>
                          <div className="pl-5 pr-6 tracking-[0.02em] leading-relaxed">
                            <div className="mt-4 text-[1.125rem] text-[#374151] list-none ">
                              <div
                                className="my-3"
                                onClick={handleClick}
                                dangerouslySetInnerHTML={{
                                  __html: indexContent,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* main article */}
                  <div className="prose lg:prose-lg xl:w-full 2xl:w-auto">
                    <div
                      ref={contentRef}
                      dangerouslySetInnerHTML={{
                        __html: blogContent,
                      }}
                    ></div>
                    <div className="flex flex-row flex-wrap mt-20">
                      {post.tags
                        ? post.tags.map((tag) => {
                            return (
                              <div className="my-4 mr-4" key={tag.id}>
                                <Link
                                  href={"/tag/" + tag.slug}
                                  className="rounded-full bg-[#f2f2f2] shadow-[4px_4px_4px_rgba(0,0,0,0.19)] px-6 py-2 no-underline capitalize"
                                  onClick={() => {
                                    mixpanel.track(
                                      "tap_tag_" + tag.slug.replace("-", "_")
                                    );
                                  }}
                                >
                                  {tag.name}
                                </Link>
                              </div>
                            );
                          })
                        : ""}
                    </div>
                  </div>
                  {/* Recommended Posts Section Desktop View */}

                  {categoryPosts.length != 0 &&
                  config.SHOW_RECOMMANDED_POSTS ? (
                    <div className="relative w-[40%]">
                      <div className="xl:sticky top-28">
                        <div className="hidden xl:block w-full h-fit">
                          <RecommandedPosts
                            postData={[categoryPosts, mixpanel]}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Recommended Posts Section Mobile,Tablet View*/}
              {categoryPosts.length != 0 && config.SHOW_RECOMMANDED_POSTS ? (
                <div className="container inline-block xl:hidden mt-10 lg:mx-4">
                  <hr className="mb-10" />
                  <RecommandedPosts postData={[categoryPosts, mixpanel]} />
                </div>
              ) : (
                ""
              )}

              {/* comments */}
              <Comment post={postData} />
            </>
          )}
        </div>
        {copied ? (
          <div className="sticky bottom-8 inset-x-[7%] sm:inset-x-1/4 xl:inset-x-1/3 flex flex-rows justify-between items-center w-[90%] sm:w-7/12 xl:w-5/12 z-10 rounded-[10px] bg-gradient-to-r from-[#f2709c] to-[#ff9472] py-5 text-white">
            <p className="mx-7 tracking-wider text-xl font-medium">
              Link copied
            </p>
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 mr-5 hover:cursor-pointer"
              onClick={() => {
                setCopied(false);
              }}
            />
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
}

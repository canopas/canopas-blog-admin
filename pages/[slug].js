import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Script from "next/script";
import axios from "axios";
import config from "../config";
import Seo from "./seo";
import NotFound from "./404";
import { setPostFields, filterPostsByCategoryAndTag } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import hljs from "highlight.js/lib/common";

const CTA1 = dynamic(() => import("../components/cta/CTA1"), { ssr: false });
const CTA2 = dynamic(() => import("../components/cta/CTA2"), { ssr: false });
const CTA3 = dynamic(() => import("../components/cta/CTA3"), { ssr: false });
const CTA4 = dynamic(() => import("../components/cta/CTA4"), { ssr: false });
const CTA5 = dynamic(() => import("../components/cta/CTA5"), { ssr: false });
const Comment = dynamic(() => import("../components/comments/index"), {
  ssr: false,
});
const RecommandedPosts = dynamic(
  () => import("../components/posts/recommandedPosts"),
  { ssr: false },
);
const AuthorDetails = dynamic(() => import("../components/authorDetails"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  let response,
    postData = null;
  let posts = [];

  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/posts/" + slug + "?populate=deep",
    );
    postData = response.data.data;
    setPostFields(postData);
  } catch (err) {
    response = err.response;
  }

  const status = response ? response.status : config.NOT_FOUND;

  // fetch posts other than this post by category name
  let published = config.SHOW_DRAFT_POSTS
    ? "&publicationState=preview"
    : "&publicationState=live";
  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/posts?filters[slug][$ne]=" + slug + published,
    );
    posts = response.data.data;
    posts.forEach((post) => setPostFields(post));
  } catch (err) {
    console.log(err);
  }

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59",
  );

  return { props: { postData, status, posts } };
}

export default function Post({ postData, status, posts, mixpanel }) {
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [alerts, setAlerts] = useState(false);
  const [message, setMessage] = useState("");
  const [headerHeight, setHeaderHeight] = useState("");
  const contentRef = useRef(null);
  let relatedPosts = [];
  let firstHeadingId;

  setTimeout(() => {
    setLoaded(true);
  }, 50);

  if (alerts) {
    setTimeout(() => {
      setAlerts(false);
    }, 2000);
  }

  if (!postData) {
    status = config.NOT_FOUND;
  }

  let post = postData?.attributes;
  let CTAData = post?.cta.data;
  let published_on = post?.published_on.replace(",", "");
  let published_time = new Date(post?.publishedAt).toLocaleTimeString();

  if (post?.published_on == "Draft" && !config.SHOW_DRAFT_POSTS) {
    status = config.NOT_FOUND;
  }

  const tagsString = post?.tags
    .map((tag) => {
      return tag.name;
    })
    .join(", ");

  const blogContent = post?.content.replace(
    /<img/g,
    '<img class="mx-auto aspect-w-2 sm:object-cover" style="width:min-content;height:min-content"',
  );

  // table of contents formation
  const indexContent = post?.toc?.replace(
    /<a\s+href="(.*?)"/g,
    (match, href) => {
      let match2 = /#([^-\n]+-0)\b/g.exec(href);

      let classes =
        "text-ellipsis hover:bg-gradient-to-r from-pink-300 to-orange-300 hover:text-transparent hover:bg-clip-text";
      if (href === activeId) {
        classes +=
          " relative bg-gradient-to-r bg-clip-text text-transparent after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-gradient-to-r";
      } else if (match2 && match2[1]) {
        firstHeadingId = match2[1].replace("#", "");
      }

      return `<a href="${href}" class="${classes}"`;
    },
  );

  const handleClick = (event) => {
    event.preventDefault();
    let linkHref = event.target.getAttribute("href");
    let element = contentRef.current.querySelector(linkHref);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - headerHeight,
        behavior: "smooth",
      });
    }
  };
  relatedPosts = filterPostsByCategoryAndTag(post, posts);

  const handleScroll = () => {
    if (contentRef.current) {
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
    }
  };

  const copyLink = () => {
    mixpanel.track("tap_copy_link");
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setAlerts(true);
    setMessage("Link Copied");
  };

  const shareBlog = async () => {
    mixpanel.track("tap_share_mobile");
    try {
      await navigator.share({
        title: post.title,
        text: post.meta_description,
        url: config.WEBSITE_URL + "/resources/" + post.slug,
      });
    } catch (err) {}
  };

  useEffect(() => {
    if (postData) {
      hljs.highlightAll();
      setLoaded(false);

      let element = document.getElementById(firstHeadingId);
      if (element) {
        element.style.marginTop = "0";
      }

      setHeaderHeight(
        document.getElementsByTagName("header")["0"].clientHeight,
      );

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
  }, [blogContent, firstHeadingId, postData]);

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

      <section>
        {status == config.NOT_FOUND || post == null ? (
          <NotFound />
        ) : (
          <>
            <div className="container mt-16 mb-10 md:mb-24">
              <Seo
                title={post.title}
                description={post.meta_description}
                authorName={post.authorName}
                url={`${config.WEBSITE_URL}/resources/${post.slug}`}
                date={post.published_on}
                image_url={post.image_url}
                publishedAt={post.published_on}
                publishedTime={published_time}
                readingTime={post.readingTime}
                article={true}
                keywords={post.keywords || post.title}
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
                        {post.publishedAt == null ? (
                          <>
                            <span className="after:content-['\00B7'] after:mx-1"></span>
                            <span className="text-green-600 capitalize">
                              draft
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {tagsString ? (
                      <div className="flex flex-row 3xl:items-center space-x-3 text-[1rem] leading-6 tracking-wide">
                        <div className="sm:basis-6 w-5 h-5 mt-1.5 sm:mt-0.5 xl:mt-1.5 3xl:mt-0">
                          <FontAwesomeIcon
                            icon={faTags}
                            className="w-full h-full text-sm"
                          />
                        </div>
                        <div className="basis-11/12 capitalize">
                          {tagsString}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="text-[1rem] md:text-[1.09rem] xl:text-[1.13rem] leading-6 md:leading-7 tracking-wide">
                      {post.summary}
                    </div>
                    <div className="grid grid-cols-2 items-center text-sm">
                      <div className="flex flex-row items-center space-x-4">
                        <div className="relative w-[46px] md:w-[47px] h-[46px] max-w-full max-h-full overflow-hidden">
                          <Image
                            width={45}
                            height={45}
                            className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full object-cover"
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
                              shareBlog();
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
                                  config.WEBSITE_URL +
                                    "/resources/" +
                                    post.slug,
                                )}`,
                                "_blank",
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
                                  config.WEBSITE_URL +
                                    "/resources/" +
                                    post.slug,
                                )}`,
                                "_blank",
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
                                  post.title,
                                )}&url=${encodeURIComponent(
                                  config.WEBSITE_URL +
                                    "/resources/" +
                                    post.slug,
                                )}`,
                                "_blank",
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
                                  config.WEBSITE_URL +
                                    "/resources/" +
                                    post.slug,
                                )}`,
                                "_blank",
                              );
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faLink}
                            className="w-7 h-7 sm:w-6 sm:h-6 hover:cursor-pointer"
                            onClick={() => {
                              copyLink();
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
                    relatedPosts.length != 0
                      ? "xl:space-x-6 2xl:space-x-8 3xl:space-x-12 xl:mx-0"
                      : "xl:space-x-10 2xl:space-x-20 xl:mx-8 2xl:mx-20 3xl:mx-32"
                  }  mx-2 lg:mx-24 rounded-3xl text-[1.125rem]`}
                >
                  <div className="relative w-full xl:w-[45%]">
                    <div className="xl:sticky top-[7.5rem] flex flex-col">
                      {indexContent != null ? (
                        <div className="w-full h-fit border border-1 border-black-900 rounded-[12px]">
                          <div className="rounded-t-[12px] bg-gray-100 py-5 pl-4">
                            Table of contents
                          </div>
                          <div className="pl-5 pr-6 lg:pl-4 lg:pr-4 2xl:pl-5 2xl:pr-6 tracking-[0.02em] leading-relaxed">
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
                    <div className="flex flex-row flex-wrap mt-16">
                      {post.tags
                        ? post.tags.map((tag) => {
                            return (
                              <div className="my-4 mr-4" key={tag.id}>
                                <Link
                                  href={"/tag/" + tag.slug}
                                  className="rounded-full bg-[#f2f2f2] shadow-[4px_4px_4px_rgba(0,0,0,0.19)] px-6 py-2 no-underline capitalize"
                                  onClick={() => {
                                    mixpanel.track(
                                      "tap_tag_" + tag.slug.replace("-", "_"),
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
                    {post.authorBio ? <AuthorDetails postData={post} /> : ""}
                  </div>
                  {/* Recommended Posts Section Desktop View */}

                  {relatedPosts.length != 0 ? (
                    <div className="relative w-[40%]">
                      <div className="xl:sticky top-28">
                        <div className="hidden xl:block w-full h-fit">
                          <RecommandedPosts
                            postData={[relatedPosts, mixpanel]}
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
              {relatedPosts.length != 0 ? (
                <div className="container inline-block xl:hidden mt-10 lg:mx-4">
                  <hr className="mb-10" />
                  <RecommandedPosts postData={[relatedPosts, mixpanel]} />
                </div>
              ) : (
                ""
              )}

              {/* comments */}
              {config.SHOW_COMMENT_SECTION ? <Comment post={postData} /> : ""}

              {alerts ? (
                <div className="sticky bottom-8 inset-x-[7%] sm:inset-x-1/4 xl:inset-x-1/3 flex flex-rows justify-between items-center w-[90%] sm:w-7/12 xl:w-5/12 z-10 rounded-[10px] bg-gradient-to-r from-[#f2709c] to-[#ff9472] py-5 text-white">
                  <p className="mx-7 tracking-wider md:text-xl font-medium">
                    {message}
                  </p>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-5 h-5 mr-5 hover:cursor-pointer"
                    onClick={() => {
                      setAlerts(false);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="cta-section">
              {CTAData
                ? (() => {
                    let CTAComponent = null;
                    try {
                      switch (CTAData.attributes.component_name) {
                        case "CTA1":
                          CTAComponent = <CTA1 />;
                          break;
                        case "CTA2":
                          CTAComponent = <CTA2 />;
                          break;
                        case "CTA3":
                          CTAComponent = <CTA3 />;
                          break;
                        case "CTA4":
                          CTAComponent = <CTA4 />;
                          break;
                        case "CTA5":
                          CTAComponent = <CTA5 />;
                          break;
                        default:
                          break;
                      }
                    } catch (error) {
                      console.error("Error rendering CTA component:", error);
                    }

                    return CTAComponent;
                  })()
                : ""}
            </div>
          </>
        )}
      </section>
    </>
  );
}

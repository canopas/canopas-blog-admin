import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import config from "../config";
import Seo from "./seo";
import NotFound from "./404";
import Comment from "../components/comments/index";
import { setPostFields } from "../utils";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import hljs from "highlight.js";

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  var response,
    postData = null;

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
  return { props: { postData, status } };
}

export default function Post({ postData, status }) {
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const contentRef = useRef(null);

  const handleLoad = () => {
    setLoaded(true);
  };

  if (postData) {
    var post = postData.attributes;
    var published_on = post.published_on.replace(",", "");
    var published_time = new Date(post.publishedAt).toLocaleTimeString();
    var tags = post.tags.data.map((tag) => {
      return tag.attributes.name;
    });
    var tagsString = tags.join(", ");

    var indexContent = null;
    var blogContent = post.content.replace(
      /<img/g,
      '<img class="mx-auto aspect-w-2 aspect-h-1 object-cover" style="width:min-content;height:min-content"'
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

  useEffect(() => {
    if (postData) {
      hljs.highlightAll();

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
                url={`https://articles.canopas.com/resources/${post.slug}`}
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
                  <div className="md:container w-full xl:w-[35rem] 2xl:w-[42rem] h-auto sm:h-[18rem] md:h-[21rem] lg:h-[30rem] xl:h-[19rem] 2xl:h-[23rem] ">
                    <Image
                      width={200}
                      height={200}
                      src={post.image_url || ""}
                      alt={post.alternativeText || ""}
                      loading="eager"
                      className={`${
                        post.image.data == null
                          ? "w-[45%] h-4/5 mx-auto my-[5%]"
                          : `rounded-2xl lg:rounded-3xl object-cover transition-all duration-[800ms] ease-out ${
                              loaded
                                ? "w-full h-full"
                                : "mx-[2%] w-[95%] h-[95%] opacity-10"
                            }`
                      } `}
                      onLoad={handleLoad}
                    />
                  </div>
                  <div className="flex flex-col space-y-5 md:text-white ">
                    <div className="text-[2.20rem] lg:text-[2.50rem] xl:text-[2.80rem] font-normal leading-10 lg:leading-tight tracking-wide">
                      {post.title}
                    </div>
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
                        <div>{tagsString}</div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="text-[1rem] md:text-[1.09rem] xl:text-[1.13rem] leading-6 md:leading-7 tracking-wide">
                      {post.summary}
                    </div>
                    <div className="flex flex-row space-x-4 items-center text-sm">
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
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="container flex flex-col xl:flex-row space-y-20 xl:space-y-0 xl:space-x-20 2xl:mx-10 rounded-3xl text-[1.125rem]">
                  {indexContent != null ? (
                    <div className="xl:sticky top-24 w-auto h-60 xl:h-fit w-[100%] xl:w-[30%] border border-1 border-black-900 rounded-[12px] overflow-y-auto">
                      <div className="rounded-t-[12px] bg-gray-100 py-5 pl-4">
                        Table of contents
                      </div>
                      <div className="pl-5 pr-8 tracking-[0.02em] leading-relaxed">
                        <div className="mt-4 text-[1.125rem] text-[#374151] list-none ">
                          <div
                            className="my-3"
                            onClick={handleClick}
                            dangerouslySetInnerHTML={{ __html: indexContent }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* main article */}
                  <div className="prose lg:prose-lg">
                    <div
                      ref={contentRef}
                      dangerouslySetInnerHTML={{
                        __html: blogContent,
                      }}
                    ></div>
                    <div className="flex flex-row flex-wrap mt-20">
                      {post.tags.data.map((tag) => {
                        return (
                          <div className="my-4 mr-4" key={tag.id}>
                            <Link
                              href={"/tag/" + tag.attributes.slug}
                              className="rounded-full bg-[#f2f2f2] shadow-[4px_4px_4px_rgba(0,0,0,0.19)] px-6 py-2 no-underline capitalize"
                            >
                              {tag.attributes.name}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              {/* comments */}
              <Comment post={postData} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

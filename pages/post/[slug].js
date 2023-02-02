import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostBySlug } from "../../store/features/postSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { formateDate } from "../../utils";
import md from "markdown-it";
import Image from "next/image";
import Avatar from "../../assets/images/user.png";
import Script from "next/script";
import config from "../../config";

export default function Post() {
  const [loaded, setLoaded] = useState(false);
  // get slug from URL
  const router = useRouter();
  const slug = router.query.slug;

  const handleLoad = () => {
    setLoaded(true);
  };

  // get post by slug
  const dispatch = useDispatch();
  var post = useSelector((state) => {
    let post = null;
    if (state.post.posts.length > 0) {
      post = state.post.posts.find((post) => post.attributes.slug === slug);
    }
    if (!post) {
      post = state.post.post;
    }
    return post;
  });
  const status = useSelector((state) => state.post.status);

  if (!post) {
    dispatch(fetchPostBySlug(slug));
  } else {
    post = post.attributes;
    var [date, _] = formateDate(post.publishedAt);
    var publishedAt = date.replace(",", "");
    var authorData = post.author_id.data.attributes.image_url;
    var authorImage = authorData ? authorData : Avatar;
    var authorAltText = authorData
      ? post.author_id.data.attributes.username + "images"
      : "author";
    var tags = post.tags.data.map((tag) => {
      var tagName = tag.attributes.name;
      return tagName;
    });
    var tagsString = tags.join(", ");
    var indexContent = post.content.match(
      /<li><a href="#mcetoc_([\s\S]*?)">([\s\S]*?)<\/a><\/li>/g
    );
    var modifiedContent = post.content.replace(
      /<div class="mce-toc">([\s\S]*?)<\/div>/,
      ""
    );
  }

  return (
    <>
      <Script
        src={
          "//cdn.iframe.ly/embed.js?key=" + process.env.NEXT_PUBLIC_IFRAMELY_KEY
        }
        onLoad={() => {
          // Load media preview
          document.querySelectorAll("oembed[url]").forEach((element) => {
            iframely.load(element, element.attributes.url.value);
          });
        }}
      />

      <section className="container my-16 font-product-sans">
        <div>
          {post == null ? (
            ""
          ) : status == config.NOT_FOUND ? (
            <div className="text-xl text-center">There is no any posts.</div>
          ) : (
            <div key={post.id} className="flex flex-col space-y-20 ">
              <div className="grid grid-flow-row xl:grid-flow-col gap-10 xl:gap-8 w-90 h-90 rounded-3xl md:bg-[#14161E] md:py-20 md:px-10 xl:py-14 xl:px-8 ">
                <div className="md:container w-full xl:w-[35rem] 2xl:w-[42rem] h-auto sm:h-[18rem] md:h-[22rem] lg:h-[30rem] xl:h-[20rem] 2xl:h-[23rem] ">
                  <Image
                    width={200}
                    height={200}
                    src={post.image_url || ""}
                    alt={post.alternativeText || ""}
                    className={`rounded-2xl lg:rounded-3xl object-cover transition-all duration-[2300ms] ease-out delay-300 ${
                      loaded ? "w-full h-full" : "my-[25%] mx-[45%] w-0 h-0  "
                    }`}
                    onLoad={handleLoad}
                  />
                </div>
                <div className="flex flex-col space-y-5 text-black-900 md:text-white">
                  <div className="text-4xl lg:text-5xl font-normal leading-10 lg:leading-tight tracking-wide">
                    {post.title}
                  </div>
                  <div className="flex flex-row space-x-4 text-base leading-6 tracking-wide">
                    <div className="w-5 h-5">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="w-full h-full text-sm "
                      />
                    </div>
                    <div>{publishedAt},</div>
                    <div>{tagsString}</div>
                  </div>
                  <div className="text-lg leading-6 tracking-wider">
                    {post.summary}
                  </div>
                  <div className="flex flex-row space-x-4 items-center text-sm">
                    <div className="relative w-[40px] h-[40px]">
                      <Image
                        width={200}
                        height={200}
                        className="absolute w-full h-full rounded-full object-cover inset-0"
                        src={authorImage}
                        alt={authorAltText}
                      />
                    </div>
                    <div className="text-lg leading-5 tracking-wider">
                      {post.author_id.data.attributes.username}
                    </div>
                  </div>
                </div>
              </div>

              <div className="container flex flex-col xl:flex-row space-y-20 xl:space-x-20 rounded-3xl text-lg">
                <div className="xl:sticky top-12 w-auto h-60 xl:h-fit w-[100%] xl:w-[30%] border border-1 border-black-900 rounded-[12px] overflow-y-auto">
                  <div className="rounded-t-[12px] bg-gray-100 py-5 pl-3 pr-10 ">
                    Contents
                  </div>
                  <div className="m-4 text-gray-800 font-light tracking-wide">
                    <div className="my-3 text-xl">{post.title}</div>
                    <div className="my-3 text-base">
                      {post.readingTime} mins
                    </div>
                    <div className="mt-4 text-base list-none">
                      {indexContent.map((content, index) => (
                        <div
                          key={index}
                          className="my-3 hover:underline"
                          dangerouslySetInnerHTML={{
                            __html: content,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="prose lg:prose-lg tracking-wider">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: md({
                        html: true,
                      }).render(modifiedContent),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

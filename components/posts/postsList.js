import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PostsList({ postData, mixpanel }) {
  const [posts, slug, tagName] = postData;
  const [displayedPosts, setDisplayedPosts] = useState(10);

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
    <div className="mt-4 md:mt-6 xl:mt-8">
      {posts.slice(0, displayedPosts).map((post, i) => {
        post = post.attributes;

        return (
          <div
            className="flex flex-col col-span-2 mb-8 lg:mb-10 border-b-2"
            key={i}
          >
            <Link href={"/" + post.slug}>
              <div className="flex flex-row space-x-2 items-center text-base md:text-base leading-5 tracking-normal capitalize">
                <div className="relative w-[30px] md:w-[31px] h-[30px] max-w-full max-h-full overflow-hidden">
                  <Image
                    width={30}
                    height={30}
                    className="absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] rounded-full object-cover"
                    src={post.authorImage}
                    alt={post.authorAltText}
                    loading="lazy"
                  />
                </div>
                <span className="font-inter font-medium">
                  {post.authorName}
                </span>
                <span className="after:content-['\00B7']"></span>
                <span className="text-black-core/[0.65]">
                  {post.published_on}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 xl:gap-16 mt-4">
                <div className="col-span-2">
                  <div
                    className="mb-2 lg:mb-3.5 text-[1.1875rem] md:text-[1.40625rem] xl:text-[1.625rem] leading-7 md:leading-snug tracking-none line-clamp-2 lg:line-clamp-4 font-inter font-semibold"
                    onClick={() => {
                      mixpanel.track("tap_blog_title", {
                        Title: post.title,
                      });
                    }}
                  >
                    {post.title}
                  </div>
                  <div className="mb-3 text-black-core/[0.65] text-base md:text-[1.03125rem] xl:text-[1.0625rem] md:leading-7 tracking-wide line-clamp-2 xl:line-clamp-3">
                    {post.summary}
                  </div>
                </div>
                <div
                  className={`hidden md:block relative md:mt-[-20px] xl:mt-[-11px] ${
                    post.image.data == null
                      ? "md:h-[8.125rem] lg:h-[8.0831rem] xl:h-[8.75rem] 2xl:h-[10.5em] bg-black-900"
                      : "md:w-auto h-[8.125rem] md:h-[11.5rem]"
                  } max-w-xs max-h-full overflow-hidden`}
                >
                  <Image
                    width={300}
                    height={300}
                    src={post.image_url || ""}
                    alt={post.alternativeText || ""}
                    loading="lazy"
                    className={`absolute top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%] border object-cover`}
                  />
                </div>
              </div>
            </Link>

            {slug != null ? (
              <>
                <div className="flex flex-row flex-wrap space-x-2 items-center mb-10 md:mb-14 w-full text-sm md:text-[0.9375rem] xl:text-base">
                  <Link
                    href={"/tag/" + slug}
                    className="my-1 rounded-full bg-[#f2f2f2] px-2.5 py-1 font-normal no-underline capitalize"
                  >
                    {tagName}
                  </Link>
                  <span className="text-black-core/[0.65]">
                    {post.readingTime} min read
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-row flex-wrap mb-10 mt-2 text-sm md:text-[0.9375rem] xl:text-base">
                {post.tags.map((tag) => {
                  return (
                    <div className="my-2.5 mr-2" key={tag.id}>
                      <Link
                        href={"/tag/" + tag.slug}
                        className="my-1 rounded-full bg-[#f2f2f2] px-2 py-1.5 font-normal no-underline capitalize"
                      >
                        {tag.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
              <div className="flex flex-row space-x-2 items-center text-[1rem] md:text-[1.03rem] leading-5 tracking-wide capitalize">
                <div className="relative w-[30px] md:w-[31px] h-[30px] max-w-full max-h-full overflow-hidden">
                  <Image
                    width={30}
                    height={30}
                    className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full object-cover"
                    src={post.authorImage}
                    alt={post.authorAltText}
                  />
                </div>
                <span className="font-medium">{post.authorName}</span>
                <span className="after:content-['\00B7']"></span>
                <span className="text-gray-600">{post.published_on}</span>
              </div>
              <div className="grid grid-cols-3 gap-10 md:gap-12 xl:gap-16 mt-4">
                <div className="col-span-2">
                  <div
                    className="mb-2 lg:mb-3.5 text-[1.2rem] md:text-[1.4rem] xl:text-[1.7rem] font-semibold leading-7 md:leading-tight tracking-wide line-clamp-2 lg:line-clamp-4"
                    onClick={() => {
                      mixpanel.track("tap_blog_title", {
                        Title: post.title,
                      });
                    }}
                  >
                    {post.title}
                  </div>
                  <div className="mb-3 text-gray-600 text-[1rem] md:text-[1.06rem] xl:text-[1.12rem] leading-6 md:leading-7 tracking-wide line-clamp-1 md:line-clamp-2 xl:line-clamp-3">
                    {post.summary}
                  </div>
                </div>
                <div
                  className={`h-auto max-w-xs ${
                    post.image.data == null
                      ? "h-[6.125rem] md:h-[8.125rem] lg:h-[8.0831rem] xl:h-[8.75rem] 2xl:h-[10.5em] bg-black-900"
                      : "aspect-w-2 lg:aspect-h-1 h-[6.125rem] md:h-[8.125rem] border border-1"
                  }`}
                >
                  <Image
                    width={100}
                    height={100}
                    src={post.image_url || ""}
                    alt={post.alternativeText || ""}
                    loading="eager"
                    className={`${
                      post.image.data == null
                        ? "w-auto h-4/5 mx-auto my-[7%] lg:my-[5%]"
                        : "w-full h-full"
                    } object-cover`}
                  />
                </div>
              </div>
            </Link>

            {slug != null ? (
              <>
                <div className="flex flex-row flex-wrap space-x-2 items-center mb-10 md:mb-14 w-[60%] ">
                  <Link
                    href={"/tag/" + slug}
                    className="my-1 rounded-full bg-[#f2f2f2] px-2.5 py-1 font-medium no-underline capitalize"
                  >
                    {tagName}
                  </Link>
                  <span className="text-gray-600">
                    {post.readingTime} min read
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-row flex-wrap mb-10">
                {post.tags.map((tag) => {
                  return (
                    <div className="my-4 mr-2" key={tag.id}>
                      <Link
                        href={"/tag/" + tag.slug}
                        className="my-1 rounded-full bg-[#f2f2f2] px-3 py-1.5 font-medium no-underline capitalize"
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

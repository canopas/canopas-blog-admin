import Link from "next/link";
import Image from "next/image";

export default function RecommandedPosts({ postData }) {
  const [categoryPosts, mixpanel] = postData;
  return (
    <>
      <span className="text-[1.7rem] lg:text-[2rem] xl:text-[1.6rem] font-semibold tracking-wide capitalize">
        Recommended for you
      </span>
      <div className="mt-8">
        {categoryPosts.map((categoryPost, i) => {
          categoryPost = categoryPost.attributes;
          if (i < 3) {
            return (
              <Link href={"/" + categoryPost.slug} key={i}>
                <div className="grid grid-cols-3 gap-5 xl:gap-2 2xl:gap-5 mb-10 xl:mb-6 2xl:mb-10">
                  <div className="flex flex-col col-span-2 space-y-1">
                    <div className="flex flex-row space-x-2 items-center text-[0.8rem] md:text-[1rem] xl:text-[0.8rem] tracking-wider capitalize">
                      <div className="relative w-[30px] md:w-[31px] h-[30px] max-w-full max-h-full overflow-hidden">
                        <Image
                          width={30}
                          height={30}
                          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full object-cover"
                          src={categoryPost.authorImage}
                          alt={categoryPost.authorAltText}
                        />
                      </div>
                      <span className="font-medium">
                        {categoryPost.authorName}
                      </span>
                    </div>

                    <div
                      className="text-[1rem] sm:text-[1.1rem] md:text-[1.4rem] xl:text-[1rem] font-bold leading-5 md:leading-7 xl:leading-5 tracking-wider xl:line-clamp-2"
                      onClick={() => {
                        mixpanel.track("tap_blog_title", {
                          Title: categoryPost.title,
                        });
                      }}
                    >
                      {categoryPost.title}
                    </div>
                    <div className="text-gray-600 text-[1rem] md:text-[1.06rem] leading-6 md:leading-7 tracking-wide">
                      <span className="inline-block xl:hidden line-clamp-1 lg:line-clamp-2">
                        {categoryPost.summary}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`mt-4 xl:mt-2 max-w-xs xl:h-[4rem] ${
                      categoryPost.image.data == null
                        ? "h-[5.084rem] md:h-[6.96rem] lg:h-[8.9rem] bg-black-900"
                        : "aspect-w-2 md:aspect-h-1 h-[5.084rem] border border-1"
                    }`}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={categoryPost.image_url || ""}
                      alt={categoryPost.alternativeText || ""}
                      loading="eager"
                      className={`${
                        categoryPost.image.data == null
                          ? "w-auto h-4/5 mx-auto my-[5%] xl:my-[7%]"
                          : "w-full h-full"
                      } object-cover`}
                    />
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </>
  );
}

import config from "../../config";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Seo from "../seo";
import { setPostFields } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(context) {
  var response = null;
  var posts = [];
  const slug = context.params.slug;
  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/tag/" + slug + "?populate=deep&status=published"
    );
    posts = response.data.data;
    posts.forEach((post) => setPostFields(post, slug));
  } catch (err) {
    response = err.response;
  }
  const status = response ? response.status : config.NOT_FOUND;
  return { props: { posts, status, slug } };
}

export default function Home({ posts, status, slug }) {
  const count = posts.length;
  if (count != 0) {
    var tagName = posts[0].tagName;
  }

  return (
    <>
      <Seo
        title="Canopas blogs"
        description="Canopas blogs will help you to become a better software developer. We are sharing knowledge on Web, Backend, iOS, Android, and Flutter development"
        authorName="canopas"
      />
      <section className="container my-10 md:my-16 mx-2 sm:mx-auto text-[#292929]">
        {count == 0 || status == config.NOT_FOUND ? (
          <div className="mt-20 text-[1.4rem] text-center">
            {config.POST_NOT_FOUND_MESSAGE}
          </div>
        ) : status != config.SUCCESS ? (
          <></>
        ) : (
          <div className="md:mx-8 xl:mx-20">
            <div className="flex flex-row space-x-4 items-center">
              <div className="w-6 h-6 md:w-7 md:h-7">
                <FontAwesomeIcon icon={faTags} className="w-full h-full" />
              </div>
              <div className="my-6 md:my-10 text-[1.5rem] md:text-[1.8rem] xl:text-[2.2rem] font-semibold leading-7 tracking-wide">
                {tagName}
              </div>
            </div>
            <div className="mt-4 md:mt-6 xl:mt-8">
              {posts.map((post, i) => {
                post = post.attributes;

                return (
                  <div
                    className="flex flex-col col-span-2 mb-8 lg:mb-10 border-b-2"
                    key={i}
                  >
                    <Link href={"/post/" + post.slug}>
                      <div className="flex flex-row space-x-2 items-center text-[1rem] md:text-[1.03rem] leading-5 tracking-wide capitalize">
                        <div className="relative w-[30px] h-[30px] md:w-[35px] md:h-[35px]">
                          <Image
                            width={100}
                            height={100}
                            className="absolute w-full h-full rounded-full object-cover inset-0"
                            src={post.authorImage}
                            alt={post.authorAltText}
                          />
                        </div>
                        <span>{post.authorName}</span>
                        <span className="after:content-['\00B7']"></span>
                        <span className="text-[#757575]">
                          {post.published_on}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-10 md:gap-12 xl:gap-16 mt-4">
                        <div className="col-span-2">
                          <div className="mb-2 lg:mb-3 text-[1.2rem] md:text-[1.4rem] xl:text-[1.7rem] font-semibold leading-7 md:leading-tight tracking-wide line-clamp-2 lg:line-clamp-4">
                            {post.title}
                          </div>
                          <div className="mb-3 text-[1rem] md:text-[1.06rem] xl:text-[1.12rem] leading-6 md:leading-7 tracking-wide line-clamp-1 md:line-clamp-2 xl:line-clamp-3">
                            {post.summary}
                          </div>
                        </div>
                        <div
                          className={`h-auto max-w-xs ${
                            post.image.data == null
                              ? "h-[6.125rem] md:h-[8.125rem] lg:h-[8.0831rem] xl:h-[8.75rem] 2xl:h-[10.5em] bg-black-900"
                              : "aspect-w-2 aspect-h-1 border border-1"
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

                    <div className="flex flex-row flex-wrap space-x-2 items-center mb-10 md:mb-14 w-[60%] ">
                      <Link
                        href={"/tag/" + slug}
                        className="my-1 rounded-full bg-[#f2f2f2] px-2.5 py-1 no-underline capitalize"
                      >
                        {tagName}
                      </Link>
                      <span className="text-[#757575]">
                        {post.readingTime} min read
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

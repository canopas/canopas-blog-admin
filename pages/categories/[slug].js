import MarkdownView from "react-showdown";
import Image from "next/image";
import Link from "next/link";
import Loader from "../../component/loader";
import { fetchCategory } from "../../lib/category";
import { getReadingTime, formateDate } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import ServerError from "../../component/errors/serverError";
import Avatar from "../../assets/images/user.png";

const CategoryView = ({ category, status }) => {
  return (
    <section className="py-5">
      <div
        className="container flex flex-col sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]"
        key={category.id}
      >
        {category == null ? (
          <Loader />
        ) : status != 200 ? (
          category.error.status == 404 ? (
            <div className="text-xl text-center">There is no any Category</div>
          ) : (
            <ServerError />
          )
        ) : (
          <div className="flex flex-col items-center">
            <div className="pt-6 text-3xl font-bold text-gray-600 mb-20">
              {category.name}
            </div>

            {category.posts.data.map((post) => {
              post = post.attributes;
              var authorData = post.authors.data.attributes.image.data
              var authorImage = authorData ? authorData.attributes.url : Avatar
              var authorAltText = authorData ? authorData.attributes.alternativeText : "author"
              return (
                <div
                  className="flex flex-col basis-[30%] justify-center hover:animate-jump-card -translate-y-6 m-2.5 flex-[1_1_0%] z-0 border shadow-md rounded-xl"
                  key={post.id}
                >
                  <div className="rounded-lg overflow-hidden relative  pt-[50%]">
                    <div className="absolute inset-0 h-full w-full">
                      <div className="relative h-full w-full">
                        {post.image.data.map((image) => (
                          <div>
                            <Link href={"/post/" + post.slug}>
                              <Image
                                layout="fill"
                                objectFit="cover"
                                src={image.attributes.url}
                                alt={image.alternativeText || ""}
                              />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg">
                    <Link
                      href={"/post/" + post.slug}
                      className="text-black text-xl"
                    >
                      {post.title}
                    </Link>
                    <div>
                      <MarkdownView
                        className="text-gray-800 mt-5 text-sm line-clamp-3"
                        markdown={post.content}
                      />
                      <div className="text-sm">
                        {post.tags.data.map((tag) => (
                          <Link
                            href={"/tags/" + tag.attributes.slug}
                            className="text-black "
                          >
                            <div className="mt-5">
                              <span className="text-block-500 bg-slate-100 hover:bg-slate-300 rounded-full px-2 py-1.5">
                                {tag.attributes.tags[0]}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-4">
                        <div className="flex flex-row ">
                          <Link
                            href={
                              "/author/" + post.authors.data.attributes.slug
                            }
                            className="relative w-[40px] h-[40px]"
                          >
                            <Image
                              className="rounded-full h-full w-full object-cover absolute inset-0"
                              layout="fill"
                              objectFit="cover"
                              src={authorImage}
                              alt={authorAltText}
                            />
                          </Link>
                          <div className="pl-3 text-sm">
                            <Link
                              href={
                                "/author/" + post.authors.data.attributes.slug
                              }
                              className="text-gray-800 "
                            >
                              {post.authors.data.attributes.name}
                            </Link>
                            <div className="text-gray-500 flex">
                              <span>{post.publishedAt}</span>
                              <span className=" after:content-['\00B7'] after:mx-1 "></span>
                              <span>{post.readingTime} min read</span>
                              <span className="pl-4">
                                <FontAwesomeIcon
                                  icon={faMessage}
                                  className="pr-1 text-sm"
                                />
                                {post.comments.data.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export async function getStaticPaths() {
  var [_, categories] = await fetchCategory();
  var paths = []
  if (categories && categories.data) {
    paths = categories.data.map((category) => ({
      params: { slug: category.attributes.slug },
    }))
  }
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;

  if (!slug) {
    throw new Error("Slug not valid");
  }

  var [status, category] = await fetchCategory(slug);
  if (category && category.data) {
    category = category.data.attributes;

    for (let i = 0; i < category.posts.data.length; i++) {
      const post = category.posts.data[i].attributes;
      var [date, _] = await formateDate(post.publishedAt);
      post.publishedAt = date;
      post.readingTime = await getReadingTime(post.content);
    }
  }
  return {
    props: { category, status },
  };
}
export default CategoryView;

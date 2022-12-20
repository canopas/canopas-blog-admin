import { fetchAuthor } from "../../lib/author";
import { getReadingTime, formateDate } from "../../utils";
import MarkdownView from "react-showdown";
import Image from "next/image";
import Link from "next/link";
import Loader from "../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import ServerError from "../../components/errors/serverError";
import Avatar from "../../assets/images/user.png";

const AuthorView = ({ author, status }) => {
  let imageUrl = author.image.data ? author.image.data.attributes.url : Avatar
  let altText = author.image.data ? author.image.data.attributes.alternativeText : "author"

  return (
    <section className="py-5">
      <div className="container flex flex-col sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]">
        {author == null ? (
          <Loader />
        ) : status != 200 ? (
          author.error.status == 404 ? (
            <div className="text-xl text-center">There is no any Author</div>
          ) : (
            <ServerError />
          )
        ) : (
          <div className="flex flex-col items-center" key={author.id}>
            <div className="pt-6 text-3xl font-bold text-gray-600">
              {author.name}
            </div>
            <div className="pt-6 pb-10 text-gray-500">{author.bio}</div>
            <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover">
              <Image
                className="rounded-full h-full w-full object-cover absolute inset-0"
                layout="fill"
                objectFit="cover"
                src={imageUrl}
                alt={altText}
              />
            </div>

            <div className="pt-6 pb-10 text-2xl">
              Stories
            </div>
            {author.posts.data.map((post) => {
              post = post.attributes;
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export async function getStaticPaths() {
  const [_, authors] = await fetchAuthor();
  var paths = []
  if (authors && authors.data) {
    paths = authors.data.map((author) => ({
      params: { slug: author.attributes.slug },
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

  var [status, author] = await fetchAuthor(slug);
  if (author && author.data) {
    author = author.data.attributes;

    for (let i = 0; i < author.posts.data.length; i++) {
      const post = author.posts.data[i].attributes;
      var [date, _] = await formateDate(post.publishedAt);
      post.publishedAt = date;
      post["readingTime"] = await getReadingTime(post.content);
    }
  }
  return { props: { author, status } };
}

export default AuthorView;

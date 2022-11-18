import { fetchPost, getReadingTime, formateDate } from "../lib/post";
import Image from "next/image";
import MarkdownView from "react-showdown";

export default function Home(props) {
  const { posts } = props;
  return (
    <section className="py-5">
      <div className="container">
        <h1 className="text-pink-400 flex justify-center text-7xl mt-10 mb-20">
          CANOPAS BLOG
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 xl:grid-cols-3">
          {posts.data.map((post) => {
            return (
              <a
                className="flex flex-col basis-[30%] justify-center hover:animate-jump-card -translate-y-6 m-2.5 flex-[1_1_0%] active:scale-[0.98] z-0 shadow-[0_4px_4px_rgba(0,0,0,0.5)] rounded-b-lg"
                href={"/posts/" + post.attributes.slug}
                key={post.id}
              >
                <div className="rounded-t-lg overflow-hidden relative pt-[52%]">
                  <div className="absolute inset-0">
                    <div className="relative">
                      {post.attributes.images.data.map((image) => (
                        <>
                          <div>
                            <Image
                              layout="responsive"
                              objectFit="contain"
                              width={376}
                              height={190}
                              src={
                                "https://blog-admin.canopas.com" +
                                image.attributes.url
                              }
                              alt={image.attributes.alternativeText || ""}
                            />
                          </div>
                        </>
                      ))}
                      {post.attributes.categories.data.map((category) => (
                        <div className="px-5 py-2 bg-pink-600 rounded-lg absolute top-[15px] right-[20px] cursor-pointer z-10 text-white hover:text-white active:scale-[0.98]">
                          {category.attributes.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg">
                  <div className="text-black text-xl">
                    {post.attributes.title}
                  </div>
                  <div>
                    <MarkdownView
                      className="text-gray-800 mt-5 text-sm line-clamp-3"
                      markdown={post.attributes.content}
                    />
                    <div className="pt-4">
                      {post.attributes.authors.data.map((author) => (
                        <>
                          <div className="flex flex-row ">
                            <div className="text-sm">
                              <div className="text-gray-800 ">
                                {author.attributes.name}
                              </div>
                              <div className="text-gray-500 flex">
                                <span>{post.attributes.publishedAt}</span>
                                <span className=" after:content-['\00B7'] after:mx-1 "></span>
                                <span>{post.attributes.readingTime}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const posts = await fetchPost();
  for (let i = 0; i < posts.data.length; i++) {
    const post = posts.data[i].attributes;
    const formattedDate = await formateDate(post.publishedAt);
    post.publishedAt = formattedDate;
    const readingTime = await getReadingTime(post.content);
    post["readingTime"] = readingTime;
  }
  if (!posts) {
    return { notFound: true };
  }

  return {
    props: { posts },
  };
}

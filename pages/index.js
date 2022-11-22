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
            post = post.attributes;
            return (
              <div
                className="flex flex-col basis-[30%] justify-center hover:animate-jump-card -translate-y-6 m-2.5 flex-[1_1_0%] z-0 border shadow-md rounded-xl"
                key={post.id}
              >
                <div className="rounded-t-lg overflow-hidden relative pt-[52%]">
                  <div className="absolute inset-0">
                    <div className="relative">
                      {post.image.data.map((image) => (
                        <>
                          <a href={"/post/" + post.slug}>
                            <Image
                              layout="responsive"
                              objectFit="contain"
                              width={376}
                              height={190}
                              src={
                                "https://blog-admin.canopas.com" +
                                image.attributes.url
                              }
                              alt={image.alternativeText || ""}
                            />
                          </a>
                        </>
                      ))}
                      <div className="px-5 py-2 bg-pink-600 rounded-lg absolute top-[15px] right-[20px] cursor-pointer z-10 text-white hover:text-white active:scale-[0.98]">
                        {post.categories.data.attributes.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg">
                  <a href={"/post/" + post.slug} className="text-black text-xl">
                    {post.title}
                  </a>
                  <div>
                    <MarkdownView
                      className="text-gray-800 mt-5 text-sm line-clamp-3"
                      markdown={post.content}
                    />
                    <div className="pt-4">
                      <div className="flex flex-row ">
                        <div className="text-sm">
                          <a
                            href={
                              "/author/" + post.authors.data.attributes.slug
                            }
                            className="text-gray-800 "
                          >
                            {post.authors.data.attributes.name}
                          </a>
                          <div className="text-gray-500 flex">
                            <span>{post.publishedAt}</span>
                            <span className=" after:content-['\00B7'] after:mx-1 "></span>
                            <span>{post.readingTime}</span>
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
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const posts = await fetchPost();
  for (let i = 0; i < posts.data.length; i++) {
    const post = posts.data[i].attributes;
    post.publishedAt = await formateDate(post.publishedAt);
    post["readingTime"] = await getReadingTime(post.content);
  }
  if (!posts) {
    return { notFound: true };
  }

  return {
    props: { posts },
  };
}

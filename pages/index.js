import { fetchPost } from "../lib/post";
import { getReadingTime, formateDate } from "../utils";
import Image from "next/image";
import Link from "next/link";
import ServerError from "../components/errors/serverError";
import Avatar from "../assets/images/user.png";
import config from "../config";

export default function Home({ posts, status }) {
  return (
    <section className="container">
      <div className="grid gap-10 my-10 lg:gap-10 md:grid-cols-2 xl:grid-cols-3">
        {status != config.SUCCESS ? (
          status == config.NOT_FOUND ? (
            <div className="text-xl text-center">There is no any posts.</div>
          ) : (
            <ServerError />
          )
        ) : (
          posts.data.map((post) => {
            post = post.attributes;
            var authorData = post.author_id.data.attributes.image_url;
            var authorImage = authorData ? authorData : Avatar;
            var authorAltText = authorData
              ? post.author_id.data.attributes.username + " image"
              : "author";
            var tagData = post.tags.data;
            var tagName = tagData.length ? tagData[0].attributes.name : "";
            return (
              <div className="cursor-pointer" key={post.id}>
                <div className="relative overflow-hidden rounded-md  bg-gray-100 transition-all aspect-square hover:scale-105">
                  <Link href={"/post/" + post.slug}>
                    <Image
                      width={200}
                      height={200}
                      src={post.image_url || ""}
                      alt={post.alternativeText || ""}
                      className="min-w-full max-w-full min-h-full max-h-full object-cover"
                    />
                  </Link>
                </div>
                <div className="flex gap-3">
                  <div className="inline-block mt-5 text-xs font-medium tracking-wider uppercase text-blue-600">
                    {tagName}
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-[1_0_0%]">
                  <div>
                    <h2>
                      <Link
                        href={"/post/" + post.slug}
                        className="mt-3 text-base font-semibold tracking-normal text-brand-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <div className="flex flex-row items-center pt-4 text-xs text-gray-500">
                      <div className="relative w-[30px] h-[30px]">
                        <Image
                          width={200}
                          height={200}
                          className="rounded-full h-full w-full object-cover absolute inset-0"
                          src={authorImage}
                          alt={authorAltText}
                        />
                      </div>
                      <div className="pl-3">
                        {post.author_id.data.attributes.username}

                        <div>
                          <span>{post.publishedAt}</span>
                          <span className=" after:content-['\00B7'] after:mx-1 "></span>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const [status, posts] = await fetchPost();

  if (posts && posts.data) {
    for (let i = 0; i < posts.data.length; i++) {
      const post = posts.data[i].attributes;
      var [date, _] = await formateDate(post.publishedAt);
      post.publishedAt = date;
      post.readingTime = await getReadingTime(post.content);
    }
  }
  return {
    props: {
      posts,
      status,
    },
  };
}

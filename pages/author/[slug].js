import { fetchAuthor, getReadingTime, formateDate } from "../../lib/post";
import MarkdownView from "react-showdown";
import Image from "next/image";

const AuthorView = (props) => {
  const { author } = props;
  return (
    <section className="py-5">
      <div
        className="container flex flex-col sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]"
        key={author.id}
      >
        <h1 className="text-pink-400 flex justify-center text-4xl sm:text-7xl mt-10 mb-20">
          CANOPAS BLOG
        </h1>
        <div className="flex flex-col items-center">
          <div className="pt-6 text-3xl font-bold text-gray-600">
            {author.name}
          </div>
          <div className="pt-6 pb-10 text-gray-500">{author.bio}</div>
          <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover">
            <Image
              className="rounded-full h-full w-full object-cover absolute inset-0"
              layout="responsive"
              objectFit="contain"
              width={80}
              height={80}
              src={
                "https://blog-admin.canopas.com" +
                author.image.data.attributes.url
              }
              alt={author.image.data.attributes.alternativeText}
            />
          </div>

          <div className="pt-6 pb-10 text-2xl">
            {author.totalStory} Stories by {author.name}
          </div>
          {author.posts.data.map((post) => {
            post = post.attributes;
            return (
              <div
                className="flex flex-col basis-[30%] justify-center hover:animate-jump-card -translate-y-6 m-2.5 flex-[1_1_0%] z-0 border shadow-md rounded-xl"
                key={post.id}
              >
                <div className="rounded-t-lg overflow-hidden relative  pt-[52%]">
                  <div className="absolute inset-0">
                    <div className="relative">
                      <>
                        <a href={"/post/" + post.slug}>
                          <Image
                            layout="responsive"
                            objectFit="contain"
                            width={376}
                            height={190}
                            src={"/../public/apple-touch-icon.png"}
                            alt={""}
                          />
                        </a>
                      </>
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export async function getStaticPaths() {
  const Authors = await fetchAuthor();
  const paths = Authors.data.map((Author) => ({
    params: { slug: Author.attributes.slug },
  }));
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;

  if (!slug) {
    throw new Error("Slug not valid");
  }

  var author = await fetchAuthor(slug);
  author = author.data.attributes;

  author["totalStory"] = author.posts.data.length;
  for (let i = 0; i < author.posts.data.length; i++) {
    const post = author.posts.data[i].attributes;
    post.publishedAt = await formateDate(post.publishedAt);
    post["readingTime"] = await getReadingTime(post.content);
  }

  if (!author) {
    return { notFound: true };
  }

  return { props: { author } };
}

export default AuthorView;

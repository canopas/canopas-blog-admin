import md from "markdown-it";
import Image from "next/image";
import { fetchPost } from "../../lib/post";
import { getReadingTime, formateDate } from "../../utils";
import Loader from "../../components/loader";
import ServerError from "../../components/errors/serverError";
import Avatar from "../../assets/images/user.png";
import Script from "next/script";

const PostView = ({ post, status }) => {
  post = post.attributes;
  var authorData = post.author_id.data.attributes.image_url;
  var authorImage = authorData ? authorData : Avatar;
  var authorAltText = authorData
    ? post.author_id.data.attributes.username + "images"
    : "author";

  return (
    <>
      <Script
        src={
          "//cdn.iframe.ly/embed.js?key=" + process.env.NEXT_PUBLIC_IFRAMELY_KEY
        }
        onLoad={() => {
          // Load media preview
          document.querySelectorAll("oembed[url]").forEach((element) => {
            iframely.load(element, element.attributes.url.value);
          });
        }}
      />
      <section className="py-5">
        <div>
          {post == null ? (
            <Loader />
          ) : status != 200 ? (
            post.error.status == 404 ? (
              <div className="text-xl text-center">There is no any post</div>
            ) : (
              <ServerError />
            )
          ) : (
            <div
              key={post.id}
              className="container flex  flex-col  sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]"
            >
              <div className="pt-14 lg:pt-0">
                <div className="flex flex-col md:flex-row pb-12 cursor-pointer">
                  <div className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] mb-2 md:mb-0">
                    <Image
                      className="rounded-full h-full w-full object-cover absolute inset-0"
                      width={200}
                      height={200}
                      src={authorImage}
                      alt={authorAltText}
                    />
                  </div>
                  <div className="md:pl-4 flex flex-col justify-center">
                    <div className="text-lg text-gray-600">
                      {post.author_id.data.attributes.username}
                    </div>
                    <div className="text-gray-500">
                      <span className="">{post.publishedAt}</span>
                      <spn className=" after:content-['\00B7'] after:mx-1 "></spn>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="pb-3 text-4xl font-bold text-black">
                  {post.title}
                </div>
                <div className="relative overflow-hidden transition-all bg-gray-100 rounded-md dark:bg-gray-800 aspect-video">
                  <Image
                    width={200}
                    height={200}
                    src={post.image_url || ""}
                    alt={post.alternativeText || ""}
                    className="min-w-full max-w-full min-h-full max-h-full object-cover"
                  />
                </div>
                <article className="prose lg:prose-xl">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: md({
                        html: true,
                      }).render(post.content),
                    }}
                  />
                </article>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export async function getStaticPaths() {
  const [_, posts] = await fetchPost();
  var paths = [];
  if (posts && posts.data) {
    paths = posts.data.map((post) => ({
      params: { slug: post.attributes.slug },
    }));
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
  var [status, post] = await fetchPost(slug);
  if (post && post.data) {
    post = post.data;

    var [date, _] = await formateDate(post.attributes.publishedAt);
    post.attributes.publishedAt = date;
    post.attributes["readingTime"] = await getReadingTime(
      post.attributes.content
    );
  }

  return { props: { post, status } };
}

export default PostView;

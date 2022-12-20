import MarkdownView from "react-showdown";
import Image from "next/image";
import Link from "next/link";
import { fetchPost } from "../../lib/post";
import { getReadingTime, formateDate } from "../../utils";
import Loader from "../../components/loader";
import Comment from "../../components/comments/index";
import ServerError from "../../components/errors/serverError";
import Avatar from "../../assets/images/user.png";

const PostView = ({ post, status }) => {
  var authorData = post.attributes.authors.data.attributes.image.data
  var authorImage = authorData ? authorData.attributes.url : Avatar
  var authorAltText = authorData ? authorData.attributes.alternativeText : "author"
  return (
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
              <div className="flex flex-col md:flex-row pb-12">
                <Link
                  href={
                    "/author/" + post.attributes.authors.data.attributes.slug
                  }
                  className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] mb-2 md:mb-0"
                >
                  <Image
                    className="rounded-full h-full w-full object-cover absolute inset-0"
                    layout="fill"
                    objectFit="cover"
                    src={authorImage}
                    alt={authorAltText}
                  />
                </Link>
                <div className="md:pl-4">
                  <Link
                    href={
                      "/author/" + post.attributes.authors.data.attributes.slug
                    }
                    className="text-lg text-gray-600"
                  >
                    {post.attributes.authors.data.attributes.name}
                  </Link>
                  <div className="pt-1 text-gray-500">
                    {post.attributes.authors.data.attributes.bio}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="pb-3 text-4xl font-bold text-black">
                {post.attributes.title}
              </div>
              <div className="pb-5 text-base text-gray-500">
                <span className="">{post.attributes.publishedAt}</span>
                <spn className=" after:content-['\00B7'] after:mx-1 "></spn>
                <span>{post.attributes.readingTime} min read</span>
              </div>

              {post.attributes.image.data.map((image) => (
                <Image
                  layout="responsive"
                  objectFit="contain"
                  width={376}
                  height={190}
                  src={image.attributes.url}
                  alt={image.attributes.alternativeText || ""}
                  key={image.id}
                />
              ))}
              <div className="pt-10">
                <MarkdownView
                  className="content text-xl font-light"
                  markdown={post.attributes.content}
                  escapeHtml={false}
                />
              </div>
            </div>

            {/* Comment Form */}
            <Comment post={post} />
          </div>
        )}
      </div>
    </section>
  );
};

export async function getStaticPaths() {
  const [_, posts] = await fetchPost();
  var paths = []
  if (posts && posts.data) {
    paths = posts.data.map((post) => ({
      params: { slug: post.attributes.slug },
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
  var [status, post] = await fetchPost(slug);
  if (post && post.data) {
    post = post.data;

    var [date, _] = await formateDate(post.attributes.publishedAt);
    post.attributes.publishedAt = date;
    post.attributes["readingTime"] = await getReadingTime(post.attributes.content);
    post.attributes.comments.data.map(async (comment) => {
      const [date, time] = await formateDate(comment.attributes.publishedAt);
      comment.attributes.publishedAt = date + " at " + time;
    });
  }

  return { props: { post, status } };
}

export default PostView;

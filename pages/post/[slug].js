import MarkdownView from "react-showdown";
import Image from "next/image";
import { fetchPost, getReadingTime, formateDate } from "../../lib/post";

const PostView = (props) => {
  const { post } = props;
  return (
    <section className="py-5">
      <div className="pt-20">
        <div
          key={post.id}
          className="container flex  lg:flex-col flex-col-reverse sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]"
        >
          <div className="pt-14 lg:pt-0">
            <div className="flex flex-col md:flex-row pb-12">
              <div>
                <a
                  href={"/author/" + post.authors.data.attributes.slug}
                  className="text-lg text-gray-600"
                >
                  {post.authors.data.attributes.name}
                </a>
                <div className="pt-1 text-gray-500">
                  {post.authors.data.attributes.bio}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="pb-3 text-4xl font-bold text-black">
              {post.title}
            </div>
            <div className="pb-5 text-base text-gray-500">
              <span className="">{post.publishedAt}</span>
              <spn className=" after:content-['\00B7'] after:mx-1 "></spn>
              <span>{post.readingTime}</span>
            </div>

            {post.image.data.map((image) => (
              <Image
                layout="responsive"
                objectFit="contain"
                width={376}
                height={190}
                src={"https://blog-admin.canopas.com" + image.attributes.url}
                alt={image.attributes.alternativeText || ""}
                key={image.id}
              />
            ))}
            <div className="pt-10">
              <MarkdownView
                className="content text-xl font-light"
                markdown={post.content}
                escapeHtml={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export async function getStaticPaths() {
  const Posts = await fetchPost();
  const paths = Posts.data.map((Post) => ({
    params: { slug: Post.attributes.slug },
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

  var post = await fetchPost(slug);
  post = post.data.attributes;

  post.publishedAt = await formateDate(post.publishedAt);
  post["readingTime"] = await getReadingTime(post.content);

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
}

export default PostView;

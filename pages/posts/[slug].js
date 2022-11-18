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
            {post.data.attributes.authors.data.map((author) => (
              <>
                <div className="flex flex-col md:flex-row pb-12">
                  <div>
                    <div className=" text-lg text-gray-600">
                      {author.attributes.name}
                    </div>
                    <div className="pt-1 text-gray-500">
                      {author.attributes.bio}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div>
            <div className="pb-3 text-4xl font-bold text-black">
              {post.data.attributes.title}
            </div>
            <div className="pb-5 text-base text-gray-500">
              <span className="">{post.data.attributes.publishedAt}</span>
              <spn className=" after:content-['\00B7'] after:mx-1 "></spn>
              <span>{post.data.attributes.readingTime}</span>
            </div>

            {post.data.attributes.images.data.map((image) => (
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
                markdown={post.data.attributes.content}
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

  const post = await fetchPost(slug);

  const formattedDate = await formateDate(post.data.attributes.publishedAt);
  post.data.attributes.publishedAt = formattedDate;
  const readingTime = await getReadingTime(post.data.attributes.content);
  post.data.attributes["readingTime"] = readingTime;

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
}

export default PostView;

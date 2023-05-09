import config from "../../config";
import axios from "axios";
import Seo from "../seo";
import { setPostFields } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import PostsList from "../../components/posts/postsList";

export async function getServerSideProps(context) {
  var response = null;
  var posts = [];
  const slug = context.params.slug;
  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/tag/" + slug + "?populate=deep&status=published"
    );
    posts = response.data.data;
    posts.forEach((post) => setPostFields(post, slug));
  } catch (err) {
    response = err.response;
  }
  const status = response ? response.status : config.NOT_FOUND;
  return { props: { posts, status, slug } };
}

export default function Home({ posts, status, slug }) {
  const count = posts.length;
  if (count != 0) {
    var tagName = posts[0].tagName;
  }

  return (
    <>
      <Seo
        title={config.SEO_META_DATA.title}
        description={config.SEO_META_DATA.description}
        authorName={config.SEO_META_DATA.authorName}
      />
      <section className="container my-10 md:my-16 sm:mx-auto 3xl:px-24">
        {count == 0 || status == config.NOT_FOUND ? (
          <div className="mt-20 text-[1.4rem] text-center">
            {config.POST_NOT_FOUND_MESSAGE}
          </div>
        ) : status != config.SUCCESS ? (
          ""
        ) : (
          <div className="md:mx-8 xl:mx-20">
            <div className="flex flex-row space-x-4 items-center">
              <div className="w-6 h-6 md:w-7 md:h-7">
                <FontAwesomeIcon icon={faTags} className="w-full h-full" />
              </div>
              <div className="my-6 md:my-10 text-[1.5rem] md:text-[1.8rem] xl:text-[2.2rem] font-semibold leading-7 tracking-wide capitalize">
                {tagName}
              </div>
            </div>
            <div className="mt-4 md:mt-6 xl:mt-8">
              <PostsList postData={[posts, slug, tagName]} />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

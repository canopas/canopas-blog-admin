import config from "../../config";
import axios from "axios";
import Seo from "../seo";
import { setPostFields } from "../../utils";
import PostsList from "../../components/posts/postsList";

export async function getServerSideProps() {
  var response = null;
  var featurePosts = [];
  try {
    response = await axios.get(
      config.STRAPI_URL + "/v1/posts?filters[is_featured][$eq]=true"
    );
    featurePosts = response.data.data;
    featurePosts.forEach((post) => setPostFields(post));
  } catch (err) {
    response = err.response;
  }

  const status = response ? response.status : config.NOT_FOUND;
  return { props: { featurePosts, status } };
}

export default function Post({ featurePosts, status, mixpanel }) {
  const count = featurePosts.length;
  return (
    <>
      <Seo
        title={config.SEO_META_DATA.title}
        description={config.SEO_META_DATA.description}
        authorName={config.SEO_META_DATA.authorName}
      />
      <section className="container my-10 md:my-16 mx-2 sm:mx-auto">
        {count == 0 || status == config.NOT_FOUND ? (
          <div className="mt-20 text-[1.4rem] text-center">
            {config.POST_NOT_FOUND_MESSAGE}
          </div>
        ) : status != config.SUCCESS ? (
          <></>
        ) : (
          <div className="md:mx-8 xl:mx-20 3xl:px-24">
            <div className="my-6 md:my-10 text-[1.5rem] md:text-[1.8rem] xl:text-[2.2rem] font-semibold leading-7 tracking-wide capitalize">
              Featured Blogs
            </div>

            <div className="mt-6 md:mt-10 xl:mt-20">
              <PostsList postData={[featurePosts]} mixpanel={mixpanel} />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

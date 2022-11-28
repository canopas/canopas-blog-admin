import MarkdownView from "react-showdown";
import Image from "next/image";
import { fetchPost, getReadingTime, formateDate } from "../../lib/post";
import Loader from "../../component/loader";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
const baseUrl = "https://blog-admin.canopas.com";

const PostView = ({ post, status }) => {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <section className="py-5">
      <div>
        {post == null ? (
          <Loader />
        ) : status != 200 ? (
          post.error.status == 404 ? (
            <div className="text-xl text-center">There is no any post</div>
          ) : (
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto bg-[#00000080]"
                onClose={closeModal}
              >
                <div className="min-h-screen px-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0" />
                  </Transition.Child>

                  <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Error
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 border-t pt-2">
                          Something went wrong !!
                        </p>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          )
        ) : (
          <div
            key={post.id}
            className="container flex  lg:flex-col flex-col-reverse sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]"
          >
            <a
              href="/"
              className="text-pink-400 flex justify-center text-4xl sm:text-7xl mt-10 mb-20"
            >
              CANOPAS BLOG
            </a>
            <div className="pt-14 lg:pt-0">
              <div className="flex flex-col md:flex-row pb-12">
                <a
                  href={"/author/" + post.authors.data.attributes.slug}
                  className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] mb-2 md:mb-0"
                >
                  <Image
                    className="rounded-full h-full w-full object-cover absolute inset-0"
                    layout="fill"
                    objectFit="cover"
                    src={
                      baseUrl +
                      post.authors.data.attributes.image.data.attributes.url
                    }
                    alt={
                      post.authors.data.attributes.image.data.attributes
                        .alternativeText || ""
                    }
                  />
                </a>
                <div className="md:pl-4">
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
                  src={baseUrl + image.attributes.url}
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
        )}
      </div>
    </section>
  );
};

export async function getStaticPaths() {
  const [_, Posts] = await fetchPost();
  if (Posts.data) {
    const paths = Posts.data.map((Post) => ({
      params: { slug: Post.attributes.slug },
    }));
    return {
      paths: paths,
      fallback: false,
    };
  }
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  if (!slug) {
    throw new Error("Slug not valid");
  }
  var [status, post] = await fetchPost(slug);
  if (post.data) {
    post = post.data.attributes;

    post.publishedAt = await formateDate(post.publishedAt);
    post["readingTime"] = await getReadingTime(post.content);
  }

  return { props: { post: post, status: status } };
}

export default PostView;

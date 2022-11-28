import { fetchPost, getReadingTime, formateDate } from "../lib/post";
import Image from "next/image";
import MarkdownView from "react-showdown";
import Loader from "./../component/loader";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
const baseUrl = "https://blog-admin.canopas.com";

export default function Home({ posts, status }) {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <section className="py-5">
      <div className="container">
        <a
          href="/"
          className="text-pink-400 flex justify-center text-7xl mt-10 mb-20"
        >
          CANOPAS BLOG
        </a>
        {posts == null ? (
          <Loader />
        ) : status != 200 ? (
          posts.error.status == 404 ? (
            <div className="text-xl text-center">There is no any posts</div>
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
                                width={500}
                                height={500}
                                src={baseUrl + image.attributes.url || ""}
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
                    <a
                      href={"/post/" + post.slug}
                      className="text-black text-xl"
                    >
                      {post.title}
                    </a>
                    <div>
                      <MarkdownView
                        className="text-gray-800 mt-5 text-sm line-clamp-3"
                        markdown={post.content}
                      />
                      <div className="pt-4">
                        <div className="flex flex-row ">
                          <a
                            href={
                              "/author/" + post.authors.data.attributes.slug
                            }
                            className="relative w-[40px] h-[40px]"
                          >
                            <Image
                              className="rounded-full h-full w-full object-cover absolute inset-0"
                              layout="fill"
                              objectFit="cover"
                              src={
                                baseUrl +
                                post.authors.data.attributes.image.data
                                  .attributes.url
                              }
                              alt={
                                post.authors.data.attributes.image.data
                                  .attributes.alternativeText || ""
                              }
                            />
                          </a>
                          <div className="pl-3 text-sm">
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
        )}
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const [status, posts] = await fetchPost();
  if (posts.data) {
    for (let i = 0; i < posts.data.length; i++) {
      const post = posts.data[i].attributes;
      post.publishedAt = await formateDate(post.publishedAt);
      post["readingTime"] = await getReadingTime(post.content);
    }
  }

  return {
    props: { posts: posts, status: status },
  };
}

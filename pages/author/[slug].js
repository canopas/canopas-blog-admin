import { fetchAuthor, getReadingTime, formateDate } from "../../lib/post";
import MarkdownView from "react-showdown";
import Image from "next/image";
import Loader from "../../component/loader";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
const baseUrl = "https://blog-admin.canopas.com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const AuthorView = ({ author, status }) => {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <section className="py-5">
      <div className="container flex flex-col sm:px-[4rem] md:px-[8rem] lg:px-[10rem] xl:px-[12rem] 2xl:px-[17rem]">
        <a
          href="/"
          className="text-pink-400 flex justify-center text-4xl sm:text-7xl mt-10 mb-20"
        >
          CANOPAS BLOG
        </a>
        {author == null ? (
          <Loader />
        ) : status != 200 ? (
          author.error.status == 404 ? (
            <div className="text-xl text-center">There is no any Author</div>
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
          <div className="flex flex-col items-center" key={author.id}>
            <div className="pt-6 text-3xl font-bold text-gray-600">
              {author.name}
            </div>
            <div className="pt-6 pb-10 text-gray-500">{author.bio}</div>
            <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover">
              <Image
                className="rounded-full h-full w-full object-cover absolute inset-0"
                layout="fill"
                objectFit="cover"
                src={baseUrl + author.image.data.attributes.url}
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
                  <div className="rounded-lg overflow-hidden relative  pt-[50%]">
                    <div className="absolute inset-0 h-full w-full">
                      <div className="relative h-full w-full">
                        {post.image.data.map((image) => (
                          <div>
                            <a href={"/post/" + post.slug}>
                              <Image
                                layout="fill"
                                objectFit="cover"
                                src={baseUrl + image.attributes.url}
                                alt={image.alternativeText || ""}
                              />
                            </a>
                          </div>
                        ))}
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
                          <div className="text-gray-500 flex">
                            <span>{post.publishedAt}</span>
                            <span className=" after:content-['\00B7'] after:mx-1 "></span>
                            <span>{post.readingTime}</span>
                            <span className="pl-4">
                              <FontAwesomeIcon
                                icon={faComments}
                                className="pr-1 text-sm"
                              />
                              {post.comments.data.length}
                            </span>
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
};

export async function getStaticPaths() {
  const [_, Authors] = await fetchAuthor();
  if (Authors.data) {
    const paths = Authors.data.map((Author) => ({
      params: { slug: Author.attributes.slug },
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

  var [status, author] = await fetchAuthor(slug);
  if (author.data) {
    author = author.data.attributes;

    author["totalStory"] = author.posts.data.length;
    for (let i = 0; i < author.posts.data.length; i++) {
      const post = author.posts.data[i].attributes;
      var [date, _] = await formateDate(post.publishedAt);
      post.publishedAt = date;
      post["readingTime"] = await getReadingTime(post.content);
    }
  }
  return { props: { author: author, status: status } };
}

export default AuthorView;

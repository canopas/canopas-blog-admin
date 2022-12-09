import {
  fetchPost,
  getReadingTime,
  formateDate,
  searchPost,
} from "../lib/post";
import Image from "next/image";
import Link from "next/link";
import MarkdownView from "react-showdown";
import Loader from "./../component/loader";
import { Dialog, Transition } from "@headlessui/react";
import { useCallback, useRef, Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
export default function Home({ posts, status }) {
  //Search Input
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const [searchBlogs, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(null);

  const onChange = useCallback(async (event) => {
    const query = event.target.value;
    setQuery(query);
    if (query.length) {
      const response = await searchPost(query);
      setResults(response);
      setSearchActive(true);
    } else {
      setResults([]);
      setSearchActive(false);
    }
  }, []);

  const onFocus = () => {
    setActive(true);
    window.addEventListener("click", onClick);
  };

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setQuery("");
      setResults([]);
      setSearchActive(false);

      window.removeEventListener("click", onClick);
    }
  }, []);

  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <section className="py-5">
      <div className="container">
        <Link
          href="/"
          className="text-pink-400 flex justify-center text-7xl mt-10 mb-20"
        >
          CANOPAS BLOG
        </Link>
        <div
          className="relative mb-20 w-64 pr-64 sm:w-96 mx-auto  w-full max-w-2xl  
                    w-full flex items-center rounded-[12px]  sm:px-5 bg-slate-100"
          ref={searchRef}
        >
          <button>
            <i className="pl-4 text-gray-500 rounded-full w-16 h-16 cursor-pointer">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pr-1 text-sm"
              />
            </i>
          </button>
          <input
            className="!border-0 text-sm px-5 !bg-slate-100 !w-52 sm:!w-96"
            onChange={onChange}
            onFocus={onFocus}
            placeholder="Search blog posts "
            type="text"
            value={query}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 xl:grid-cols-3 h-20">
          {searchBlogs === null ? (
            <Loader />
          ) : searchBlogs.data && searchBlogs.data.length === 0 ? (
            <div className="text-xl text-center mx-auto">
              There is no any posts
            </div>
          ) : (
            active &&
            searchBlogs.length != 0 &&
            searchBlogs.data.map((post) => {
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
                            <Link href={"/post/" + post.slug}>
                              <Image
                                layout="responsive"
                                objectFit="contain"
                                width={500}
                                height={500}
                                src={image.attributes.url || ""}
                                alt={image.alternativeText || ""}
                              />
                            </Link>
                          </>
                        ))}
                        <Link
                          href={
                            "/categories/" +
                            post.categories.data.attributes.slug
                          }
                          className="px-5 py-2 bg-pink-600 rounded-lg absolute top-[15px] right-[20px] cursor-pointer z-10 text-white hover:text-white active:scale-[0.98]"
                        >
                          {post.categories.data.attributes.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg">
                    <Link
                      href={"/post/" + post.slug}
                      className="text-black text-xl"
                    >
                      {post.title}
                    </Link>
                    <div>
                      <MarkdownView
                        className="text-gray-800 mt-5 text-sm line-clamp-3"
                        markdown={post.content}
                      />
                      <div className="pt-4">
                        <div className="flex flex-row items-center justify-between">
                          <div className="relative flex">
                            <Link
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
                                  post.authors.data.attributes.image.data
                                    .attributes.url
                                }
                                alt={
                                  post.authors.data.attributes.image.data
                                    .attributes.alternativeText || ""
                                }
                              />
                            </Link>
                            <div className="pl-3 text-sm">
                              <Link
                                href={
                                  "/author/" + post.authors.data.attributes.slug
                                }
                                className="text-gray-800 "
                              >
                                {post.authors.data.attributes.name}
                              </Link>
                              <div className="text-gray-500 ">
                                <span>{post.publishedAt}</span>
                                <span className=" after:content-['\00B7'] after:mx-1 "></span>
                                <span>{post.readingTime}</span>
                              </div>
                            </div>
                          </div>

                          <span className="pl-4 text-gray-500">
                            <FontAwesomeIcon
                              icon={faMessage}
                              className="pr-1 text-sm"
                            />
                            {post.comments.data.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

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
          !searchActive && (
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
                              <Link href={"/post/" + post.slug}>
                                <Image
                                  layout="responsive"
                                  objectFit="contain"
                                  width={500}
                                  height={500}
                                  src={image.attributes.url || ""}
                                  alt={image.alternativeText || ""}
                                />
                              </Link>
                            </>
                          ))}
                          <Link
                            href={
                              "/categories/" +
                              post.categories.data.attributes.slug
                            }
                            className="px-5 py-2 bg-pink-600 rounded-lg absolute top-[15px] right-[20px] cursor-pointer z-10 text-white hover:text-white active:scale-[0.98]"
                          >
                            {post.categories.data.attributes.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg">
                      <Link
                        href={"/post/" + post.slug}
                        className="text-black text-xl"
                      >
                        {post.title}
                      </Link>
                      <div>
                        <MarkdownView
                          className="text-gray-800 mt-5 text-sm line-clamp-3"
                          markdown={post.content}
                        />
                        <div className="pt-4">
                          <div className="flex flex-row items-center justify-between">
                            <div className="relative flex">
                              <Link
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
                                    post.authors.data.attributes.image.data
                                      .attributes.url
                                  }
                                  alt={
                                    post.authors.data.attributes.image.data
                                      .attributes.alternativeText || ""
                                  }
                                />
                              </Link>
                              <div className="pl-3 text-sm">
                                <Link
                                  href={
                                    "/author/" +
                                    post.authors.data.attributes.slug
                                  }
                                  className="text-gray-800 "
                                >
                                  {post.authors.data.attributes.name}
                                </Link>
                                <div className="text-gray-500 ">
                                  <span>{post.publishedAt}</span>
                                  <span className=" after:content-['\00B7'] after:mx-1 "></span>
                                  <span>{post.readingTime}</span>
                                </div>
                              </div>
                            </div>

                            <span className="pl-4 text-gray-500">
                              <FontAwesomeIcon
                                icon={faMessage}
                                className="pr-1 text-sm"
                              />
                              {post.comments.data.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
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
      var [date, _] = await formateDate(post.publishedAt);
      post.publishedAt = date;
      post.readingTime = await getReadingTime(post.content);
    }
  }
  return {
    props: {
      posts: posts,
      status: status,
    },
  };
}

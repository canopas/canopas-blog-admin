import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/features/postSlice";
import Image from "next/image";
import Link from "next/link";
import ServerError from "../components/errors/serverError";
import Avatar from "../assets/images/user.png";
import config from "../config";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const status = useSelector((state) => state.post.status);
  useEffect(() => {
    if (!status || status === 0) {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const count = posts.length;

  return (
    <section className="container my-16 mx-2 sm:mx-auto font-product-sans">
      <div className="my-16 w-full bg-black-900">
        <div className="flex flex-col space-y-2 py-4 px-14 md:px-28 xl:px-44">
          <div className="w-20 md:w-1/5 ">
            <hr className="border-1 border-[#ff9472]" />
          </div>
          <div className="text-2xl sm:text-[1.67rem] text-white font-semibold leading-snug text-left tracking-wider">
            On a mission to help you become a better{" "}
            <span className="text-[#ff9472]">Software Engineer</span>. Sharing
            knowlegde on{" "}
            <span className="text-[#ff9472]">
              #android, #iOS, #web, & #programming.
            </span>
          </div>
        </div>
      </div>
      <hr className="mb-10" />
      <div
        className={`grid gap-10 md:gap-5 lg:gap-10 md:grid-cols-3 ${
          count % 3 === 1 ? "md:col-span-1" : ""
        }`}
      >
        {status == 0 ? (
          ""
        ) : status != config.SUCCESS ? (
          status == config.NOT_FOUND ? (
            <div className="text-xl text-center">There is no any posts.</div>
          ) : (
            <ServerError />
          )
        ) : (
          posts.map((post, i) => {
            post = post.attributes;
            var authorData = post.author_id.data.attributes.image_url;
            var authorImage = authorData ? authorData : Avatar;
            var authorAltText = authorData
              ? post.author_id.data.attributes.username + " image"
              : "author";
            return (
              <div
                key={i}
                className={`space-y-5 ${
                  i === 0 && count % 3 === 1
                    ? "md:flex md:space-x-5 md:col-span-3"
                    : ""
                }`}
              >
                <div
                  className={`my-4 w-auto h-60 border border-1 border-gray-300 bg-white transition-all aspect-auto hover:scale-105 ${
                    i === 0 && count % 3 === 1
                      ? "md:w-2/4 md:h-auto"
                      : "md:h-48 lg:h-60"
                  }`}
                >
                  <Link href={"/post/" + post.slug}>
                    <Image
                      width={200}
                      height={200}
                      src={post.image_url || ""}
                      alt={post.alternativeText || ""}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>

                <div
                  className={`flex flex-col flex-[1_0_0%] space-y-2 ${
                    i === 0 && count % 3 === 1 ? "" : "justify-between"
                  }`}
                >
                  <div
                    className={`text-[1.375rem] font-semibold leading-7 tracking-wider text-black-900 ${
                      i === 0 && count % 3 === 1
                        ? "md:text-3xl md:font-bold md:leading-8 lg:leading-10"
                        : ""
                    }`}
                  >
                    <Link href={"/post/" + post.slug}>{post.title}</Link>
                  </div>
                  <div className="text-[1.0625rem] leading-7 tracking-wider text-gray-500">
                    <Link href={"/post/" + post.slug}>
                      <p className="line-clamp-3">{post.summary}</p>
                    </Link>
                  </div>
                  <div className="flex flex-row items-center pt-3 text-sm text-gray-500">
                    <div className="relative w-[38px] h-[38px]">
                      <Image
                        width={200}
                        height={200}
                        className="absolute h-full w-full rounded-full object-cover inset-0"
                        src={authorImage}
                        alt={authorAltText}
                      />
                    </div>
                    <div className="pl-3 text-sm leading-5 tracking-wider">
                      <span className="text-green-700">
                        {post.author_id.data.attributes.username}
                      </span>

                      <div>
                        <span>{post.published_on}</span>
                        <span className=" after:content-['\00B7'] after:mx-1 "></span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

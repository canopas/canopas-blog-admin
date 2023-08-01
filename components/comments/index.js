import Image from "next/image";
import dynamic from "next/dynamic";
import UserImage from "../../assets/images/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { formateDate } from "../../utils";
import ReCAPTCHA from "react-google-recaptcha";

const CommentForm = dynamic(() => import("./commentForm"));

export default function Comment({ post }) {
  let [comments, setComments] = useState(post);
  let [reviews, setReviews] = useState(false);
  let [currentIndex, setcurrentIndex] = useState(0);
  const recaptchaRef = useRef(null);
  let fullFormRef = useRef(null);
  let threadComments = comments.attributes.comments.data;

  const handleSubmit = (id) => () => {
    setReviews(true);
    setcurrentIndex(id);
  };

  const handleNewComment = (comment) => {
    setComments(comment);
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (
        event.target.localName != "textarea" &&
        fullFormRef.current &&
        !fullFormRef.current.contains(event.target)
      ) {
        setReviews(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
  }, [fullFormRef]);

  return (
    <div className="container pt-20 2xl:mx-12">
      <div ref={fullFormRef}>
        {comments.attributes.comments.data.map((comment) => {
          if (comment.attributes.publishedAt != null) {
            const [date] = formateDate(comment.attributes.publishedAt);
            {
              return (
                <ol key={comment.id} className="md:px-8 py-2">
                  {comment && comment.attributes.parent_id === null ? (
                    <li
                      className="px-5 py-5 bg-white border border-solid border-gray-300 rounded-[15px]"
                      ref={fullFormRef}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="relative w-[40px] h-[40px] mb-2 md:mb-0">
                            <Image
                              className="rounded-full h-full w-full object-cover absolute inset-0"
                              layout="fill"
                              objectFit="cover"
                              src={UserImage}
                              alt={"user-avatar"}
                            />
                          </div>
                          {comment.attributes.user.data.map((user) => {
                            return (
                              <div
                                key={user.id}
                                className="pl-3 bg-gradient-to-r from-pink-300 to-orange-300 text-transparent bg-clip-text"
                              >
                                {user.attributes.name}
                              </div>
                            );
                          })}
                        </div>
                        <div
                          onClick={handleSubmit(comment.id)}
                          className="flex items-center cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={faReply}
                            className="w-5 h-5 pr-1 text-sm text-pink-300"
                          />
                          <span className="bg-gradient-to-r from-pink-300 to-orange-300 text-transparent bg-clip-text">
                            Reply
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{date}</p>
                      <div className="pt-4">{comment.attributes.comment}</div>

                      {/* Thread comments */}

                      {threadComments.map((threadComment) => {
                        if (threadComment.attributes.publishedAt != null) {
                          const [date, _] = formateDate(
                            threadComment.attributes.publishedAt,
                          );
                          return (
                            <div key={threadComment.id}>
                              {threadComment.attributes.parent_id &&
                              threadComment.attributes.parent_id ==
                                comment.id ? (
                                <ol className="pt-3">
                                  <li className="px-5 py-5 bg-white border border-solid border-gray-300 rounded-[15px]">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <div className="relative w-[40px] h-[40px] mb-2 md:mb-0">
                                          <Image
                                            className="rounded-full h-full w-full object-cover absolute inset-0"
                                            layout="fill"
                                            objectFit="cover"
                                            src={UserImage}
                                            alt={"user-avatar"}
                                          />
                                        </div>
                                        {threadComment.attributes.user.data.map(
                                          (user) => {
                                            return (
                                              <div
                                                key={user.id}
                                                className="pl-3 bg-gradient-to-r from-pink-300 to-orange-300 text-transparent bg-clip-text "
                                              >
                                                {user.attributes.name}
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                      {date}
                                    </p>
                                    <div className="pt-4">
                                      {threadComment.attributes.comment}
                                    </div>
                                  </li>
                                </ol>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        }
                      })}

                      {reviews && comment.id === currentIndex ? (
                        <CommentForm
                          post={[post.id, comment.id]}
                          onNewComment={handleNewComment}
                          recaptchaRef={recaptchaRef}
                        />
                      ) : (
                        ""
                      )}
                    </li>
                  ) : (
                    ""
                  )}
                </ol>
              );
            }
          }
        })}
      </div>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      />

      {/* comments form */}
      <CommentForm
        post={[post.id, null]}
        onNewComment={handleNewComment}
        recaptchaRef={recaptchaRef}
      />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import config from "../../config";
const STRAPI_URL = config.STRAPI_URL;

export default function CommentForm({ post, onNewComment, recaptchaRef }) {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [postId, parentId] = post;

  async function handleSubmit(event) {
    event.preventDefault();

    recaptchaRef.current.executeAsync().then(() => {
      const commentData = {
        data: {
          postId,
          name,
          email,
          comment: message,
          parent_id: parentId ? parentId : null,
        },
      };

      axios
        .post(`${STRAPI_URL}/v1/comments?populate=deep`, commentData)
        .then((response) => {
          onNewComment(response.data.data.attributes.post.data);
        })
        .catch((error) => {
          setError(error.response.data.error.message);
        });

      setName("");
      setEmail("");
      setMessage("");
      setError("");
      recaptchaRef.current.reset();
    });
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, [formRef]);

  return (
    <div className="container py-20 tracking-wide">
      <div className="flex items-center pb-5 font-semibold text-xl">
        <FontAwesomeIcon
          icon={faMessage}
          className="w-7 h-7 pr-2 text-pink-300"
        />
        <span className="bg-gradient-to-r from-pink-300 to-orange-300 text-transparent bg-clip-text">
          Leave comment
        </span>
      </div>
      <form onSubmit={handleSubmit} className="comment">
        <textarea
          id="comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onClick={() => setShowForm(true)}
          className="form-control block w-full h-24"
          placeholder="Your comment"
          required
        />
        <div className={`pt-4 ${showForm ? "block" : "hidden"}`} ref={formRef}>
          <label className="mb-3 text-lg text-gray-700">Name</label>
          <span className="ml-1 text-red-600">*</span>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control block w-full h-full"
            placeholder="Your Name"
            required
          />
          <label className="mb-3 text-lg text-gray-700">Email</label>
          <span className="ml-1 text-red-600">*</span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control block w-full h-full "
            placeholder="Your E-mail Address"
            required
          />
          <button className="relative mt-7 rounded-[12px] border-[1px] border-solid border-transparent bg-gradient-to-r from-[#f2709c] to-[#ff9472] hover:shadow-[inset_2px_1000px_1px_#fff] py-[0.8rem] font-bold text-white">
            <span className="py-[1.25rem] px-3 hoverable-text text-lg">
              Post Comment
            </span>
          </button>
          {error && <p className="mt-3 text-lg text-red-600">{error}</p>}
        </div>
      </form>
    </div>
  );
}

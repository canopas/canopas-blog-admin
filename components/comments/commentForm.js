import { useState } from "react";
import { addComment, addCommentator, updateComment } from "../../lib/comment";

export default function CommentForm({ post }) {
  const [postId, commentId] = post;

  let [showComment, setShowResults] = useState(false);
  const onClick = () => setShowResults(true);

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  async function handleSubmit() {
    const commentData = {
      data: {
        comment: comment,
        post: postId,
        parentId: commentId ? commentId : null,
      },
    };

    const [status, comments] = await addComment(commentData);
    if (status === 200) {
      const userData = {
        data: {
          username: title,
          email: email,
          comments: comments.data.id,
        },
      };

      const [userStatus, users] = await addCommentator(userData);
      if (userStatus === 200) {
        const commentatorData = {
          data: {
            commentators: users.data.id,
          },
        };
        await updateComment(postId, commentatorData);
      }
    }
  }

  return (
    <div className="px-10 py-5">
      <div className="pb-3 font-bold">Leave a Reply</div>
      <form onSubmit={handleSubmit}>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ ["height"]: "96px" }}
          onClick={onClick}
          className="form-control block w-full h-24"
          placeholder="Leave your message"
        ></textarea>
        <div
          style={{
            display: showComment ? "block" : "none",
          }}
          className="pt-4"
        >
          <label for="name" className="mb-3">
            Name
          </label>
          <span style={{ ["color"]: "red" }}>*</span>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control block w-full h-full"
            placeholder="Your name"
            required
          />
          <label for="email" className="mb-3">
            Email
          </label>
          <span style={{ ["color"]: "red" }}>*</span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control block w-full h-full "
            placeholder="Your email address"
            required
          />
          <input type="submit" value="Post Comment" />
        </div>
      </form>
    </div>
  );
}

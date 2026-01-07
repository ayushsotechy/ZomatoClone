import { useState, useEffect } from "react";
import { axiosInstance } from "../config/axios";
import { toggleCommentLike } from "../api/food";
import { useAuth } from "../context/AuthContext";

/* ---------------- ICONS (Inline SVGs for no extra deps) ---------------- */
const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-3.5 h-3.5 transition-transform duration-200 ${
      filled ? "scale-110" : "scale-100"
    }`}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

/* ---------------- LIKE BUTTON ---------------- */
const CommentLikeButton = ({ data, foodId, commentId, replyId }) => {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  const [liked, setLiked] = useState(
    data.likes?.some((id) => String(id) === String(currentUserId))
  );
  const [count, setCount] = useState(data.likes?.length || 0);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUserId) return;

    const next = !liked;
    setLiked(next);
    setCount((c) => (next ? c + 1 : c - 1));

    try {
      await toggleCommentLike(foodId, commentId, replyId);
    } catch {
      setLiked(!next);
      setCount((c) => (next ? c - 1 : c + 1));
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-[11px] font-medium transition-colors duration-200 ${
        liked ? "text-pink-500" : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <HeartIcon filled={liked} />
      <span>{count > 0 ? count : "Like"}</span>
    </button>
  );
};

/* ---------------- COMMENT ITEM ---------------- */
const CommentItem = ({ foodId, comment }) => {
  const { user } = useAuth();

  const [localReplies, setLocalReplies] = useState(comment.replies || []);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalReplies(comment.replies || []);
  }, [comment.replies]);

  const name = (u) => u?.username || u?.name || "User";
  const initial = (u) => name(u)[0]?.toUpperCase() || "U";

  const startReply = (u, id) => {
    setReplyingTo(id);
    setReplyText(`@${name(u)} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const submitReply = async () => {
    if (!replyText.trim() || !user) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/food/comment/reply", {
        foodId,
        commentId: comment._id,
        text: replyText,
      });

      if (res.data?.comments) {
        const updated = res.data.comments.find((c) => c._id === comment._id);
        setLocalReplies(updated?.replies || []);
      }
      cancelReply();
    } catch (err) {
      console.error("Reply failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group mb-6 animate-in fade-in zoom-in-95 duration-300">
      {/* ---------------- PARENT COMMENT ---------------- */}
      <div className="flex gap-3 relative z-10">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-xs text-white font-bold ring-2 ring-black shadow-lg">
            {initial(comment.user)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-200 hover:underline cursor-pointer">
              @{name(comment.user)}
            </span>
            <p className="text-[13px] text-zinc-300 leading-snug mt-0.5 break-words">
              {comment.text}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <CommentLikeButton
              data={comment}
              foodId={foodId}
              commentId={comment._id}
            />
            <button
              onClick={() => startReply(comment.user, comment._id)}
              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Reply
            </button>
          </div>

          {/* PARENT REPLY INPUT */}
          {replyingTo === comment._id && (
            <div className="mt-3 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center bg-zinc-800/50 rounded-xl px-3 py-2 border border-zinc-700/50 focus-within:border-zinc-600 focus-within:bg-zinc-800 transition-all">
                 <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 outline-none"
                  autoFocus
                  placeholder="Add a reply..."
                />
                <button
                  onClick={submitReply}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50 ml-2"
                >
                  {loading ? "..." : "Post"}
                </button>
              </div>
               <button
                  onClick={cancelReply}
                  className="text-[10px] text-zinc-500 hover:text-zinc-400 self-start ml-1"
                >
                  Cancel
                </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- REPLIES CONTAINER ---------------- */}
      {localReplies.length > 0 && (
        <div className="relative mt-2 pl-[1.15rem]"> 
          {/* THE VERTICAL SPINE LINE */}
          {/* This line runs down from the parent avatar */}
          <div className="absolute left-[1.1rem] top-[-10px] bottom-6 w-[2px] bg-zinc-800" />

          <div className="flex flex-col gap-4">
            {localReplies.map((reply, index) => (
              <div key={reply._id} className="relative flex gap-3 pl-6">
                
                {/* THE CURVED CONNECTOR LINE (The L shape) */}
                {/* Creates the curve from the spine to the child avatar */}
                <div className="absolute left-[0rem] top-[-12px] w-6 h-8 border-b-[2px] border-l-[2px] border-zinc-800 rounded-bl-2xl pointer-events-none" />

                <div className="flex-shrink-0 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-300 font-bold ring-2 ring-black">
                    {initial(reply.user)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-300 hover:underline cursor-pointer">
                      @{name(reply.user)}
                    </span>
                    <p className="text-xs text-zinc-400 leading-snug mt-0.5 break-words">
                      {reply.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-1.5">
                    <CommentLikeButton
                      data={reply}
                      foodId={foodId}
                      commentId={comment._id}
                      replyId={reply._id}
                    />
                    <button
                      onClick={() => startReply(reply.user, reply._id)}
                      className="text-[10px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Reply
                    </button>
                  </div>

                  {/* CHILD REPLY INPUT */}
                  {replyingTo === reply._id && (
                     <div className="mt-2 flex flex-col gap-2 animate-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-2 py-1.5 border border-zinc-700/50 focus-within:border-zinc-600 focus-within:bg-zinc-800">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none"
                          autoFocus
                          placeholder={`Reply to @${name(reply.user)}...`}
                        />
                        <button
                          onClick={submitReply}
                          disabled={loading}
                          className="text-[10px] font-bold text-blue-400 hover:text-blue-300 disabled:opacity-50 ml-2"
                        >
                          {loading ? ".." : "Post"}
                        </button>
                      </div>
                       <button onClick={cancelReply} className="text-[10px] text-zinc-500 hover:text-zinc-400 self-start ml-1">
                          Cancel
                        </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
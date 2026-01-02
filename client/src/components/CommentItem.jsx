import { useState } from "react";
import { replyToComment } from "../api/food";

const CommentItem = ({ foodId, comment, refreshData }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to get display name safely
  const getDisplayName = (user) => user?.username || user?.name || "User";
  const getInitial = (user) => (getDisplayName(user)[0] || "U").toUpperCase();

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      await replyToComment(foodId, comment._id, replyText);
      setReplyText("");
      setShowReplyInput(false);
      refreshData();
    } catch (error) {
      console.error("Failed to reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 text-white">
      {/* --- MAIN COMMENT --- */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
           {/* ✅ FIX HERE: Check username OR name */}
           {getInitial(comment.user)}
        </div>
        
        <div className="flex-1">
          <p className="text-sm">
            {/* ✅ FIX HERE: Check username OR name */}
            <span className="font-bold mr-2">{getDisplayName(comment.user)}</span>
            <span className="text-gray-200">{comment.text}</span>
          </p>

          <button 
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs text-gray-400 mt-1 hover:text-white transition cursor-pointer"
          >
            Reply
          </button>
        </div>
      </div>

      {/* --- REPLY INPUT FORM --- */}
      {showReplyInput && (
        <div className="ml-11 mt-2 flex gap-2">
          <input 
            type="text" 
            className="bg-gray-800 text-white text-xs p-2 rounded w-full outline-none border border-gray-700 focus:border-red-500"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={loading}
          />
          <button 
            onClick={handleReplySubmit}
            disabled={loading}
            className="text-xs text-red-500 font-bold hover:text-red-400 disabled:opacity-50"
          >
            {loading ? "..." : "Post"}
          </button>
        </div>
      )}

      {/* --- NESTED REPLIES LIST --- */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 border-l-2 border-gray-700 pl-3">
          {comment.replies.map((reply, index) => (
            <div key={index} className="flex items-start gap-2">
               {/* Small Avatar for Reply */}
               <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-[10px] shrink-0">
                  {/* ✅ FIX HERE: Check username OR name */}
                  {getInitial(reply.user)}
               </div>
               
               <div>
                 <p className="text-xs text-gray-300">
                   {/* ✅ FIX HERE: Check username OR name */}
                   <span className="font-bold text-white mr-2">
                     {getDisplayName(reply.user)}
                   </span>
                   {reply.text}
                 </p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
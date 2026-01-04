import { useState, useEffect } from "react"; // ✅ Import useEffect
import { replyToComment, toggleCommentLike } from "../api/food"; 

// --- 1. UPDATED HELPER COMPONENT ---
const CommentLikeButton = ({ data, foodId, commentId, replyId }) => {
  const user = JSON.parse(localStorage.getItem('zomatoUser'));
  const userId = user?.id || user?._id;
  
  // Initial check
  const isInitiallyLiked = data.likes?.includes(userId) || false;

  const [liked, setLiked] = useState(isInitiallyLiked);
  const [likeCount, setLikeCount] = useState(data.likes?.length || 0);

  // ✅ NEW: This Effect ensures the button updates when you switch accounts
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('zomatoUser'));
    const currentUserId = currentUser?.id || currentUser?._id;
    
    // Check if the NEW logged-in user is in the likes array
    const isLikedNow = data.likes?.includes(currentUserId) || false;
    
    setLiked(isLikedNow);
    setLikeCount(data.likes?.length || 0);
  }, [data.likes]); // Run this whenever the likes data changes

  const handleToggleLike = async (e) => {
    e.stopPropagation(); 
    
    // 1. Optimistic Update
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

    try {
        // 2. Call the Backend API
        await toggleCommentLike(foodId, commentId, replyId);
    } catch (error) {
        // 3. Revert if API fails
        console.error("Like failed", error);
        setLiked(!newLikedState);
        setLikeCount(newLikedState ? likeCount - 1 : likeCount + 1);
    }
  };

  return (
    <button 
       onClick={handleToggleLike}
       className={`flex items-center gap-1 transition-colors group ${liked ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}
    >
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={liked ? "0" : "2"} className="w-3.5 h-3.5 group-hover:scale-110 transition-transform">
         <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
       </svg>
       <span className="text-[10px] font-bold">
          {likeCount > 0 ? likeCount : "Like"}
       </span>
    </button>
  );
};

// --- MAIN COMPONENT ---
const CommentItem = ({ foodId, comment, refreshData }) => {
  const [activeReplyId, setActiveReplyId] = useState(null); 
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const getDisplayName = (user) => user?.username || user?.name || "User";
  const getInitial = (user) => (getDisplayName(user)[0] || "U").toUpperCase();

  const handleStartReply = (targetUser, id) => {
    setReplyText(`@${getDisplayName(targetUser)} `);
    setActiveReplyId(id); 
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      setLoading(true);
      await replyToComment(foodId, comment._id, replyText);
      setReplyText("");
      setActiveReplyId(null); 
      refreshData();
    } catch (error) {
      console.error("Failed to reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const ReplyInput = () => (
    <div className="mt-3 flex gap-2 animate-in fade-in duration-200 pl-2 relative z-10">
       <input 
          type="text" 
          className="bg-transparent border-b border-gray-600 text-white text-xs py-1 px-0 w-full outline-none focus:border-white transition-colors"
          placeholder="Add a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          autoFocus
       />
       <div className="flex gap-2 shrink-0">
         <button onClick={() => setActiveReplyId(null)} className="text-[10px] font-bold text-gray-400 hover:text-white">Cancel</button>
         <button onClick={handleReplySubmit} disabled={loading} className="text-[10px] font-bold text-blue-400 hover:text-blue-300">
            {loading ? "..." : "Reply"}
         </button>
       </div>
    </div>
  );

  return (
    <div className="mb-6 text-white relative">
      
      {/* --- MAIN COMMENT --- */}
      <div className="flex gap-3 relative z-10">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
           {getInitial(comment.user)}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col">
             <span className="text-[11px] text-gray-400 font-semibold mb-0.5">@{getDisplayName(comment.user)}</span>
             <span className="text-sm text-gray-100 leading-snug">{comment.text}</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
             <CommentLikeButton 
                data={comment} 
                foodId={foodId} 
                commentId={comment._id} 
                replyId={null} 
             />
             
             <button onClick={() => handleStartReply(comment.user, comment._id)} className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                Reply
             </button>
          </div>
          {activeReplyId === comment._id && <ReplyInput />}
        </div>
      </div>

      {/* --- NESTED REPLIES LIST --- */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-3 mt-0"> 
          {comment.replies.map((reply, index) => {
            const isReplyingToSomeone = reply.text.trim().startsWith("@");

            return (
              <div key={index} className={`flex gap-3 relative pt-3 ${isReplyingToSomeone ? "pl-6" : ""}`}>
                 <div className={`absolute -top-5 bottom-5 w-6 border-l-2 border-b-2 border-gray-700 rounded-bl-2xl ${isReplyingToSomeone ? "-left-3" : "-left-3"}`}></div>

                 <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-1 relative z-10">
                    {getInitial(reply.user)}
                 </div>
                 
                 <div className="flex-1">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold mb-0.5">@{getDisplayName(reply.user)}</span>
                      <p className="text-xs text-gray-200">{reply.text}</p>
                   </div>

                   <div className="flex items-center gap-3 mt-1.5">
                      <CommentLikeButton 
                          data={reply} 
                          foodId={foodId} 
                          commentId={comment._id} 
                          replyId={reply._id}
                      />

                      <button onClick={() => handleStartReply(reply.user, reply._id || index)} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">
                          Reply
                      </button>
                   </div>
                   {(activeReplyId === (reply._id || index)) && <ReplyInput />}
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
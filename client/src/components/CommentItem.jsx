import { useState } from "react";
import { replyToComment } from "../api/food";

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
             <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 group-hover:scale-110 transition-transform">
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.965C10.178 8.19 10.965 6.12 12 5.25c1.035-.87 1.963-1.185 2.802-1.09 1.103.125 1.947 1.024 1.947 2.136v1.389c0 .563.195 1.112.546 1.56a4.49 4.49 0 001.524 1.188c.933.443 1.622 1.315 1.68 2.383a4.494 4.494 0 01-1.235 3.55c-.466.488-.872.996-1.218 1.52-.346.525-.841.99-1.477 1.383-.635.392-1.37.59-2.17.59h-6.385zM2.25 18.75a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-6a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v6z" />
                </svg>
                <span className="text-[10px] font-bold">Like</span>
             </button>
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
            
            // 💡 TRICK: If text starts with '@', we assume it's a "Reply to Reply"
            const isReplyingToSomeone = reply.text.trim().startsWith("@");

            return (
              <div key={index} className={`flex gap-3 relative pt-3 ${isReplyingToSomeone ? "pl-6" : ""}`}>
                 
                 {/* The "L" Connector: Logic to stretch it if indented */}
                 <div className={`absolute -top-5 bottom-5 w-6 border-l-2 border-b-2 border-gray-700 rounded-bl-2xl ${isReplyingToSomeone ? "-left-3" : "-left-3"}`}></div>

                 {/* Reply Avatar */}
                 <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-1 relative z-10">
                    {getInitial(reply.user)}
                 </div>
                 
                 <div className="flex-1">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold mb-0.5">@{getDisplayName(reply.user)}</span>
                      <p className="text-xs text-gray-200">{reply.text}</p>
                   </div>

                   {/* Action Row */}
                   <div className="flex items-center gap-3 mt-1.5">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 group-hover:scale-110 transition-transform">
                            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.965C10.178 8.19 10.965 6.12 12 5.25c1.035-.87 1.963-1.185 2.802-1.09 1.103.125 1.947 1.024 1.947 2.136v1.389c0 .563.195 1.112.546 1.56a4.49 4.49 0 001.524 1.188c.933.443 1.622 1.315 1.68 2.383a4.494 4.494 0 01-1.235 3.55c-.466.488-.872.996-1.218 1.52-.346.525-.841.99-1.477 1.383-.635.392-1.37.59-2.17.59h-6.385zM2.25 18.75a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-6a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v6z" />
                          </svg>
                          <span className="text-[9px] font-bold">Like</span>
                      </button>
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
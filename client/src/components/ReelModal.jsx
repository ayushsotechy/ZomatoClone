import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem'; 
import { addComment } from '../api/food';

const ReelModal = ({ video, onClose, refreshData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
        await addComment(video._id, commentText);
        setCommentText(""); 
        if (refreshData) refreshData(); 
    } catch (error) {
        console.error("Failed to post comment");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} onClick={handleClose}>
      
      <div 
        className={`flex w-full max-w-6xl h-[85vh] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform transition-all duration-300 ease-out ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-10"}`}
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* --- LEFT SIDE: VIDEO --- */}
        <div className="flex-1 bg-black flex items-center justify-center relative border-r border-gray-800">
           <video 
             src={video.videoUrl || video.video} 
             className="h-full w-full object-contain" 
             controls 
             autoPlay 
             loop
           />
        </div>

        {/* --- RIGHT SIDE: COMMENTS --- */}
        <div className="w-[350px] md:w-[420px] bg-[#0f0f0f] flex flex-col relative">
           
           {/* Header */}
           <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0f0f0f]">
              <div>
                <h3 className="font-bold text-white text-md">Comments</h3>
                <span className="text-xs text-gray-500">{video.comments?.length || 0} comments</span>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
           </div>

           {/* Comments List */}
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {video.comments?.length > 0 ? (
                 video.comments.map((comment) => (
                    <CommentItem 
                       key={comment._id} 
                       comment={comment} 
                       foodId={video._id} 
                       refreshData={refreshData}
                    />
                 ))
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                    <p className="text-sm">No comments yet.</p>
                 </div>
              )}
           </div>

           {/* --- INPUT AREA --- */}
           <div className="p-4 border-t border-gray-800 bg-[#0f0f0f]">
              <form onSubmit={handleCommentSubmit} className="relative flex items-center">
                 
                 <input 
                   type="text" 
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   placeholder="Add a comment..." 
                   className="w-full bg-gray-900 border border-gray-700 text-white rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-white/40 focus:bg-black transition-all placeholder:text-gray-600"
                 />

                 {/* ✅ UPDATED SEND BUTTON: Lighter & Visible */}
                 <button 
                    type="submit"
                    disabled={!commentText.trim() || isSubmitting}
                    className={`absolute right-2 p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                       commentText.trim() 
                         ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 scale-100" 
                         : "bg-gray-800 text-white/50 cursor-not-allowed" // ✅ Visible Whitish-Grey
                    }`}
                 >
                    {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    )}
                 </button>

              </form>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ReelModal;
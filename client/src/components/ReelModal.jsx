import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem'; 

const ReelModal = ({ video, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger smooth entry animation
  useEffect(() => {
    setIsVisible(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Trigger exit animation
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  return (
    // 1. DARK BACKDROP
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} onClick={handleClose}>
      
      {/* 2. MAIN SPLIT CONTAINER */}
      <div 
        className={`flex w-full max-w-6xl h-[85vh] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform transition-all duration-300 ease-out ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-10"}`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        
        {/* --- LEFT SIDE: VIDEO PLAYER (Flexible Width) --- */}
        <div className="flex-1 bg-black flex items-center justify-center relative border-r border-gray-800">
           <video 
             src={video.videoUrl} // Ensure this matches your API data
             className="h-full w-full object-contain" 
             controls 
             autoPlay 
             loop
           />
        </div>


        {/* --- RIGHT SIDE: COMMENTS SIDEBAR (Fixed Width) --- */}
        <div className="w-[350px] md:w-[420px] bg-[#0f0f0f] flex flex-col relative">
           
           {/* Header */}
           <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0f0f0f]">
              <div>
                <h3 className="font-bold text-white text-md">Comments</h3>
                <span className="text-xs text-gray-500">{video.comments?.length || 0} comments</span>
              </div>
              
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
           </div>

           {/* Scrollable List */}
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {video.comments?.length > 0 ? (
                 video.comments.map((comment) => (
                    <CommentItem 
                       key={comment._id} 
                       comment={comment} 
                       foodId={video._id} 
                       refreshData={() => {}} // Pass your refresh function here
                    />
                 ))
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                    <p className="text-sm">No comments yet.</p>
                 </div>
              )}
           </div>

           {/* Input Area (Pinned Bottom) */}
           <div className="p-4 border-t border-gray-800 bg-[#0f0f0f]">
              <div className="flex items-center gap-3 bg-gray-900 rounded-full px-4 py-2 border border-gray-700 focus-within:border-gray-500 transition-colors">
                 <input 
                   type="text" 
                   placeholder="Add a comment..." 
                   className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                 />
                 <button className="text-sm font-bold text-blue-500 hover:text-blue-400">
                    Post
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ReelModal;
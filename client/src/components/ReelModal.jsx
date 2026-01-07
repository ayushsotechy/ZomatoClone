import React, { useState, useEffect, useRef } from 'react';
import CommentItem from './CommentItem'; 
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../config/axios';

const ReelModal = ({ video, onClose, refreshData }) => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    if (video) {
        setLikesCount(video.likes?.length || 0);
        const currentUserId = user?._id || user?.id;
        if (currentUserId && video.likes?.some(id => String(id) === String(currentUserId))) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
        setCommentsList(video.comments || []);
    }

    return () => document.body.style.overflow = 'unset';
  }, [video, user]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleLikeToggle = async () => {
      if (!user) return;
      const prevLiked = isLiked;
      setIsLiked(!prevLiked);
      setLikesCount(prev => !prevLiked ? prev + 1 : prev - 1);

      try {
          await axiosInstance.post(`/food/like/${video._id}`, { userId: user._id || user.id });
          if (refreshData) refreshData(); 
      } catch (error) {
          console.error("Like failed:", error);
          setIsLiked(prevLiked);
          setLikesCount(prev => prevLiked ? prev + 1 : prev - 1);
      }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
        const res = await axiosInstance.post(`/food/comment/${video._id}`, {
            userId: user._id || user.id,
            text: commentText
        });
        setCommentsList(res.data.comments); 
        setCommentText(""); 
        if (refreshData) refreshData(); 
    } catch (error) {
        console.error("Failed to post comment", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} onClick={handleClose}>
      
      {/* Close Button */}
      <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full transition-all z-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Main Container */}
      <div 
        className={`flex flex-col md:flex-row w-full max-w-6xl h-[90vh] md:h-[85vh] bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 transform transition-all duration-300 ease-out ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-10"}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* LEFT: Video Player */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden h-[40vh] md:h-full group">
           {/* Ambient Blur */}
           <div className="absolute inset-0 opacity-20 blur-3xl scale-110 pointer-events-none">
                <video src={video.videoUrl || video.video} className="w-full h-full object-cover" muted loop />
           </div>
           
           <video 
             ref={videoRef} 
             src={video.videoUrl || video.video} 
             className="relative z-10 w-full h-full object-contain" 
             controls 
             autoPlay 
             loop 
           />
        </div>

        {/* RIGHT: Info Panel */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-[#09090b] flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 shrink-0 h-[60vh] md:h-full">
           
           {/* Header */}
           <div className="p-4 border-b border-zinc-800 flex items-start gap-3 bg-[#09090b]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-purple-500 p-[2px] shrink-0">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                     {video.user?.username?.[0]?.toUpperCase() || "R"}
                  </div>
              </div>
              <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">@{video.user?.username || "Restaurant"}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{video.desc || video.name}</p>
              </div>
           </div>

           {/* Comments List */}
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#09090b]">
              {commentsList.length > 0 ? (
                 commentsList.map((comment, index) => (
                    <CommentItem 
                       key={comment._id || index} 
                       comment={comment} 
                       foodId={video._id} 
                       refreshData={refreshData}
                    />
                 ))
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-60">
                    <p className="text-sm">No comments yet.</p>
                 </div>
              )}
           </div>

           {/* Footer: Stats & Input */}
           <div className="border-t border-zinc-800 bg-[#09090b] p-3">
              <div className="flex items-center gap-4 mb-3 px-1">
                  <button onClick={handleLikeToggle} className="flex items-center gap-2 group">
                      {isLiked ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-rose-500 transition-transform group-active:scale-90"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.76 0 3.31.81 4.5 2.09C13.19 5.09 14.74 3 16.5 3 19.286 3 21.75 5.322 21.75 8.25c0 3.926-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white group-hover:text-rose-500 transition-transform group-active:scale-90"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                      )}
                      <span className="font-bold text-sm text-white">{likesCount} likes</span>
                  </button>
              </div>

              <form onSubmit={handleCommentSubmit} className="flex gap-2 relative">
                 <input 
                   type="text" 
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   placeholder="Add a comment..." 
                   className="w-full bg-zinc-900 text-white text-sm outline-none px-4 py-3 rounded-full border border-transparent focus:border-zinc-700 transition-colors placeholder:text-zinc-500"
                 />
                 <button 
                    disabled={!commentText.trim() || isSubmitting} 
                    className="absolute right-2 top-1.5 px-3 py-1.5 text-blue-500 font-bold text-sm disabled:opacity-50 hover:bg-blue-500/10 rounded-md transition-colors"
                 >
                    Post
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReelModal;
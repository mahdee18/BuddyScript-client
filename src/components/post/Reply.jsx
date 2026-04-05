import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likeReply } from '../../api/posts';
import { FaThumbsUp } from 'react-icons/fa';

const Reply = ({ postId, commentId, replyData, onReplyUpdated, onLikersClick }) => {
    const { user } = useAuth();
    
    // --- HELPER: GET AVATAR ---
    const getAvatar = (userData) => {
        if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') {
            return userData.profilePicture;
        }
        const firstName = userData?.firstName || '';
        const lastName = userData?.lastName || '';
        const name = `${firstName}+${lastName}`;
        // Provides a dynamic avatar if image is missing
        return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    };

    // Check if current user liked this reply
    const isLikedByCurrentUser = replyData?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id
    );

    const handleReplyLikeToggle = async () => {
        if (!user) return;
        
        const originalLikes = replyData.likes || [];
        const newLikes = isLikedByCurrentUser 
            ? originalLikes.filter(id => (id._id || id).toString() !== user._id) 
            : [...originalLikes, user._id];
            
        onReplyUpdated({ ...replyData, likes: newLikes });
        
        try { 
            await likeReply(postId, commentId, replyData._id); 
        } catch (error) { 
            onReplyUpdated({ ...replyData, likes: originalLikes }); 
        }
    };

    if (!replyData?.author) return null;

    const timeAgo = formatDistanceToNow(new Date(replyData.createdAt), { addSuffix: true })
        .replace('about ', '')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' seconds', 's')
        .replace(' second', 's');

    return (
        <div className="flex items-start space-x-2 w-full mt-1.5">
            {/* ── Reply Author Avatar (Using getAvatar helper) ── */}
            <img 
                src={getAvatar(replyData.author)} 
                alt={replyData.author.firstName} 
                className="object-cover w-7 h-7 rounded-full mt-1 shadow-sm"
            />
            
            <div className="flex-1 relative flex flex-col items-start">
                {/* ── Gray Bubble ── */}
                <div className="relative inline-block bg-[#f0f2f5] rounded-2xl px-3.5 py-2 max-w-full">
                    <p className="text-[12.5px] font-bold text-gray-900 leading-tight mb-0.5">
                        {replyData.author.firstName} {replyData.author.lastName}
                    </p>
                    <p className="text-[13.5px] text-gray-800 leading-snug break-words">
                        {replyData.content}
                    </p>

                    {/* ── Overlapping Likes Badge ── */}
                    {replyData.likes?.length > 0 && (
                        <div 
                            onClick={() => onLikersClick({ replyId: replyData._id })} 
                            className="absolute -bottom-2 -right-3 flex items-center bg-white rounded-full p-[2px] shadow-sm px-1.5 cursor-pointer z-10 border border-gray-100 transition-transform active:scale-90"
                        >
                            <div className="z-20 text-blue-500 bg-white rounded-full flex items-center justify-center">
                                <FaThumbsUp className="text-[9px] m-[2px]" />
                            </div>
                            <span className="text-[10px] text-gray-600 ml-1 font-medium pr-0.5">
                                {replyData.likes.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Action Links ── */}
                <div className="flex items-center gap-1.5 ml-3 mt-1 text-[11px] font-bold text-gray-600">
                    <button 
                        onClick={handleReplyLikeToggle} 
                        className={`hover:underline transition-colors ${isLikedByCurrentUser ? 'text-blue-600' : ''}`}
                    >
                        Like
                    </button>
                    
                    <span className="font-normal text-gray-400 ml-0.5">{timeAgo}</span>
                </div>
            </div>
        </div>
    );
};

export default Reply;
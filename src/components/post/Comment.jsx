import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likeComment, addReply } from '../../api/posts';
import Reply from './Reply';
import { FiSend } from 'react-icons/fi';
import { FaThumbsUp } from 'react-icons/fa';

const Comment = ({ postId, commentData, onCommentUpdated, onLikersClick }) => {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const getAvatar = (userData) => {
        if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') {
            return userData.profilePicture;
        }
        const name = `${userData?.firstName || ''}+${userData?.lastName || ''}`;
        return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    };

    const isLikedByCurrentUser = commentData?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id
    );

    // Calculate total mathematically
    const totalLikes = commentData?.likeCount ?? commentData?.likes?.length ?? 0;

    const handleCommentLikeToggle = async () => {
        if (!user) return;
        const originalLikes = commentData.likes || [];
        const originalCount = totalLikes;
        
        const newLikes = isLikedByCurrentUser
            ? originalLikes.filter(id => (id._id || id).toString() !== user._id)
            : [...originalLikes, user._id];

        // Use the new Counter Pattern
        const newCount = isLikedByCurrentUser ? Math.max(0, originalCount - 1) : originalCount + 1;

        onCommentUpdated({ ...commentData, likes: newLikes, likeCount: newCount });

        try {
            await likeComment(postId, commentData._id);
        } catch (error) {
            onCommentUpdated({ ...commentData, likes: originalLikes, likeCount: originalCount });
        }
    };

    const handleAddReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim() || !user) return;

        const content = replyContent;
        const tempId = `temp-${Date.now()}`;
        const currentReplies = commentData.replies || [];

        const optimisticReply = {
            _id: tempId, content, author: user, createdAt: new Date().toISOString(), likes: [], likeCount: 0
        };

        const optimisticCommentState = {
            ...commentData, replies: [...currentReplies, optimisticReply],
        };
        onCommentUpdated(optimisticCommentState);

        setReplyContent('');
        setIsReplying(false);

        try {
            const response = await addReply(postId, commentData._id, content);
            const data = response?.data || response;
            let updatedReplies = [...optimisticCommentState.replies];

            if (data && data.comments) {
                const serverComment = data.comments.find(c => c._id === commentData._id);
                if (serverComment && serverComment.replies) {
                    const lastServerReply = serverComment.replies[serverComment.replies.length - 1];
                    updatedReplies = updatedReplies.map(r => r._id === tempId ? lastServerReply : r);
                }
            }
            onCommentUpdated({ ...commentData, replies: updatedReplies });
        } catch (error) {
            onCommentUpdated({ ...commentData, replies: currentReplies });
        }
    };

    const handleReplyUpdated = (updatedReply) => {
        const updatedReplies = (commentData.replies || []).map(r =>
            r._id === updatedReply._id ? updatedReply : r
        );
        onCommentUpdated({ ...commentData, replies: updatedReplies });
    };

    if (!commentData?.author) return null;

    const timeAgo = formatDistanceToNow(new Date(commentData.createdAt), { addSuffix: true })
        .replace('about ', '').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm').replace(' minute', 'm');

    return (
        <div className="w-full mb-3">
            <div className="flex items-start space-x-2">
                <img 
                    src={getAvatar(commentData.author)} 
                    alt={commentData.author.firstName} 
                    className="object-cover w-9 h-9 rounded-full mt-1" 
                />
                
                <div className="flex-1 relative flex flex-col items-start">
                    <div className="relative inline-block bg-[#f0f2f5] rounded-2xl px-3.5 py-2 max-w-full">
                        <p className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">
                            {commentData.author.firstName} {commentData.author.lastName}
                        </p>
                        <p className="text-[14px] text-gray-800 leading-snug break-words">
                            {commentData.content}
                        </p>

                        {/* Render likeCount integer */}
                        {totalLikes > 0 && (
                            <div onClick={() => onLikersClick({ commentId: commentData._id })} className="absolute -bottom-2 -right-3 flex items-center bg-white rounded-full p-[2px] shadow-sm px-1.5 cursor-pointer z-10 border border-gray-100">
                                <div className="z-20 text-blue-500 bg-white rounded-full flex items-center justify-center">
                                    <FaThumbsUp className="text-[10px] m-[2px]" />
                                </div>
                                <span className="text-[11px] text-gray-600 ml-1 font-medium pr-0.5">{totalLikes}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-3 mt-1 text-[12px] font-bold text-gray-600">
                        <button onClick={handleCommentLikeToggle} className={`hover:underline ${isLikedByCurrentUser ? 'text-blue-600' : ''}`}>Like</button>
                        <span>.</span>
                        <button onClick={() => setIsReplying(!isReplying)} className="hover:underline">Reply</button>
                        <span className="font-normal text-gray-500 ml-0.5">. {timeAgo}</span>
                    </div>
                </div>
            </div>

            <div className="ml-11 mt-2 space-y-2">
                {commentData.replies?.map(reply => (
                    <Reply 
                        key={reply._id} 
                        postId={postId} 
                        commentId={commentData._id} 
                        replyData={reply} 
                        onReplyUpdated={handleReplyUpdated} 
                        onLikersClick={ids => onLikersClick({ ...ids, commentId: commentData._id })} 
                    />
                ))}
            </div>

            {isReplying && (
                <form onSubmit={handleAddReply} className="flex items-center w-full bg-[#f0f2f5] rounded-full px-2 py-1.5 mt-2 ml-10 max-w-[calc(100%-2.5rem)]">
                    <img src={getAvatar(user)} alt="Your avatar" className="w-6 h-6 rounded-full object-cover mr-2" />
                    <input type="text" value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Write a reply..." className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] placeholder-gray-500" />
                    <div className="flex items-center gap-2 pr-1 text-gray-400">
                        {replyContent.trim() && <button type="submit" className="text-blue-600"><FiSend size={16} /></button>}
                    </div>
                </form>
            )}
        </div>
    );
};

export default Comment;
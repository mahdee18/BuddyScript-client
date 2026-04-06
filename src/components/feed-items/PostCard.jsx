import React, { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import { likePost, addComment, getLikers, updatePostVisibility } from '../../api/posts';
import { BsThreeDots, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { BiLike, BiSolidLike, BiMessageRounded } from 'react-icons/bi'; // Added BiSolidLike
import { RiShareForwardLine } from 'react-icons/ri';

import LikersModal from '../post/LikersModal';
import Comment from '../post/Comment';
import PostOptionsMenu from '../post/PostOptionsMenu';
import VisibilityModal from '../post/VisibilityModal';

const PostCard = ({ post, onPostDeleted }) => {
    const { user } = useAuth();
    const [currentPost, setCurrentPost] = useState(post);
    const [commentContent, setCommentContent] = useState('');
    const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
    const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
    const [likersQuery, setLikersQuery] = useState({});
    const [isMenuOpen, setIsMenuOpen, menuRef] = useDetectOutsideClick(false);

    useEffect(() => { setCurrentPost(post); }, [post]);

    // --- GET AVATAR ---
    const getAvatar = (userData) => {
        if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') return userData.profilePicture;
        const name = `${userData?.firstName || ''}+${userData?.lastName || ''}`;
        return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    };

    const authorId = currentPost?.author?._id || currentPost?.author;
    const isAuthor = user?._id?.toString() === authorId?.toString();

    // Check if current user is in the likes array
    const isLikedByCurrentUser = currentPost?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id?.toString()
    );
    
    // Scaling Counters Rule: Use integer counts or fallback to length
    const totalLikes = currentPost?.likeCount ?? currentPost?.likes?.length ?? 0;
    const totalCommentsAndReplies = currentPost?.commentCount ?? (currentPost.comments?.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0) || 0);

    // --- INTERACTION HANDLERS ---

    const handleLikeToggle = async () => {
        if (!user) return;
        const originalLikes = currentPost.likes;
        const originalLikeCount = totalLikes;
        const wasAlreadyLiked = isLikedByCurrentUser;

        // Optimistic UI Update
        if (wasAlreadyLiked) {
            setCurrentPost(prev => ({ 
                ...prev, 
                likes: prev.likes.filter(l => (l._id || l).toString() !== user._id),
                likeCount: Math.max(0, originalLikeCount - 1)
            }));
        } else {
            setCurrentPost(prev => ({ 
                ...prev, 
                likes: [...prev.likes, { _id: user._id, firstName: user.firstName, profilePicture: user.profilePicture }],
                likeCount: originalLikeCount + 1
            }));
        }

        try { 
            await likePost(currentPost._id); 
        } catch (error) { 
            // Fallback Revert Rule
            setCurrentPost(prev => ({ ...prev, likes: originalLikes, likeCount: originalLikeCount })); 
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;
        const content = commentContent;
        const tempId = `temp-${Date.now()}`;
        const optimisticComment = { _id: tempId, content, author: user, createdAt: new Date().toISOString(), likes: [], replies: [] };
        
        setCurrentPost(prev => ({ 
            ...prev, 
            comments: [...(prev.comments || []), optimisticComment], 
            commentCount: (prev.commentCount || 0) + 1 
        }));
        setCommentContent('');

        try {
            const updatedPost = await addComment(currentPost._id, content);
            setCurrentPost(updatedPost);
        } catch (error) { 
            setCurrentPost(prev => ({ 
                ...prev, 
                comments: (prev.comments || []).filter(c => c._id !== tempId), 
                commentCount: Math.max(0, (prev.commentCount || 0) - 1) 
            }));
        }
    };

    const handleCommentUpdated = useCallback((updatedComment) => {
        setCurrentPost(prev => ({ ...prev, comments: prev.comments.map(c => c._id === updatedComment._id ? updatedComment : c) }));
    }, []);

    const handleLikersClick = (ids = {}) => {
        setLikersQuery(ids);
        setIsLikersModalOpen(true);
    };

    if (!currentPost || !currentPost.author) return null;

    return (
        <>
            <LikersModal isOpen={isLikersModalOpen} onClose={() => setIsLikersModalOpen(false)} fetchLikers={() => getLikers(currentPost._id, likersQuery)} />
            <VisibilityModal isOpen={isVisibilityModalOpen} onClose={() => setIsVisibilityModalOpen(false)} currentVisibility={currentPost.visibility || 'public'} onUpdate={(val) => {
                const old = currentPost.visibility;
                setCurrentPost(p => ({...p, visibility: val}));
                setIsVisibilityModalOpen(false);
                updatePostVisibility(currentPost._id, val).catch(() => setCurrentPost(p => ({...p, visibility: old})));
            }} />

            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 pb-3">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center space-x-2.5">
                        <img src={getAvatar(currentPost.author)} alt="User" className="object-cover w-10 h-10 rounded-full" />
                        <div>
                            <h4 className="font-semibold text-gray-900 text-[15px]">{currentPost.author.firstName} {currentPost.author.lastName}</h4>
                            <div className="text-[13px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <span>{formatDistanceToNowStrict(new Date(currentPost.createdAt))} ago</span>
                                <span>.</span>
                                <button onClick={() => isAuthor && setIsVisibilityModalOpen(true)} className={`capitalize inline-flex items-center gap-1 ${isAuthor ? 'hover:underline cursor-pointer' : ''}`}>
                                    {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />} {currentPost.visibility || 'public'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {isAuthor && (
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100"><BsThreeDots className="w-5 h-5" /></button>
                            {isMenuOpen && <PostOptionsMenu post={currentPost} menuRef={menuRef} onClose={() => setIsMenuOpen(false)} onPostDeleted={onPostDeleted} onEditVisibility={() => setIsVisibilityModalOpen(true)} />}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="px-4 mb-3">
                    <p className="text-[15px] text-gray-900 whitespace-pre-wrap">{currentPost.content}</p>
                </div>
                {currentPost.imageUrl && (
                    <div className="px-4">
                        <img src={currentPost.imageUrl} alt="Post" className="w-full max-h-[500px] rounded-lg border object-cover" />
                    </div>
                )}

                {/* Counts Section */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center cursor-pointer hover:underline" onClick={() => handleLikersClick()}>
                        <span className="text-[14px] text-gray-500 font-medium">
                            {totalLikes > 0 ? `👍 ${totalLikes}` : ''}
                        </span>
                    </div>
                    <div className="text-[14px] text-gray-500">
                        {totalCommentsAndReplies > 0 && <span>{totalCommentsAndReplies} Comments</span>}
                    </div>
                </div>

                <div className="px-4"><hr className="border-gray-200" /></div>

                {/* Interaction Buttons */}
                <div className="flex items-center justify-between px-3 py-1 mt-1 gap-1">
                    <button 
                        onClick={handleLikeToggle}
                        className={`flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] rounded-lg transition-colors 
                        ${isLikedByCurrentUser ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        {/* SWITCH ICON: Solid if liked, Outline if not */}
                        {isLikedByCurrentUser ? (
                            <BiSolidLike className="text-[22px]" />
                        ) : (
                            <BiLike className="text-[22px]" />
                        )}
                        <span>Like</span>
                    </button>

                    <button className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                        <BiMessageRounded className="text-[22px]" />
                        <span>Comment</span>
                    </button>

                    <button className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                        <RiShareForwardLine className="text-[22px]" />
                        <span>Share</span>
                    </button>
                </div>

                <div className="px-4 mb-2"><hr className="border-gray-200" /></div>

                {/* Comments List */}
                <div className="px-4 pt-1">
                    <div className="space-y-3 mb-2">
                        {currentPost.comments?.map(comment => (
                            <Comment 
                                key={comment._id} 
                                postId={currentPost._id} 
                                commentData={comment} 
                                onCommentUpdated={handleCommentUpdated} 
                                onLikersClick={handleLikersClick} 
                            />
                        ))}
                    </div>

                    {/* New Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="flex items-center w-full bg-[#f0f2f5] rounded-full px-2 py-1.5 mt-4">
                        <img src={getAvatar(user)} alt="User" className="w-8 h-8 rounded-full object-cover mr-2" />
                        <input 
                            value={commentContent} 
                            onChange={e => setCommentContent(e.target.value)} 
                            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px]" 
                            placeholder="Write a comment..." 
                        />
                        {commentContent.trim() && (
                            <button type="submit" className="text-blue-600 ml-1">
                                <FiSend size={18} />
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostCard;
import React, { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import { likePost, addComment, getLikers, updatePostVisibility } from '../../api/posts';
import { BsThreeDots, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { BiLike, BiMessageRounded } from 'react-icons/bi';
import { RiShareForwardLine } from 'react-icons/ri';

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

    // Check if user has liked the post
    const isLikedByCurrentUser = currentPost?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id?.toString()
    );

    // Local state for the specific reaction type (Like, Love, Haha)
    const [userReaction, setUserReaction] = useState(isLikedByCurrentUser ? 'Like' : null);
    const totalLikes = currentPost?.likes?.length || 0;

    const totalCommentsAndReplies = currentPost.comments?.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
    }, 0) || 0;

    const handleVisibilityChange = async (newVisibility) => {
        const originalVisibility = currentPost.visibility;
        setCurrentPost(prev => ({ ...prev, visibility: newVisibility }));
        setIsVisibilityModalOpen(false);
        try { await updatePostVisibility(currentPost._id, newVisibility); } 
        catch (error) { setCurrentPost(prev => ({ ...prev, visibility: originalVisibility })); }
    };

    // --- REACTION LOGIC ---
    const handleReactionClick = async (reactionType) => {
        if (!user) return;
        const originalLikes = currentPost.likes;
        const wasAlreadyLiked = isLikedByCurrentUser;

        if (userReaction === reactionType) {
            setUserReaction(null);
            setCurrentPost(prev => ({ ...prev, likes: prev.likes.filter(l => (l._id || l).toString() !== user._id) }));
        } else {
            // Add/Change reaction
            setUserReaction(reactionType);
            if (!wasAlreadyLiked) {
                setCurrentPost(prev => ({ ...prev, likes: [...prev.likes, { _id: user._id, firstName: user.firstName, profilePicture: user.profilePicture }] }));
            }
        }

        // 2. BACKEND CALL
        try { 
            await likePost(currentPost._id);
        } catch (error) {
            setUserReaction(wasAlreadyLiked ? 'Like' : null);
            setCurrentPost(prev => ({ ...prev, likes: originalLikes }));
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;
        const content = commentContent;
        setCommentContent('');
        try {
            const updatedPost = await addComment(currentPost._id, content);
            setCurrentPost(updatedPost);
        } catch (error) { console.error(error); }
    };

    const handleCommentUpdated = useCallback((updatedComment) => {
        setCurrentPost(prev => ({ ...prev, comments: prev.comments.map(c => c._id === updatedComment._id ? updatedComment : c) }));
    }, []);

    const handleLikersClick = (ids = {}) => {
        setLikersQuery(ids);
        setIsLikersModalOpen(true);
    };

    if (!currentPost || !currentPost.author) return null;

    const renderStackedAvatars = () => {
        const displayLikes = currentPost.likes.slice(0, 3);
        return (
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleLikersClick()}>
                <div className="flex -space-x-2 mr-2">
                    {displayLikes.map((like, i) => (
                        <img key={i} src={getAvatar(like)} alt="User" className="w-5 h-5 rounded-full border border-white object-cover shadow-sm" style={{ zIndex: 10 - i }} />
                    ))}
                </div>
                <span className="text-[14px] text-gray-500 font-medium">{totalLikes > 0 ? totalLikes : ''}</span>
            </div>
        );
    };

    return (
        <>
            <LikersModal isOpen={isLikersModalOpen} onClose={() => setIsLikersModalOpen(false)} fetchLikers={() => getLikers(currentPost._id, likersQuery)} />
            <VisibilityModal isOpen={isVisibilityModalOpen} onClose={() => setIsVisibilityModalOpen(false)} currentVisibility={currentPost.visibility || 'public'} onUpdate={handleVisibilityChange} />

            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 pb-3">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center space-x-2.5">
                        <img src={getAvatar(currentPost.author)} alt="User" className="object-cover w-10 h-10 rounded-full" />
                        <div>
                            <h4 className="font-semibold text-gray-900 text-[15px]">{currentPost.author.firstName} {currentPost.author.lastName}</h4>
                            <div className="text-[13px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <span>{formatDistanceToNowStrict(new Date(currentPost.createdAt))} ago</span><span>.</span>
                                {isAuthor ? (
                                    <button onClick={() => setIsVisibilityModalOpen(true)} className="capitalize inline-flex items-center gap-1 hover:underline hover:text-gray-700">
                                        {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />} {currentPost.visibility || 'public'}
                                    </button>
                                ) : (
                                    <span className="capitalize inline-flex items-center gap-1">
                                        {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />} {currentPost.visibility || 'public'}
                                    </span>
                                )}
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
                <div className="px-4 mb-3"><p className="text-[15px] text-gray-900 whitespace-pre-wrap">{currentPost.content}</p></div>
                {currentPost.imageUrl && <div className="px-4"><img src={currentPost.imageUrl} alt="Post content" className="w-full max-h-[500px] rounded-lg border object-cover" /></div>}

                {/* Counts */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-1">{totalLikes > 0 && renderStackedAvatars()}</div>
                    <div className="flex items-center gap-3 text-[14px] text-gray-500">
                        {totalCommentsAndReplies > 0 && <span className="cursor-pointer hover:underline">{totalCommentsAndReplies} Comments</span>}
                    </div>
                </div>

                <div className="px-4"><hr className="border-gray-200" /></div>

                {/* --- REACTION BUTTONS --- */}
                <div className="flex items-center justify-between px-3 py-1 mt-1 gap-1">
                    
                    <div className="relative group flex-1">
                        <div className="absolute bottom-1/2 left-0 w-full h-10 z-40 hidden group-hover:block"></div>
                        
                        {/* THE REACTION POPUP */}
                        <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-2xl border border-gray-100 z-50">
                            <button onClick={() => handleReactionClick('Like')} className="text-[30px] hover:scale-150 transition-transform origin-bottom">👍</button>
                            <button onClick={() => handleReactionClick('Love')} className="text-[30px] hover:scale-150 transition-transform origin-bottom">❤️</button>
                            <button onClick={() => handleReactionClick('Haha')} className="text-[30px] hover:scale-150 transition-transform origin-bottom">😆</button>
                        </div>
                        
                        {/* MAIN BUTTON */}
                        <button 
                            onClick={() => handleReactionClick(userReaction || 'Like')}
                            className={`flex items-center justify-center w-full gap-2 py-2 font-semibold text-[15px] rounded-lg transition-colors
                                ${userReaction ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {userReaction === 'Like' && <span className="text-xl">👍</span>}
                            {userReaction === 'Love' && <span className="text-xl">❤️</span>}
                            {userReaction === 'Haha' && <span className="text-xl">😆</span>}
                            {!userReaction && <BiLike className="text-[22px]" />}
                            <span>{userReaction || 'Like'}</span>
                        </button>
                    </div>

                    <button className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"><BiMessageRounded className="text-[22px]" /> Comment</button>
                    <button className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"><RiShareForwardLine className="text-[22px]" /> Share</button>
                </div>

                <div className="px-4 mb-2"><hr className="border-gray-200" /></div>

                {/* Comments Section */}
                <div className="px-4 pt-1">
                    <div className="space-y-3 mb-2">
                        {currentPost.comments?.map(comment => <Comment key={comment._id} postId={currentPost._id} commentData={comment} onCommentUpdated={handleCommentUpdated} onLikersClick={handleLikersClick} />)}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex items-center w-full bg-[#f0f2f5] rounded-full px-2 py-1.5 mt-4">
                        <img src={getAvatar(user)} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-2" />
                        <input value={commentContent} onChange={e => setCommentContent(e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] placeholder-gray-500" placeholder="Write a comment..." />
                        {commentContent.trim() && <button type="submit" className="text-blue-600 ml-1"><FiSend size={18} /></button>}
                    </form>
                </div>
            </div>
        </>
    );
};
export default PostCard;
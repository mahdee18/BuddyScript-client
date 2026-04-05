import React from 'react';
import { useFeed } from '../../hooks/useFeed';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import Stories from './Stories';
import ClipLoader from "react-spinners/ClipLoader";

const MainFeed = () => {
    const { posts, loading, error, addPost, removePost, updatePost } = useFeed();

     const renderFeedContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center my-12">
                    <ClipLoader color="#3b82f6" size={50} />
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="p-4 my-8 bg-red-50 text-red-600 border border-red-200 rounded-lg text-center">
                    {error}
                </div>
            );
        }
        
        if (!posts || posts.length === 0) {
            return (
                <div className="p-8 my-8 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
                    <p className="text-gray-500 font-medium">No posts yet. Be the first to share something!</p>
                </div>
            );
        }
        
        return (
            <div className="space-y-4 pb-10">
                {posts.map(post => (
                    <PostCard 
                        key={post._id} 
                        post={post} 
                        onPostDeleted={removePost} 
                        onPostUpdated={updatePost} 
                    />
                ))}
            </div>
        );
    };

    return (
        <main className="w-full">
            <Stories />
            <CreatePost onPostCreated={addPost} />
            
            {/* Call the helper function directly */}
            {renderFeedContent()}
        </main>
    );
};

export default MainFeed;
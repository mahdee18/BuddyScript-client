import { useState, useEffect, useCallback } from 'react';
import { getAllPosts } from '../api/posts';

export const useFeed = () => {
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState({ loading: true, error: null });

    useEffect(() => {
        const fetchPosts = async () => {
            setStatus({ loading: true, error: null });
            try {
                const fetchedPosts = await getAllPosts();
                setPosts(fetchedPosts);
                setStatus({ loading: false, error: null });
            } catch (err) {
                setStatus({ loading: false, error: 'Failed to load feed. Please try again.' });
            }
        };
        fetchPosts();
    }, []);

    // Prepends a new post to the feed.
    const addPost = useCallback((newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    }, []);

    // Removes a post from the feed by its ID.
    const removePost = useCallback((postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    }, []);
    
    // In-place update for a post.
    const updatePost = useCallback((updatedPost) => {
        setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
    }, []);

    return { posts, ...status, addPost, removePost, updatePost };
};
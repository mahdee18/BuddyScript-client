import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createPost } from '../../api/posts';
import { uploadImage } from '../../api/imageUpload';
import Avatar from './Avatar';
import { IoClose } from 'react-icons/io5';
import ClipLoader from "react-spinners/ClipLoader";
import { BsCardImage } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

// Memoized for performance.
const CreatePostModalForm = React.memo(({ onPostCreated, onClose }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [status, setStatus] = useState({ loading: false, error: null });
    const imageInputRef = useRef(null);

    // Clean up the object URL to prevent memory leaks.
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }, [imagePreview]);

    const handleRemoveImage = useCallback(() => {
        URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview('');
        if (imageInputRef.current) {
            imageInputRef.current.value = null;
        }
    }, [imagePreview]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!content && !imageFile) return;

        setStatus({ loading: true, error: null });

        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }
            const newPost = await createPost({ content, imageUrl });
            onPostCreated(newPost);
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            setStatus({ loading: false, error: `Failed to create post. ${errorMessage}` });
        }
    }, [content, imageFile, onPostCreated]);

    const ActionButton = ({ icon, text, onClick }) => (
        <button type="button" onClick={onClick} className="flex items-center gap-2 px-2 py-1 rounded-md transition text-gray-600 hover:bg-gray-100">
            {icon}
            <span className="font-semibold text-sm">{text}</span>
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-[600px] max-w-lg">
            <header className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">Create Post</h3>
                <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
                    <IoClose className="h-6 w-6 text-gray-600" />
                </button>
            </header>
            
            <main className="p-4">
                <div className="flex items-start space-x-3">
                    <Avatar
                        src={user?.profilePicture}
                        alt={user?.name || 'Your avatar'}
                        className="w-12 h-12"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 text-gray-700 bg-transparent rounded-lg focus:outline-none text-base resize-y"
                        rows="5"
                        placeholder={`What's on your mind, ${user?.name || ''}?`}
                        aria-label="Post content"
                    />
                </div>
                
                {imagePreview && (
                    <div className="relative mt-4 border rounded-lg p-2">
                        <img src={imagePreview} alt="Post preview" className="w-full rounded-lg max-h-72 object-contain" />
                        <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70" aria-label="Remove image">
                           <IoClose className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {status.error && <p className="text-red-500 text-sm text-center mt-2" role="alert">{status.error}</p>}
            </main>

            <footer className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center">
                    <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
                    <ActionButton icon={<BsCardImage size={20} className="text-green-500"/>} text="Photo" onClick={() => imageInputRef.current?.click()} />
                </div>
                
                <button type="submit" disabled={status.loading || (!content && !imageFile)} className="flex items-center gap-2 px-5 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                    {status.loading ? <ClipLoader color="#ffffff" size={20} /> : <><FiSend size={16} /> Post</>}
                </button>
            </footer>
        </form>
    );
});

export default CreatePostModalForm;
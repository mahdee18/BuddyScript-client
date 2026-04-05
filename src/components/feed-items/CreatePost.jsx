import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createPost } from '../../api/posts';
import { uploadImage } from '../../api/imageUpload';
import CreatePostTrigger from '../common/CreatePostTrigger';
import { BsImage, BsEmojiSmile, BsX, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import ClipLoader from "react-spinners/ClipLoader";
import Swal from 'sweetalert2';

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef(null);

    const getAvatar = (userData) => {
        if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') {
            return userData.profilePicture;
        }
        const name = `${userData?.firstName || ''}+${userData?.lastName || ''}`;
        return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !imageFile) return;

        setIsSubmitting(true);
        try {
            let uploadedImageUrl = '';
            if (imageFile) {
                uploadedImageUrl = await uploadImage(imageFile, (progress) => setUploadProgress(progress));
            }

            const postData = { content: content.trim(), imageUrl: uploadedImageUrl, visibility: visibility };
            const newPost = await createPost(postData);

            if (onPostCreated) onPostCreated(newPost);
            setContent('');
            removeImage();
            setIsModalOpen(false);
            
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Post shared!', showConfirmButton: false, timer: 2000 });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed to post', text: error.message });
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <>
            <CreatePostTrigger onClick={() => setIsModalOpen(true)} />

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
                    
                    <div 
                        className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* FIXED HEADER */}
                        <div className="flex items-center justify-between p-4 border-b shrink-0">
                            <div className="w-10"></div> {/* Spacer for symmetry */}
                            <h3 className="text-xl font-bold text-gray-800">Create Post</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                                title="Close"
                            >
                                <BsX size={24} />
                            </button>
                        </div>

                        {/* SCROLLABLE BODY */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <img src={getAvatar(user)} alt="User" className="w-11 h-11 rounded-full border shadow-sm" />
                                <div>
                                    <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                    <button 
                                        type="button"
                                        onClick={() => setVisibility(v => v === 'public' ? 'private' : 'public')}
                                        className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-semibold text-gray-600"
                                    >
                                        {visibility === 'public' ? <BsGlobe /> : <BsLockFill />}
                                        <span className="capitalize">{visibility}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Text Input */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`What's on your mind, ${user?.firstName}?`}
                                className="w-full min-h-[100px] text-lg text-gray-800 placeholder-gray-400 border-none focus:ring-0 resize-none"
                                autoFocus
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                    <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain mx-auto" />
                                    <button 
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                                    >
                                        <BsX size={20} />
                                    </button>
                                    
                                    {isSubmitting && uploadProgress > 0 && (
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-black/20">
                                            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="p-4 border-t shrink-0 bg-white">
                            {/* Action Row */}
                            <div className="p-2 border rounded-lg flex items-center justify-between mb-4">
                                <span className="font-semibold text-gray-700 text-sm pl-2">Add to your post</span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-all"
                                    >
                                        <BsImage size={22} />
                                    </button>
                                    <button type="button" className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-all">
                                        <BsEmojiSmile size={22} />
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || (!content.trim() && !imageFile)}
                                className={`w-full py-2.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
                                    ${(isSubmitting || (!content.trim() && !imageFile)) 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-md active:scale-[0.99]'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <ClipLoader color="#ffffff" size={18} />
                                        <span>{uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Sharing...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSend />
                                        <span>Post</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost;
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BsCardImage, BsCameraVideo, BsCalendar2Event, BsNewspaper } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

const CreatePostTrigger = ({ onClick }) => {
    const { user } = useAuth();

    // --- HELPER: GET AVATAR ---
    const getAvatar = (userData) => {
        if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') {
            return userData.profilePicture;
        }
        const name = `${userData?.firstName || ''}+${userData?.lastName || ''}`;
        return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    };

    // Reusable action button component
    const ActionButton = ({ icon, text, colorClass, onClickAction, disabled = false }) => (
        <button
            onClick={onClickAction}
            disabled={disabled}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                flex-1 sm:flex-initial justify-center sm:justify-start
            `}
        >
            <span className={colorClass}>{icon}</span>
            {/* Labels hide on very small screens to prevent layout breaking */}
            <span className="font-semibold text-gray-600 text-sm hidden md:inline">
                {text}
            </span>
        </button>
    );

    return (
        <div className="p-3 md:p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Top row: Avatar and input-like text */}
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3 md:pb-4">
                <img 
                    src={getAvatar(user)} 
                    alt="Your avatar" 
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                />
                <button
                    onClick={onClick}
                    className="flex-1 text-left px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 text-[15px] transition-colors"
                    aria-label="Create a new post"
                >
                    What's on your mind, {user?.firstName}?
                </button>
            </div>

            {/* Bottom row: Action buttons */}
            <div className="flex justify-between items-center pt-2 md:pt-3">
                <div className="flex items-center flex-1 gap-1">
                    <ActionButton 
                        icon={<BsCardImage size={20} />} 
                        text="Photo" 
                        colorClass="text-green-500"
                        onClickAction={onClick}
                    />
                    <ActionButton 
                        icon={<BsCameraVideo size={20} />} 
                        text="Video" 
                        colorClass="text-red-500"
                        disabled 
                    />
                    <ActionButton 
                        icon={<BsCalendar2Event size={20} />} 
                        text="Event" 
                        colorClass="text-blue-500"
                        disabled 
                    />
                    <ActionButton 
                        icon={<BsNewspaper size={20} />} 
                        text="Article" 
                        colorClass="text-orange-500"
                        disabled 
                    />
                </div>

                {/* Mobile Responsive Post Button */}
                <button
                    onClick={onClick}
                    className="flex items-center justify-center gap-2 px-3 md:px-5 py-2 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    aria-label="Open post creation form"
                >
                    <FiSend size={16} />
                    <span className="hidden sm:inline">Post</span>
                </button>
            </div>
        </div>
    );
};

export default CreatePostTrigger;
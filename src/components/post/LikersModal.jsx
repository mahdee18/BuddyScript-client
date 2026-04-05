import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { IoClose } from 'react-icons/io5'; // Added for a better close button

const LikersModal = ({ isOpen, onClose, fetchLikers }) => {
    const [likers, setLikers] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- HELPER: GET AVATAR ---
    const getAvatar = (userData) => {
        if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') {
            return userData.profilePicture;
        }
        const firstName = userData?.firstName || '';
        const lastName = userData?.lastName || '';
        const name = `${firstName}+${lastName}`;
        // Dynamic initials-based avatar
        return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    };

    useEffect(() => {
        if (!isOpen) return;

        const loadLikers = async () => {
            setLoading(true);
            try {
                const data = await fetchLikers();
                setLikers(data);
            } catch (error) {
                console.error("Failed to fetch likers:", error);
            } finally {
                setLoading(false);
            }
        };

        loadLikers();
    }, [isOpen, fetchLikers]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Reactions</h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="px-2 py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <ClipLoader color="#3b82f6" size={35} />
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {likers.length > 0 ? (
                                likers.map(liker => (
                                    <li 
                                        key={liker._id} 
                                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-default"
                                    >
                                        <img 
                                            src={getAvatar(liker)} // Using the helper
                                            alt={liker.firstName} 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 text-[15px]">
                                                {liker.firstName} {liker.lastName}
                                            </span>
                                            <span className="text-xs text-gray-500">Member</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <div className="flex flex-col items-center py-10 px-6 text-center">
                                    <p className="text-gray-500 font-medium">No reactions yet.</p>
                                    <p className="text-sm text-gray-400">Be the first one to react to this!</p>
                                </div>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikersModal;
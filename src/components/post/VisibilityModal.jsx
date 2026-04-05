import React from 'react';
import { BsGlobe, BsLockFill } from 'react-icons/bs';

const VisibilityModal = ({ isOpen, onClose, currentVisibility, onUpdate }) => {
    if (!isOpen) return null;

    const Option = ({ icon, title, description, value }) => (
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onUpdate(value);
            }} 
            className={`w-full text-left p-4 rounded-lg flex items-center gap-4 transition-colors ${currentVisibility === value ? 'bg-blue-50 border-2 border-blue-500' : 'hover:bg-gray-100 border-2 border-transparent'}`}
        >
            <div className={`p-3 rounded-full ${currentVisibility === value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Who can see this post?</h3>
                <div className="space-y-3">
                    <Option icon={<BsGlobe size={20} />} title="Public" description="Visible to everyone" value="public" />
                    <Option icon={<BsLockFill size={20} />} title="Private" description="Visible only to you" value="private" />
                </div>
            </div>
        </div>
    );
};

export default VisibilityModal;
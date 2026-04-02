import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Import the icons we will use
import { HiOutlineHome, HiOutlineUsers, HiOutlineBell, HiOutlineChatBubbleOvalLeft, HiOutlineBars3 } from "react-icons/hi2";
import { FiSettings, FiHelpCircle, FiLogOut, FiChevronRight } from "react-icons/fi";

// ===================================================================
// SUB-COMPONENT: The new profile dropdown menu for mobile
// ===================================================================
const MobileProfileMenu = ({ user, menuRef, onClose }) => {
    const { logOut } = useAuth();

    const MenuItem = ({ icon, text, onClick }) => (
        <button onClick={onClick} className="flex items-center justify-between w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-gray-100 rounded-full">{icon}</span>
                <span className="font-semibold">{text}</span>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
        </button>
    );

    return (
        <div
            ref={menuRef}
            className="absolute bottom-20 right-4 z-40 w-72 origin-bottom-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
        >
            <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                    <img src={user?.profilePicture || '/images/profile.png'} alt="Your avatar" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <h4 className="font-bold text-gray-800">{user?.firstName} {user?.lastName}</h4>
                        <Link to="/profile" onClick={onClose} className="text-sm text-blue-600 hover:underline">View Profile</Link>
                    </div>
                </div>
            </div>
            <div className="py-2">
                <MenuItem icon={<FiSettings size={20} />} text="Settings" />
                <MenuItem icon={<FiHelpCircle size={20} />} text="Help & Support" />
                <MenuItem icon={<FiLogOut size={20} />} text="Log Out" onClick={logOut} />
            </div>
        </div>
    );
};


// ===================================================================
// MAIN COMPONENT: The Mobile Bottom Navigation Bar
// ===================================================================
const MobileBottomNav = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const menuButton = event.target.closest('[data-menu-button="mobile-profile"]');
            if (menuRef.current && !menuRef.current.contains(event.target) && !menuButton) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const NavItem = ({ to, icon, isActive = false, onClick, menuButtonId }) => {
        const content = (
            <div className={`inline-flex flex-col items-center justify-center px-5 h-full group ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                {icon}
            </div>
        );

        if (onClick) {
            return <button onClick={onClick} data-menu-button={menuButtonId} className="w-full h-full">{content}</button>;
        }

        return <Link to={to} className="w-full h-full">{content}</Link>;
    };

    return (
        <>
            {isMenuOpen && <MobileProfileMenu user={user} menuRef={menuRef} onClose={() => setIsMenuOpen(false)} />}
            
            <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 lg:hidden">
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                    <NavItem to="/feed" icon={<HiOutlineHome size={28} />} isActive={true} />
                    <NavItem to="#" icon={<HiOutlineUsers size={28} />} />
                    <NavItem to="#" icon={<HiOutlineBell size={28} />} />
                    <NavItem to="#" icon={<HiOutlineChatBubbleOvalLeft size={28} />} />
                    
                    {/* The Hamburger Menu Trigger Button */}
                    <NavItem 
                        icon={<HiOutlineBars3 size={28} />} 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        menuButtonId="mobile-profile"
                    />
                </div>
            </div>
        </>
    );
};

export default MobileBottomNav;
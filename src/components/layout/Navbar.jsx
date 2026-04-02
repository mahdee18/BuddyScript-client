import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/logo.svg';
import notificationAvatar from '../../assets/images/friend-req.png';

// Icons
import { HiOutlineHome, HiOutlineUsers, HiOutlineBell, HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { FiChevronDown, FiChevronRight, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';

// --- SHARED HELPER: GET AVATAR ---
const getAvatar = (userData) => {
    if (userData?.profilePicture && userData.profilePicture !== '/default-avatar.png') {
        return userData.profilePicture;
    }
    const name = `${userData?.firstName || ''}+${userData?.lastName || ''}`;
    return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

// ===================================================================
// SUB-COMPONENT 1: Profile Dropdown Menu
// ===================================================================
const ProfileDropdown = React.forwardRef(({ user, logOut }, ref) => {
    const MenuItem = ({ icon, text, hasArrow = true, onClick }) => (
        <button onClick={onClick} className="flex items-center justify-between w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-gray-100 rounded-full text-gray-600">{icon}</span>
                <span className="font-semibold">{text}</span>
            </div>
            {hasArrow && <FiChevronRight className="w-4 h-4 text-gray-400" />}
        </button>
    );

    return (
        <div
            ref={ref}
            className="absolute right-0 z-50 w-72 mt-2 origin-top-right bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden border border-gray-100"
        >
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center space-x-3">
                    <img 
                        src={getAvatar(user)} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                    />
                    <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</h4>
                        <Link to="/profile" className="text-xs text-blue-600 font-semibold hover:underline">View your profile</Link>
                    </div>
                </div>
            </div>
            <div className="py-1">
                <MenuItem icon={<FiSettings size={18} />} text="Settings & Privacy" />
                <MenuItem icon={<FiHelpCircle size={18} />} text="Help & Support" />
                <MenuItem icon={<FiLogOut size={18} />} text="Log Out" onClick={logOut} />
            </div>
        </div>
    );
});

// ===================================================================
// SUB-COMPONENT 2: Notification Dropdown
// ===================================================================
const NotificationDropdown = React.forwardRef((props, ref) => (
    <div ref={ref} className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-50">
        <div className="p-4 border-b flex justify-between items-center">
            <h4 className="text-lg font-bold text-gray-900">Notifications</h4>
            <button className="text-blue-600 text-xs font-semibold hover:underline">Mark all as read</button>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {/* Mock Notifications */}
            {[
                { name: 'Steve Jobs', action: 'posted a new photo', time: '42m ago' },
                { name: 'Elon Musk', action: 'commented on your post', time: '1h ago' }
            ].map((noti, i) => (
                <div key={i} className="flex items-start p-4 space-x-3 transition hover:bg-blue-50/50 cursor-pointer border-b border-gray-50 last:border-0">
                    <img src={notificationAvatar} alt="User" className="w-11 h-11 rounded-full border border-gray-100" />
                    <div>
                        <p className="text-sm text-gray-700 leading-snug">
                            <span className="font-bold text-gray-900">{noti.name}</span> {noti.action}
                        </p>
                        <span className="text-xs font-semibold text-blue-500 mt-1 block">{noti.time}</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-3 text-center border-t">
            <button className="text-blue-600 text-sm font-bold hover:underline">See all notifications</button>
        </div>
    </div>
));

// ===================================================================
// MAIN NAVBAR COMPONENT
// ===================================================================
const Navbar = () => {
    const { user, logOut } = useAuth();
    
    // Using your custom hook correctly to manage visibility
    const [isProfileOpen, setIsProfileOpen, profileMenuRef] = useDetectOutsideClick(false);
    const [isNotificationOpen, setIsNotificationOpen, notificationMenuRef] = useDetectOutsideClick(false);

    const NavIconButton = ({ icon, badgeCount, onClick, active }) => (
        <button 
            onClick={onClick} 
            className={`relative p-2.5 rounded-full transition-all 
                ${active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
            {icon}
            {badgeCount > 0 && (
                 <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                    {badgeCount}
                </span>
            )}
        </button>
    );

    return (
        <header className="sticky top-0 z-[60] bg-white border-b border-gray-100 shadow-sm">
            {/* Desktop Navbar */}
            <nav className="hidden lg:block py-1.5">
                <div className="container px-4 mx-auto">
                    <div className="flex items-center justify-between">
                        
                        {/* Left: Logo & Search */}
                        <div className="flex items-center space-x-3">
                            <Link to="/feed">
                                <img src={logo} alt="Logo" className="h-9" />
                            </Link>
                            <div className="relative group">
                                <IoSearchOutline className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 top-1/2 left-3 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="search" 
                                    placeholder="Search Buddy Script..." 
                                    className="w-64 py-2.5 pl-10 pr-4 text-sm bg-gray-100 border-transparent rounded-full text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                                />
                            </div>
                        </div>

                        {/* Center: Main Nav */}
                        <div className="flex items-center space-x-1">
                            <Link to="/feed" className="p-3 px-8 rounded-xl text-blue-600 bg-blue-50 border-b-2 border-blue-600 transition-all">
                                <HiOutlineHome size={26} />
                            </Link>
                            <Link to="/friends" className="p-3 px-8 rounded-xl text-gray-500 hover:bg-gray-100 transition-all">
                                <HiOutlineUsers size={26} />
                            </Link>
                        </div>

                        {/* Right: User Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2.5">
                                <div className="relative">
                                    <NavIconButton 
                                        icon={<HiOutlineBell size={22} />} 
                                        badgeCount={2} 
                                        onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                                        active={isNotificationOpen}
                                    />
                                    {isNotificationOpen && <NotificationDropdown ref={notificationMenuRef} />}
                                </div>
                                <NavIconButton icon={<HiOutlineChatBubbleOvalLeft size={22} />} badgeCount={6} />
                            </div>
                            
                            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                                    className={`flex items-center space-x-2 p-1 pr-3 rounded-full transition-all
                                        ${isProfileOpen ? 'bg-blue-50 ring-2 ring-blue-100' : 'hover:bg-gray-100'}`}
                                >
                                    <img 
                                        src={getAvatar(user)} 
                                        alt="Me" 
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                                    />
                                    <div className="hidden text-sm font-bold text-gray-700 lg:block">
                                        {user?.firstName}
                                    </div>
                                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isProfileOpen && <ProfileDropdown ref={profileMenuRef} user={user} logOut={logOut} />}
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <div className="flex items-center justify-between p-3 lg:hidden">
                <Link to="/feed"><img src={logo} alt="Logo" className="h-8" /></Link>
                <div className="flex items-center space-x-3">
                    <IoSearchOutline size={24} className="text-gray-600" />
                    <img src={getAvatar(user)} alt="Me" className="w-8 h-8 rounded-full" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
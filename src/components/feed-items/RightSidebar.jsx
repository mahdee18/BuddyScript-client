import React, { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import Avatar from '../common/Avatar';


const suggestedProfile = {
    name: 'Radovan SkillArena',
    title: 'Founder & CEO at Trophy',
    imgSrc: '/Avatar.png'
};

const friendsList = [
    { name: 'Steve Jobs', title: 'CEO of Apple', imgSrc: '/people1.png', isActive: false },
    { name: 'Ryan Roslansky', title: 'CEO of Linkedin', imgSrc: '/people2.png', isActive: true },
    { name: 'Dylan Field', title: 'CEO of Figma', imgSrc: '/people3.png', isActive: true }
];

// --- Sub-components for the RightSidebar ---

const YouMightLikeCard = React.memo(({ name, title, imgSrc }) => (
    <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">You Might Like</h4>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">See All</a>
        </div>
        <hr />
        <div className="pt-4 text-center">
            <Avatar src={imgSrc} alt={name} className="w-16 h-16 mx-auto" />
            <h4 className="mt-3 font-bold text-gray-800">{name}</h4>
            <p className="text-sm text-gray-500">{title}</p>
            <div className="flex gap-3 mt-4">
                <button className="w-1/2 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Ignore</button>
                <button className="w-1/2 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Follow</button>
            </div>
        </div>
    </div>
));

const FriendListItem = React.memo(({ name, title, imgSrc, isActive }) => (
    <div className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer hover:bg-gray-100">
        <div className="flex items-center space-x-3">
            <Avatar src={imgSrc} alt={name} className="w-12 h-12" />
            <div>
                <h4 className="font-semibold text-gray-800">{name}</h4>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
        {isActive 
            ? <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> 
            : <span className="text-xs text-gray-400">5m</span>
        }
    </div>
));

const FriendList = React.memo(({ friends }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFriends = useMemo(() => 
        friends.filter(friend => 
            friend.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [friends, searchTerm]);

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Your Friends</h4>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">See All</a>
            </div>
            <div className="relative mb-4">
                <input 
                    type="search" 
                    placeholder="Search friends..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <FaSearch className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 top-1/2 left-3" />
            </div>
            <div className="space-y-1">
                {filteredFriends.map(friend => <FriendListItem key={friend.name} {...friend} />)}
            </div>
        </div>
    );
});


// --- Main RightSidebar Component ---

const RightSidebar = () => {
    return (
        <aside className="hidden space-y-6 lg:block">
            <YouMightLikeCard {...suggestedProfile} />
            <FriendList friends={friendsList} />
        </aside>
    );
};

export default RightSidebar;
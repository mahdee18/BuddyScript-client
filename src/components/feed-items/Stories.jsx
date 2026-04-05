import React, { useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- Data (In a real app, this would come from an API) ---
const storiesData = [
    { name: "Ryan Roslansky", storyImg: "/card_ppl2.png", avatarImg: "/mini_pic.png" },
    { name: "A Begum", storyImg: "/card_ppl3.png", avatarImg: "/mini_pic.png" },
    { name: "John Doe", storyImg: "/card_ppl4.png", avatarImg: "/mini_pic.png" },
    { name: "Jane Smith", storyImg: "/card_ppl2.png", avatarImg: "/mini_pic.png" },
    { name: "Peter Jones", storyImg: "/card_ppl3.png", avatarImg: "/mini_pic.png" },
    { name: "Elon Musk", storyImg: "/card_ppl4.png", avatarImg: "/mini_pic.png" },
];


// --- Sub-components for Stories ---

// Your own story card, now uses your profile picture.
const YourStoryCard = React.memo(() => {
    const { user } = useAuth();
    return (
        <div className="relative flex-shrink-0 w-28 h-48 overflow-hidden rounded-lg shadow-md cursor-pointer group">
            <img src={user?.profilePicture || '/card_ppl1.png'} alt="Your Story" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center text-white">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-blue-600 border-2 border-white rounded-full">
                    <FaPlus size={16} />
                </div>
                <p className="text-xs font-semibold">Your Story</p>
            </div>
        </div>
    );
});

// A story card for other users, now uses the Avatar component.
const StoryCard = React.memo(({ name, storyImg, avatarImg }) => (
    <div className="relative flex-shrink-0 w-28 h-48 overflow-hidden rounded-lg shadow-md cursor-pointer group">
        <img src={storyImg} alt={name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-3 left-3">
            <Avatar src={avatarImg} alt={name} className="w-10 h-10 border-4 border-blue-600" />
        </div>
        <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white truncate">{name}</p>
    </div>
));

// Main scrollable container for stories.
const Stories = React.memo(() => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };
    
    // A reusable button for navigation.
    const ScrollButton = ({ direction, onClick }) => (
        <button
            onClick={onClick}
            aria-label={`Scroll ${direction}`}
            className={`absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-100 ${direction === 'left' ? 'left-2' : 'right-2'}`}
        >
            {direction === 'left' ? <FaChevronLeft className="w-4 h-4 text-gray-600" /> : <FaChevronRight className="w-4 h-4 text-gray-600" />}
        </button>
    );

    return (
        <div className="relative mb-6 bg-white rounded-lg shadow">
            <div
                ref={scrollContainerRef}
                className="flex p-4 space-x-3 overflow-x-auto no-scrollbar"
            >
                <YourStoryCard />
                {storiesData.map(story => <StoryCard key={story.name} {...story} />)}
            </div>
            <ScrollButton direction="left" onClick={() => scroll('left')} />
            <ScrollButton direction="right" onClick={() => scroll('right')} />
        </div>
    );
});

export default Stories;
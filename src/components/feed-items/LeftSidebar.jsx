import React from 'react';
import Avatar from '../common/Avatar';
import {
    FaBook, FaLightbulb, FaUserFriends, FaBookmark,
    FaUsers, FaGamepad, FaCog, FaSave
} from 'react-icons/fa';

// Data for sidebar navigation links.
const sidebarLinks = [
    { icon: <FaBook />, text: 'Learning', isNew: true },
    { icon: <FaLightbulb />, text: 'Insights' },
    { icon: <FaUserFriends />, text: 'Find friends' },
    { icon: <FaBookmark />, text: 'Bookmarks' },
    { icon: <FaUsers />, text: 'Group' },
    { icon: <FaGamepad />, text: 'Gaming', isNew: true },
    { icon: <FaCog />, text: 'Settings' },
    { icon: <FaSave />, text: 'Save post' }
];

// Data for suggested people.
const suggestedPeople = [
    { name: 'Steve Jobs', title: 'CEO of Apple', imgSrc: '/people1.png' },
    { name: 'Ryan Roslansky', title: 'CEO of Linkedin', imgSrc: '/people2.png' },
    { name: 'Dylan Field', title: 'CEO of Figma', imgSrc: '/people3.png' }
];

// Data for events.
const events = [
    { day: '10', month: 'Jul', title: 'No more terrorism no more cry', attendees: 17, imgSrc: '/feed_event1.png' }
];

// A single, memoized link component.
const SidebarLink = React.memo(({ icon, text, isNew }) => (
    <li>
        <a href="#" className="flex items-center justify-between py-2 text-gray-600 transition group hover:text-blue-600">
            <span className="flex items-center gap-3">
                <span className="text-gray-400 group-hover:text-blue-600">{icon}</span>
                {text}
            </span>
            {isNew && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">New</span>}
        </a>
    </li>
));

// A single, memoized person component using Avatar.
const SuggestedPerson = React.memo(({ name, title, imgSrc }) => (
     <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
            <Avatar src={imgSrc} alt={name} className="w-12 h-12" />
            <div>
                <h4 className="font-semibold text-gray-800">{name}</h4>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
        <a href="#" className="px-4 py-1 text-sm font-semibold text-blue-600 transition border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
            Connect
        </a>
    </div>
));

// A single, memoized event card component.
const EventCard = React.memo(({ day, month, title, attendees, imgSrc }) => (
    <a href="#" className="block mt-4 transition rounded-lg group focus:outline-none focus:ring-2 focus:ring-blue-400">
        <div className="relative">
            <img src={imgSrc} alt={title} className="rounded-lg" />
            <div className="absolute flex items-center p-2 bg-white rounded-lg left-3 top-3">
                <div className="text-center">
                    <p className="font-bold text-blue-600">{day}</p>
                    <p className="text-xs font-bold text-gray-500">{month}</p>
                </div>
                <h4 className="ml-3 text-sm font-bold text-gray-800">{title}</h4>
            </div>
        </div>
        <div className="flex items-center justify-between p-2 text-sm">
            <p className="text-gray-500">{attendees} People Going</p>
            <span className="font-semibold text-blue-600 group-hover:underline">Going</span>
        </div>
    </a>
));

// Main sidebar component. Memoized because its content is largely static.
const LeftSidebar = React.memo(() => {
    return (
        <aside className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="mb-4 text-lg font-semibold text-gray-800">Explore</h4>
                <nav>
                    <ul className="space-y-1">
                        {sidebarLinks.map(link => <SidebarLink key={link.text} {...link} />)}
                    </ul>
                </nav>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Suggested People</h4>
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">See All</a>
                </div>
                {suggestedPeople.map(person => <SuggestedPerson key={person.name} {...person} />)}
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Events</h4>
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">See all</a>
                </div>
                {events.map(event => <EventCard key={event.title} {...event} />)}
            </div>
        </aside>
    );
});

export default LeftSidebar;
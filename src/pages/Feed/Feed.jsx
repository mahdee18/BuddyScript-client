import React from 'react';
import LeftSidebar from '../../components/feed-items/LeftSidebar';
import Navbar from '../../components/layout/Navbar';
import RightSidebar from '../../components/feed-items/RightSidebar';
import MainFeed from '../../components/feed-items/MainFeed';
import MobileBottomNav from '../../components/layout/MobileBottomNav';

const Feed = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container px-4 mx-auto pt-6 pb-20 lg:pb-6">
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:h-[calc(100vh-80px)]">
          <div className="lg:col-span-3 h-full overflow-y-auto no-scrollbar">
            <LeftSidebar />
          </div>
          <div className="lg:col-span-6 h-full overflow-y-auto no-scrollbar">
            <MainFeed />
          </div>
          <div className="lg:col-span-3 h-full overflow-y-auto no-scrollbar">
            <RightSidebar />
          </div>
        </div>
        <div className="lg:hidden">
          <MainFeed />
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Feed;
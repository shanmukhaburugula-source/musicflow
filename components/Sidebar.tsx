
import React from 'react';
import { Home, Compass, ListMusic, Heart, Search, Settings } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isMobile }) => {
  // Mobile-only bottom nav for smaller screens
  const menuItems = [
    { id: ViewType.HOME, icon: Home, label: 'Home' },
    { id: ViewType.EXPLORE, icon: Compass, label: 'Explore' },
    { id: ViewType.PLAYLISTS, icon: ListMusic, label: 'Library' },
    { id: ViewType.SEARCH, icon: Search, label: 'Search' },
  ];

  return (
    <div className="flex items-center justify-around w-full">
      {menuItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`p-3 rounded-full transition-all duration-300 ${
              isActive ? 'text-[#8B5CF6] bg-[#8B5CF6]/10' : 'text-zinc-500'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;

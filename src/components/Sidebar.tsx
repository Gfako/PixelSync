'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, MessageSquare, Clock, BarChart3, Settings, Plus, User } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: MessageSquare, label: 'Meeting Discussions', href: '/meeting-discussions' },
  { icon: Clock, label: 'Scheduling', href: '/scheduling' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-pixel-sidebar border-r-2 border-pixel-border h-screen flex flex-col shadow-retro-lg">
      {/* Logo */}
      <div className="p-4 border-b-2 border-pixel-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-pixel-border shadow-retro overflow-hidden bg-white">
            <img 
              src="/assets/logo.png" 
              alt="PixelSync Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-pixel-primary">Pixel Sync</span>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 p-4">
        <div className="text-xs uppercase tracking-wider text-pixel-muted mb-4 font-bold">
          Main Menu
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left pixel-sidebar-item border-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-pixel-primary text-white border-pixel-primary shadow-retro'
                    : 'hover:bg-pixel-surface text-pixel-text border-transparent hover:border-pixel-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* User Profile */}
      <div className="p-4 border-t-2 border-pixel-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pixel-secondary border-2 border-pixel-secondary flex items-center justify-center shadow-retro">
            <span className="text-xs font-bold text-white">IA</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-pixel-text">Ibrahim Ahmad</div>
          </div>
          <button className="text-pixel-text-light hover:text-pixel-text transition-colors p-1 hover:bg-pixel-surface border-2 border-transparent hover:border-pixel-border">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
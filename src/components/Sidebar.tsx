'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, MessageSquare, Clock, BarChart3, Settings, Plus, User, LogOut } from 'lucide-react';
import { useAuthSimple } from '@/hooks/useAuthSimple';
import { useState } from 'react';

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
  const router = useRouter();
  const { user, signOut } = useAuthSimple();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleSignOut = async () => {
    console.log('Sign out clicked');
    try {
      await signOut();
      setShowUserMenu(false);
      console.log('Sign out completed');
      // Redirect to auth page after sign out
      router.push('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  const getUserInitials = (user: any) => {
    if (!user) return 'U';
    const name = user.full_name || user.name || user.email || 'User';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const getUserDisplayName = (user: any) => {
    if (!user) return 'User';
    return user.full_name || user.name || user.email?.split('@')[0] || 'User';
  };
  
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
      <div className="p-4 border-t-2 border-pixel-border relative">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 bg-pixel-secondary border-2 border-pixel-secondary flex items-center justify-center shadow-retro hover:bg-pixel-primary transition-colors"
          >
            {user?.avatar_url || user?.image ? (
              <img
                src={user.avatar_url || user.image}
                alt={getUserDisplayName(user)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-xs font-bold text-white">${getUserInitials(user)}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-xs font-bold text-white">{getUserInitials(user)}</span>
            )}
          </button>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-pixel-text">
              {getUserDisplayName(user)}
            </div>
            {user?.email && (
              <div className="text-xs text-pixel-text-light truncate">
                {user.email}
              </div>
            )}
          </div>
          
          {/* Settings Button */}
          <Link
            href="/settings"
            className="text-pixel-text-light hover:text-pixel-text transition-colors p-1 hover:bg-pixel-surface border-2 border-transparent hover:border-pixel-border"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-pixel-surface border-2 border-pixel-border shadow-retro-lg">
            <div className="p-2 space-y-1">
              <Link
                href="/settings/profile"
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-pixel-text hover:bg-pixel-primary hover:text-white transition-colors text-sm"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4" />
                Profile Settings
              </Link>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-600 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
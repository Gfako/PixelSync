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
    <div className="w-72 brutalist-sidebar h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b-4" style={{borderColor: 'var(--border)'}}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center" style={{background: 'var(--primary)'}}>
            <Calendar className="w-6 h-6" style={{color: 'var(--primary-foreground)'}} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{color: 'var(--foreground)'}}>PIXELSYNC</h1>
            <p className="text-sm" style={{color: 'var(--foreground)', opacity: 0.7}}>BRUTAL SCHEDULING</p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`brutalist-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4" style={{borderColor: 'var(--border)'}}>
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-12 h-12 border-2 flex items-center justify-center" style={{background: 'var(--accent)', borderColor: 'var(--border)'}}
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
            <div className="text-sm font-black" style={{color: 'var(--foreground)'}}>
              {getUserDisplayName(user).toUpperCase()}
            </div>
            {user?.email && (
              <div className="text-xs" style={{color: 'var(--foreground)', opacity: 0.7}}>
                ADMIN USER
              </div>
            )}
          </div>
          
          {/* Settings Button */}
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
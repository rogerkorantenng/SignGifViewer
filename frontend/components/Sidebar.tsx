'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hand, Home, Languages, BookOpen, History, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/translate', label: 'Translate', icon: Languages },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { session, clearSession } = useSessionStore();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Hand className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">SignBridge</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {session?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 truncate">
            <div className="truncate text-sm font-medium">{session?.name || 'User'}</div>
            <div className="text-xs text-muted-foreground">Free Plan</div>
          </div>
        </div>
        <button
          onClick={clearSession}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

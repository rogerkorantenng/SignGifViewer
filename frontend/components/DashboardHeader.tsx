'use client';

import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { session } = useSessionStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="min-w-0 flex-1">
        {title ? (
          <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
        ) : (
          <div>
            <h1 className="truncate text-lg font-semibold sm:text-xl">
              {getGreeting()}, {session?.name || 'there'}!
            </h1>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Ready to learn sign language today?
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - Desktop only */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search signs..." className="w-64 pl-9" />
        </div>

        {/* Theme Toggle - Desktop only (mobile has it in sidebar header) */}
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Avatar - Desktop only */}
        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground sm:flex">
          {session?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}

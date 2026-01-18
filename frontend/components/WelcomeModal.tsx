'use client';

import { useState, useEffect } from 'react';
import { Hand, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionStore } from '@/lib/store';

export function WelcomeModal() {
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { isOnboarded, createSession } = useSessionStore();

  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      if (!isOnboarded) {
        setIsVisible(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isOnboarded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createSession(name.trim());
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-card p-8 shadow-xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Hand className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Welcome to SignBridge</h2>
          <p className="text-muted-foreground">
            Break communication barriers with AI-powered sign language translation.
          </p>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              What should we call you?
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="h-12"
            />
          </div>

          <Button type="submit" className="h-12 w-full text-base" disabled={!name.trim()}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
          <div>
            <div className="mb-1 text-2xl">🤟</div>
            <div>Real-time Translation</div>
          </div>
          <div>
            <div className="mb-1 text-2xl">📚</div>
            <div>Learn Signs</div>
          </div>
          <div>
            <div className="mb-1 text-2xl">📊</div>
            <div>Track Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}

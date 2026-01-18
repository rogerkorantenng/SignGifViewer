'use client';

import { Hand, MessageSquare } from 'lucide-react';
import { useTranslationStore, TranslationMode } from '@/lib/store';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { mode, setMode } = useTranslationStore();

  const modes: { value: TranslationMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'sign-to-text',
      label: 'Sign to Text',
      icon: <Hand className="h-5 w-5" />,
      description: 'Translate sign language to text',
    },
    {
      value: 'text-to-sign',
      label: 'Text to Sign',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Learn how to sign text',
    },
  ];

  return (
    <div className="mb-8 flex justify-center">
      <div className="inline-flex rounded-xl border bg-muted/50 p-1">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all',
              mode === m.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

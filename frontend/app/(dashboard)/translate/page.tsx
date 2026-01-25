'use client';

import { VideoCapture } from '@/components/VideoCapture';
import { TranslationDisplay } from '@/components/TranslationDisplay';
import { ModeToggle } from '@/components/ModeToggle';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAnalyticsStore, useTranslationStore } from '@/lib/store';
import { useEffect, useRef } from 'react';

export default function TranslatePage() {
  const { addActivity, incrementSignsLearned, addPoints } = useAnalyticsStore();
  const { translations } = useTranslationStore();
  const lastTranslationCount = useRef(translations.length);

  // Track translations as activities
  useEffect(() => {
    if (translations.length > lastTranslationCount.current) {
      const latestTranslation = translations[0];
      if (latestTranslation) {
        addActivity('translation', `Translated: "${latestTranslation.text}"`,
          `${Math.round(latestTranslation.confidence * 100)}% confidence`
        );
        incrementSignsLearned();
        addPoints(10);
      }
    }
    lastTranslationCount.current = translations.length;
  }, [translations, addActivity, incrementSignsLearned, addPoints]);

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Translate" />

      <div className="p-4 sm:p-6">
        {/* Mode Toggle */}
        <ModeToggle />

        {/* Main Translation Interface */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Camera Feed</h2>
            <VideoCapture />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Translation</h2>
            <TranslationDisplay />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Tips for Better Translation</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">1.</span>
              Ensure good lighting on your hands
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">2.</span>
              Position hands clearly in the camera frame
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">3.</span>
              Make signs slowly and clearly
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">4.</span>
              Use a plain background if possible
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

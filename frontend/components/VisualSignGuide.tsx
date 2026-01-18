'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SignStepCard } from '@/components/SignStepCard';
import { VideoResourceList } from '@/components/VideoEmbed';

interface VisualSignStep {
  step: number;
  word: string;
  description: string;
  hand_shape: string;
  palm_orientation: string;
  location: string;
  movement?: string;
  facial_expression?: string;
  video_search_query: string;
}

interface VideoResource {
  title: string;
  url: string;
  source: string;
  thumbnail?: string;
}

interface VisualGuidance {
  text: string;
  language: string;
  steps: VisualSignStep[];
  video_resources: VideoResource[];
  tips?: string;
  common_mistakes?: string;
}

interface VisualSignGuideProps {
  guidance: VisualGuidance;
}

export function VisualSignGuide({ guidance }: VisualSignGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToPrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentStep((prev) => Math.min(guidance.steps.length - 1, prev + 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            How to sign &quot;{guidance.text}&quot;
          </h2>
          <p className="text-sm text-muted-foreground">
            {guidance.steps.length} step{guidance.steps.length !== 1 ? 's' : ''} in {guidance.language}
          </p>
        </div>
        {guidance.steps.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
              {currentStep + 1} / {guidance.steps.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentStep === guidance.steps.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Step Navigation Dots */}
      {guidance.steps.length > 1 && (
        <div className="flex justify-center gap-2">
          {guidance.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-6 bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Current Step Card */}
      {guidance.steps[currentStep] && (
        <SignStepCard step={guidance.steps[currentStep]} isActive />
      )}

      {/* Tips and Common Mistakes */}
      <div className="grid gap-4 sm:grid-cols-2">
        {guidance.tips && (
          <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Tips</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">{guidance.tips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {guidance.common_mistakes && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Common Mistakes
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {guidance.common_mistakes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Video Resources */}
      <VideoResourceList resources={guidance.video_resources} />

      {/* All Steps Overview */}
      {guidance.steps.length > 1 && (
        <div className="space-y-3">
          <h3 className="font-semibold">All Steps</h3>
          <div className="grid gap-3">
            {guidance.steps.map((step, index) => (
              <button
                key={step.step}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  index === currentStep
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.step}
                </span>
                <span className="font-medium">&quot;{step.word}&quot;</span>
                <span className="flex-1 truncate text-sm text-muted-foreground">
                  {step.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Loading state component
export function VisualSignGuideLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Generating visual guide...</p>
    </div>
  );
}

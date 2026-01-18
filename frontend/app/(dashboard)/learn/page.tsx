'use client';

import { useState } from 'react';
import { Search, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '@/components/DashboardHeader';
import { VisualSignGuide, VisualSignGuideLoading } from '@/components/VisualSignGuide';
import { SignGifViewer } from '@/components/SignGifViewer';
import { useAnalyticsStore } from '@/lib/store';

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

const commonSigns = [
  'Hello',
  'Thank you',
  'Please',
  'Sorry',
  'Yes',
  'No',
  'Help',
  'I love you',
  'Good morning',
  'How are you',
  'My name is',
  'Nice to meet you',
];

export default function LearnPage() {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<VisualGuidance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addActivity, incrementSignsLearned, addPoints } = useAnalyticsStore();

  const fetchGuidance = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setGuidance(null);

    try {
      const response = await fetch('http://localhost:8000/api/signs/visual-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: 'ASL' }),
      });

      if (!response.ok) {
        throw new Error('Failed to get visual guidance');
      }

      const data = await response.json();
      setGuidance(data);

      // Track learning activity
      addActivity('learning', `Learned to sign: "${text}"`, `${data.steps.length} steps`);
      incrementSignsLearned();
      addPoints(25);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGuidance(searchText);
  };

  const handleQuickSelect = (sign: string) => {
    setSearchText(sign);
    fetchGuidance(sign);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Learn Signs" />

      <div className="p-6">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Visual Sign Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter a word or phrase to learn..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-12 pl-10"
                />
              </div>
              <Button type="submit" disabled={!searchText.trim() || isLoading} className="h-12 px-8">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Learn'
                )}
              </Button>
            </form>

            {/* Quick Select */}
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">Quick select common signs:</p>
              <div className="flex flex-wrap gap-2">
                {commonSigns.map((sign) => (
                  <Button
                    key={sign}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSelect(sign)}
                    disabled={isLoading}
                  >
                    {sign}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-destructive/50 bg-destructive/10">
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Make sure the backend server is running on port 8000.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-6">
              <VisualSignGuideLoading />
            </CardContent>
          </Card>
        )}

        {/* Visual Guide with GIF Demo */}
        {guidance && !isLoading && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* GIF Viewer */}
            <div className="lg:col-span-1">
              <SignGifViewer
                word={searchText}
                autoLoad={true}
                showSearch={false}
                title="Sign Demonstration"
              />
            </div>

            {/* Visual Guide */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <VisualSignGuide guidance={guidance} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State with GIF Search */}
        {!guidance && !isLoading && !error && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">Start Learning</h3>
                <p className="mx-auto max-w-md text-muted-foreground">
                  Enter a word or phrase above to get step-by-step visual instructions
                  for signing in ASL. You can also click on a common sign to get started.
                </p>
              </CardContent>
            </Card>

            {/* GIF Search */}
            <SignGifViewer
              title="Search Sign Demonstrations"
              autoLoad={false}
              showSearch={true}
            />
          </div>
        )}

        {/* Learning Resources */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">External Resources</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://www.handspeak.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h4 className="mb-2 font-semibold">HandSpeak</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive ASL dictionary with video demonstrations
                  </p>
                </CardContent>
              </Card>
            </a>
            <a
              href="https://www.lifeprint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h4 className="mb-2 font-semibold">ASL University (Lifeprint)</h4>
                  <p className="text-sm text-muted-foreground">
                    Free ASL lessons and resources by Dr. Bill Vicars
                  </p>
                </CardContent>
              </Card>
            </a>
            <a
              href="https://www.signingsavvy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h4 className="mb-2 font-semibold">Signing Savvy</h4>
                  <p className="text-sm text-muted-foreground">
                    ASL sign language video dictionary with word-finding tools
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

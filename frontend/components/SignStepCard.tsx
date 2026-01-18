'use client';

import { Hand, MoveRight, MapPin, Smile, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

interface SignStepCardProps {
  step: VisualSignStep;
  isActive?: boolean;
}

export function SignStepCard({ step, isActive = false }: SignStepCardProps) {
  const searchYouTube = () => {
    const query = encodeURIComponent(step.video_search_query);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <Card className={`transition-all ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {step.step}
            </span>
            <div>
              <h4 className="text-lg font-semibold">&quot;{step.word}&quot;</h4>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={searchYouTube}>
            <Search className="mr-2 h-4 w-4" />
            Video
          </Button>
        </div>

        {/* Description */}
        <p className="mb-4 text-muted-foreground">{step.description}</p>

        {/* Visual Details Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Hand Shape */}
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <Hand className="mt-0.5 h-5 w-5 text-blue-500" />
            <div>
              <div className="text-xs font-medium text-muted-foreground">Hand Shape</div>
              <div className="text-sm">{step.hand_shape}</div>
            </div>
          </div>

          {/* Palm Orientation */}
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <MoveRight className="mt-0.5 h-5 w-5 text-green-500" />
            <div>
              <div className="text-xs font-medium text-muted-foreground">Palm Faces</div>
              <div className="text-sm">{step.palm_orientation}</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <MapPin className="mt-0.5 h-5 w-5 text-orange-500" />
            <div>
              <div className="text-xs font-medium text-muted-foreground">Location</div>
              <div className="text-sm">{step.location}</div>
            </div>
          </div>

          {/* Movement or Facial Expression */}
          {step.movement && (
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <MoveRight className="mt-0.5 h-5 w-5 text-purple-500" />
              <div>
                <div className="text-xs font-medium text-muted-foreground">Movement</div>
                <div className="text-sm">{step.movement}</div>
              </div>
            </div>
          )}

          {step.facial_expression && (
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <Smile className="mt-0.5 h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-xs font-medium text-muted-foreground">Expression</div>
                <div className="text-sm">{step.facial_expression}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, RefreshCw, ImageOff, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AltSource {
  name: string;
  url: string;
  type: string;
}

interface SignGifData {
  word: string;
  gif_url: string | null;
  page_url: string;
  source: string;
  found: boolean;
  alt_sources: AltSource[];
  media_type: 'image' | 'video';
}

interface SignGifViewerProps {
  word?: string;
  autoLoad?: boolean;
  showSearch?: boolean;
  title?: string;
}

export function SignGifViewer({
  word: initialWord,
  autoLoad = true,
  showSearch = true,
  title = 'Sign Demonstration',
}: SignGifViewerProps) {
  const [searchWord, setSearchWord] = useState(initialWord || '');
  const [currentWord, setCurrentWord] = useState(initialWord || '');
  const [gifData, setGifData] = useState<SignGifData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchGif = async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageError(false);
    setCurrentWord(word);

    try {
      const response = await fetch('http://localhost:8000/api/signs/gif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sign GIF');
      }

      const data = await response.json();
      setGifData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GIF');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialWord && autoLoad) {
      fetchGif(initialWord);
    }
  }, [initialWord, autoLoad]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGif(searchWord);
  };

  const handleRetry = () => {
    if (currentWord) {
      fetchGif(currentWord);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          {gifData?.source && (
            <span className="text-xs font-normal text-muted-foreground">
              via {gifData.source}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        {showSearch && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a word to see sign..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchWord.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </form>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Searching for &quot;{currentWord}&quot;...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 bg-destructive/10 rounded-lg">
            <p className="text-destructive mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* GIF Display */}
        {gifData && !isLoading && !error && (
          <div className="space-y-4">
            {/* Media Display (Video or GIF) */}
            {gifData.found && gifData.gif_url && !imageError ? (
              <div className="relative bg-black rounded-lg overflow-hidden">
                {gifData.media_type === 'video' ? (
                  <video
                    src={gifData.gif_url}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    onError={() => setImageError(true)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={gifData.gif_url}
                    alt={`ASL sign for ${gifData.word}`}
                    className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    onError={() => setImageError(true)}
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  {gifData.media_type === 'video' && <Play className="h-3 w-3" />}
                  Sign: &quot;{gifData.word}&quot;
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg">
                <ImageOff className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-1">
                  No direct GIF found for &quot;{gifData.word}&quot;
                </p>
                <p className="text-sm text-muted-foreground">
                  Try the links below to find demonstrations
                </p>
              </div>
            )}

            {/* Source Link */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">View on {gifData.source}</p>
                <p className="text-xs text-muted-foreground">
                  Full page with additional context
                </p>
              </div>
              <a
                href={gifData.page_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </a>
            </div>

            {/* Alternative Sources */}
            {gifData.alt_sources && gifData.alt_sources.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">More Resources:</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {gifData.alt_sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      {source.type === 'video_search' ? (
                        <Play className="h-4 w-4 text-red-500" />
                      ) : (
                        <ExternalLink className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm">{source.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!gifData && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg">
            <Play className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Enter a word above to see the sign demonstration
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

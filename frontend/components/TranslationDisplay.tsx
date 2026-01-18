'use client';

import { useState } from 'react';
import { Volume2, Copy, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslationStore } from '@/lib/store';

export function TranslationDisplay() {
  const { translations, isTranslating, clearTranslations, mode } = useTranslationStore();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  if (mode === 'text-to-sign') {
    return <TextToSignDisplay />;
  }

  return (
    <Card className="h-[400px] overflow-hidden">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Detected Signs</h3>
            {isTranslating && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
          {translations.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearTranslations}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Translations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {translations.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
              <div>
                <p className="mb-2">No translations yet</p>
                <p className="text-sm">Start the camera and sign to see translations</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {translations.map((translation) => (
                <li
                  key={translation.id}
                  className="rounded-lg border bg-muted/50 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{translation.text}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {translation.timestamp.toLocaleTimeString()}
                        </span>
                        <span>•</span>
                        <span>
                          {Math.round(translation.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => speakText(translation.text)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(translation.text)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Combined Output */}
        {translations.length > 0 && (
          <div className="border-t p-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Combined translation:
            </p>
            <p className="rounded-lg bg-primary/10 p-3 text-lg">
              {translations
                .slice()
                .reverse()
                .map((t) => t.text)
                .join(' ')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

interface SignStep {
  step: number;
  description: string;
  hand_position: string;
  movement?: string;
}

interface SignGuidance {
  steps: SignStep[];
  notes?: string;
}

function TextToSignDisplay() {
  const { currentText, setCurrentText } = useTranslationStore();
  const [guidance, setGuidance] = useState<SignGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuidance = async () => {
    if (!currentText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/signs/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText, language: 'ASL' }),
      });

      if (!response.ok) {
        throw new Error('Failed to get guidance');
      }

      const data = await response.json();
      setGuidance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[400px] overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <h3 className="font-medium">Text to Sign Language</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-2">
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Type text to see sign language guidance..."
              className="h-20 flex-1 resize-none rounded-lg border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  fetchGuidance();
                }
              }}
            />
          </div>

          <Button
            onClick={fetchGuidance}
            disabled={!currentText.trim() || isLoading}
            className="mt-2 w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting guidance...
              </>
            ) : (
              'Get Sign Language Guide'
            )}
          </Button>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {guidance && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium">
                How to sign &quot;{currentText}&quot; in ASL:
              </p>

              {guidance.steps.map((step) => (
                <div key={step.step} className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step.step}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{step.description}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <strong>Hand position:</strong> {step.hand_position}
                      </p>
                      {step.movement && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Movement:</strong> {step.movement}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {guidance.notes && (
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-sm">
                    <strong>Tips:</strong> {guidance.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslationStore } from '@/lib/store';

export function VideoCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsTranslating, addTranslation } = useTranslationStore();

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please grant permission.');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setIsTranslating(false);
    }
  }, [setIsTranslating]);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    try {
      setIsTranslating(true);
      const response = await fetch('/api/translate/frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          addTranslation(data.text, data.confidence);
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [isStreaming, setIsTranslating, addTranslation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      interval = setInterval(captureFrame, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, captureFrame]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-4">
      <div className="video-container relative">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80">
            {error ? (
              <p className="mb-4 text-center text-destructive">{error}</p>
            ) : (
              <Camera className="mb-4 h-16 w-16 text-muted-foreground" />
            )}
            <p className="mb-4 text-muted-foreground">
              {error ? 'Camera access denied' : 'Camera is off'}
            </p>
          </div>
        )}

        {isStreaming && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-sm text-primary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Live
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isStreaming ? (
          <Button onClick={startCamera} className="flex-1">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={stopCamera} variant="destructive" className="flex-1">
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
            <Button onClick={captureFrame} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

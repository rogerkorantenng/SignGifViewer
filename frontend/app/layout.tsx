import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SignVu - Real-time Sign Language Translator',
  description:
    'Break communication barriers with AI-powered sign language translation. Powered by Gemini 3.',
  keywords: ['sign language', 'translator', 'accessibility', 'AI', 'Gemini 3'],
  authors: [{ name: 'SignVu Team' }],
  openGraph: {
    title: 'SignVu - Real-time Sign Language Translator',
    description: 'Break communication barriers with AI-powered sign language translation.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

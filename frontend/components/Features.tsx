import { Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Real-time Translation',
    description: 'Instant sign language recognition powered by Gemini 3 multimodal AI.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Multiple Languages',
    description: 'Support for ASL, BSL, and more sign languages coming soon.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Privacy First',
    description: 'All video processing happens securely. No data is stored.',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Bidirectional',
    description: 'Translate signs to text and learn how to sign any phrase.',
  },
];

export function Features() {
  return (
    <section id="features" className="mt-16 py-8">
      <h2 className="mb-8 text-center text-3xl font-bold">Features</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
              {feature.icon}
            </div>
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

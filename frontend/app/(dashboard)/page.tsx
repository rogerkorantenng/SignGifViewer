'use client';

import Link from 'next/link';
import { Languages, BookOpen, History, Flame, Trophy, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAnalyticsStore, useSessionStore } from '@/lib/store';

const quickActions = [
  {
    href: '/translate',
    label: 'Start Translating',
    description: 'Real-time sign language translation',
    icon: Languages,
    color: 'bg-blue-500',
  },
  {
    href: '/learn',
    label: 'Learn Signs',
    description: 'Visual step-by-step guides',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  {
    href: '/history',
    label: 'View History',
    description: 'Your recent activity',
    icon: History,
    color: 'bg-purple-500',
  },
];

export default function DashboardHome() {
  const { signsLearned, practiceMinutes, streakDays, points, activities } = useAnalyticsStore();
  const { session } = useSessionStore();

  const stats = [
    {
      label: 'Signs Learned',
      value: signsLearned,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Practice Time',
      value: `${practiceMinutes}m`,
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Day Streak',
      value: streakDays,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Total Points',
      value: points,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{action.label}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <History className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start translating or learning to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.type === 'translation' ? 'bg-blue-500/10 text-blue-500' :
                        activity.type === 'learning' ? 'bg-green-500/10 text-green-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {activity.type === 'translation' ? (
                          <Languages className="h-4 w-4" />
                        ) : activity.type === 'learning' ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <Target className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.text}</div>
                        {activity.details && (
                          <div className="text-xs text-muted-foreground">{activity.details}</div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-medium">Try real-time translation</div>
                  <div className="text-sm text-muted-foreground">
                    Use your camera to translate signs instantly
                  </div>
                </div>
                <Link href="/translate">
                  <Button size="sm">Start</Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-medium">Learn common signs</div>
                  <div className="text-sm text-muted-foreground">
                    Get step-by-step guides for signing words
                  </div>
                </div>
                <Link href="/learn">
                  <Button size="sm" variant="outline">Learn</Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-medium">Track your progress</div>
                  <div className="text-sm text-muted-foreground">
                    Review your learning history and stats
                  </div>
                </div>
                <Link href="/history">
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

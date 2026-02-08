'use client';

import { Languages, BookOpen, Target, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAnalyticsStore } from '@/lib/store';

export default function HistoryPage() {
  const { activities, clearActivities, signsLearned, practiceMinutes, points } = useAnalyticsStore();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = formatDate(activity.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof activities>);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'translation':
        return <Languages className="h-4 w-4" />;
      case 'learning':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'translation':
        return 'bg-blue-500/10 text-blue-500';
      case 'learning':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-purple-500/10 text-purple-500';
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="History" />

      <div className="p-6">
        {/* Summary Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{signsLearned}</div>
              <div className="text-sm text-muted-foreground">Total Signs Learned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{practiceMinutes}m</div>
              <div className="text-sm text-muted-foreground">Practice Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{points}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activity Timeline</CardTitle>
            {activities.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearActivities}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-semibold">No Activity Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start translating or learning signs to see your activity history here.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                  <div key={date}>
                    <div className="mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">{date}</span>
                    </div>
                    <div className="space-y-3 pl-6">
                      {dateActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 rounded-lg border p-4"
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{activity.text}</div>
                            {activity.details && (
                              <div className="text-sm text-muted-foreground">{activity.details}</div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatTime(activity.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

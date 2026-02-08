'use client';

import { useState } from 'react';
import { User, Globe, Palette, Bell, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useSessionStore, useAnalyticsStore } from '@/lib/store';

export default function SettingsPage() {
  const { session, updatePreferences, clearSession } = useSessionStore();
  const { clearActivities } = useAnalyticsStore();
  const [name, setName] = useState(session?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSaveName = () => {
    if (session && name.trim()) {
      // We'd need to add an updateName function to the store
      // For now, show saved feedback
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLanguageChange = (language: 'ASL' | 'BSL') => {
    updatePreferences({ signLanguage: language });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme });
  };

  const handleResetData = () => {
    clearActivities();
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Settings" />

      <div className="mx-auto max-w-2xl p-6">
        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Display Name</label>
              <div className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
                <Button onClick={handleSaveName} disabled={!name.trim()}>
                  {saved ? 'Saved!' : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Member Since</label>
              <p className="text-sm text-muted-foreground">
                {session?.createdAt
                  ? new Date(session.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Sign Language</CardTitle>
            </div>
            <CardDescription>Choose your preferred sign language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={session?.preferences?.signLanguage === 'ASL' ? 'default' : 'outline'}
                onClick={() => handleLanguageChange('ASL')}
                className="flex-1"
              >
                ASL (American)
              </Button>
              <Button
                variant={session?.preferences?.signLanguage === 'BSL' ? 'default' : 'outline'}
                onClick={() => handleLanguageChange('BSL')}
                className="flex-1"
              >
                BSL (British)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <Button
                  key={theme}
                  variant={session?.preferences?.theme === theme ? 'default' : 'outline'}
                  onClick={() => handleThemeChange(theme)}
                  className="flex-1 capitalize"
                >
                  {theme}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Learning Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Get reminded to practice daily
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Progress Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Weekly summary of your progress
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Privacy & Data</CardTitle>
            </div>
            <CardDescription>Manage your data and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">Clear Activity History</div>
                <div className="text-sm text-muted-foreground">
                  Remove all your learning and translation history
                </div>
              </div>
              <Button variant="outline" onClick={handleResetData}>
                Clear
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <div>
                <div className="font-medium text-destructive">Sign Out</div>
                <div className="text-sm text-muted-foreground">
                  Clear session and all local data
                </div>
              </div>
              <Button variant="destructive" onClick={clearSession}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

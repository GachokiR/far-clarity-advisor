import React from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Card } from '@/components/ui/card';
import QuickActions from '@/components/QuickActions';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h2>
        <p className="text-muted-foreground">What would you like to do today?</p>
      </Card>

      <QuickActions />
    </div>
  );
}
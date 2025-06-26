
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { FileText, BarChart3, Users, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrialLimitsIndicatorProps {
  variant?: 'compact' | 'full' | 'overlay' | 'banner';
  className?: string;
  onUpgrade?: () => void;
}

export const TrialLimitsIndicator = ({ 
  variant = 'full', 
  className,
  onUpgrade 
}: TrialLimitsIndicatorProps) => {
  const { profile, usage, loading, getUsagePercentage } = useUsageLimits();

  if (loading || !profile) {
    return null;
  }

  // Calculate days remaining in trial
  const trialEndDate = new Date(profile.trial_end_date);
  const currentDate = new Date();
  const daysRemaining = Math.ceil((trialEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.ceil((trialEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60));

  // Determine urgency state
  const getUrgencyState = () => {
    if (daysRemaining > 7) return 'safe';
    if (daysRemaining > 3) return 'warning';
    return 'urgent';
  };

  const urgencyState = getUrgencyState();

  // Get usage percentages
  const documentsPercentage = getUsagePercentage('documents');
  const analysesPercentage = getUsagePercentage('analyses');
  const teamPercentage = getUsagePercentage('team_members');

  const isNearLimit = (percentage: number) => percentage >= 80;
  const isAtLimit = (percentage: number) => percentage >= 100;

  // Countdown display
  const getCountdownDisplay = () => {
    if (daysRemaining > 0) {
      return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} remaining`;
    }
    return 'Trial expired';
  };

  // Usage stats data
  const usageStats = [
    {
      icon: FileText,
      label: 'Documents',
      current: usage.documents,
      limit: profile.usage_limits.max_documents,
      percentage: documentsPercentage,
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      label: 'Analyses',
      current: usage.analyses_this_month,
      limit: profile.usage_limits.max_analyses_per_month,
      percentage: analysesPercentage,
      color: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Team Members',
      current: usage.team_members,
      limit: profile.usage_limits.max_team_members,
      percentage: teamPercentage,
      color: 'text-purple-600'
    }
  ];

  // Compact variant for dashboard header
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center space-x-4 p-3 bg-white rounded-lg border shadow-sm", className)}>
        <div className="flex items-center space-x-2">
          <Clock className={cn("h-4 w-4", {
            'text-green-600': urgencyState === 'safe',
            'text-amber-500': urgencyState === 'warning',
            'text-red-600': urgencyState === 'urgent'
          })} />
          <span className="text-sm font-medium">{getCountdownDisplay()}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {usageStats.map((stat) => (
            <div key={stat.label} className="flex items-center space-x-1">
              <stat.icon className={cn("h-3 w-3", stat.color)} />
              <span className="text-xs text-gray-600">
                {stat.current}/{stat.limit === -1 ? '∞' : stat.limit}
              </span>
            </div>
          ))}
        </div>

        <Button 
          size="sm" 
          className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
          onClick={onUpgrade}
        >
          Upgrade
        </Button>
      </div>
    );
  }

  // Banner variant for top-of-page notifications
  if (variant === 'banner') {
    return (
      <div className={cn("w-full bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-gray-900">
                Trial: {getCountdownDisplay()}
              </p>
              <p className="text-sm text-gray-600">
                {usageStats.filter(stat => isNearLimit(stat.percentage)).length > 0 && 
                  "Some limits are approaching - upgrade to continue using all features"}
              </p>
            </div>
          </div>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
            onClick={onUpgrade}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  // Overlay variant for blocking actions
  if (variant === 'overlay') {
    return (
      <div className={cn("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", className)}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-xl">Limit Reached</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You've reached your trial limits. Upgrade to continue using all features.
            </p>
            <div className="space-y-2">
              {usageStats.filter(stat => isAtLimit(stat.percentage)).map((stat) => (
                <div key={stat.label} className="text-sm text-gray-700">
                  <stat.icon className={cn("inline h-4 w-4 mr-2", stat.color)} />
                  {stat.label}: {stat.current}/{stat.limit === -1 ? '∞' : stat.limit}
                </div>
              ))}
            </div>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
              onClick={onUpgrade}
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Full variant (default)
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className={cn("h-5 w-5", {
              'text-green-600': urgencyState === 'safe',
              'text-amber-500': urgencyState === 'warning',
              'text-red-600': urgencyState === 'urgent'
            })} />
            <span>Trial Status</span>
            <Badge variant={profile.subscription_tier === 'trial' ? 'secondary' : 'default'}>
              {profile.subscription_tier.toUpperCase()}
            </Badge>
          </CardTitle>
          <div className={cn("text-sm font-medium", {
            'text-green-600': urgencyState === 'safe',
            'text-amber-600': urgencyState === 'warning',
            'text-red-600': urgencyState === 'urgent'
          })}>
            {getCountdownDisplay()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {usageStats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <span className="text-sm font-medium">{stat.label}</span>
                {isNearLimit(stat.percentage) && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <span className="text-sm text-gray-600">
                {stat.current} / {stat.limit === -1 ? '∞' : stat.limit}
              </span>
            </div>
            {stat.limit !== -1 && (
              <Progress 
                value={stat.percentage} 
                className={cn("h-2 transition-all duration-300", {
                  '[&>div]:bg-red-500': isAtLimit(stat.percentage),
                  '[&>div]:bg-amber-500': isNearLimit(stat.percentage) && !isAtLimit(stat.percentage),
                  '[&>div]:bg-blue-500': !isNearLimit(stat.percentage)
                })}
              />
            )}
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
            onClick={onUpgrade}
          >
            Upgrade Now - Unlock Full Access
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Get unlimited access to all features
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

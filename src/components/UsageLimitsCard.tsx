
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { FileText, BarChart3, Users, AlertTriangle } from "lucide-react";

export const UsageLimitsCard = () => {
  const { profile, usage, loading, getUsagePercentage } = useUsageLimits();

  if (loading || !profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin h-6 w-6 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  const documentsPercentage = getUsagePercentage('documents');
  const analysesPercentage = getUsagePercentage('analyses');
  const teamPercentage = getUsagePercentage('team_members');

  const isNearLimit = (percentage: number) => percentage >= 80;
  const isOverLimit = (percentage: number) => percentage >= 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Usage Limits</span>
              <Badge variant={profile.subscription_tier === 'trial' ? 'secondary' : 'default'}>
                {profile.subscription_tier.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription>Current usage vs. your plan limits</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Documents Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Documents</span>
              {isNearLimit(documentsPercentage) && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <span className="text-sm text-gray-600">
              {usage.documents} / {profile.usage_limits.max_documents === -1 ? '∞' : profile.usage_limits.max_documents}
            </span>
          </div>
          {profile.usage_limits.max_documents !== -1 && (
            <Progress 
              value={documentsPercentage} 
              className={`h-2 ${isOverLimit(documentsPercentage) ? 'bg-red-100' : isNearLimit(documentsPercentage) ? 'bg-amber-100' : ''}`}
            />
          )}
        </div>

        {/* Analyses Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Monthly Analyses</span>
              {isNearLimit(analysesPercentage) && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <span className="text-sm text-gray-600">
              {usage.analyses_this_month} / {profile.usage_limits.max_analyses_per_month === -1 ? '∞' : profile.usage_limits.max_analyses_per_month}
            </span>
          </div>
          {profile.usage_limits.max_analyses_per_month !== -1 && (
            <Progress 
              value={analysesPercentage} 
              className={`h-2 ${isOverLimit(analysesPercentage) ? 'bg-red-100' : isNearLimit(analysesPercentage) ? 'bg-amber-100' : ''}`}
            />
          )}
        </div>

        {/* Team Members Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Team Members</span>
              {isNearLimit(teamPercentage) && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <span className="text-sm text-gray-600">
              {usage.team_members} / {profile.usage_limits.max_team_members === -1 ? '∞' : profile.usage_limits.max_team_members}
            </span>
          </div>
          {profile.usage_limits.max_team_members !== -1 && (
            <Progress 
              value={teamPercentage} 
              className={`h-2 ${isOverLimit(teamPercentage) ? 'bg-red-100' : isNearLimit(teamPercentage) ? 'bg-amber-100' : ''}`}
            />
          )}
        </div>

        {/* Upgrade prompt for trial users or those near limits */}
        {(profile.subscription_tier === 'trial' || 
          isNearLimit(documentsPercentage) || 
          isNearLimit(analysesPercentage) || 
          isNearLimit(teamPercentage)) && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Need more capacity?</p>
                <p className="text-xs text-gray-600">Upgrade your plan for higher limits</p>
              </div>
              <Button size="sm" variant="outline">
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

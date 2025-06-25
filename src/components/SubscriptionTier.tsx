
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, upgradeUserTier, isTrialExpired, type UserProfile } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Clock, Users, FileText, BarChart3, Zap } from "lucide-react";

export const SubscriptionTier = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialExpired, setTrialExpired] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [profileData, expired] = await Promise.all([
        getUserProfile(),
        isTrialExpired()
      ]);
      setProfile(profileData);
      setTrialExpired(expired);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newTier: 'basic' | 'professional' | 'enterprise') => {
    try {
      await upgradeUserTier(newTier);
      await fetchProfileData();
      toast({
        title: "Tier Upgraded",
        description: `Successfully upgraded to ${newTier} tier!`,
      });
    } catch (error) {
      console.error('Error upgrading tier:', error);
      toast({
        title: "Error",
        description: "Failed to upgrade subscription tier.",
        variant: "destructive"
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'trial': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'trial': return <Clock className="h-4 w-4" />;
      case 'basic': return <Zap className="h-4 w-4" />;
      case 'professional': return <BarChart3 className="h-4 w-4" />;
      case 'enterprise': return <Crown className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTrialDaysRemaining = () => {
    if (!profile) return 0;
    const endDate = new Date(profile.trial_end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTierIcon(profile.subscription_tier)}
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Current Plan</span>
                  <Badge className={getTierColor(profile.subscription_tier)}>
                    {profile.subscription_tier.toUpperCase()}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {profile.subscription_tier === 'trial' && (
                    <>
                      {trialExpired ? (
                        <span className="text-red-600">Trial expired</span>
                      ) : (
                        <span>{trialDaysRemaining} days remaining</span>
                      )}
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Documents</div>
                <div className="text-sm text-gray-600">
                  {profile.usage_limits.max_documents === -1 
                    ? 'Unlimited' 
                    : `${profile.usage_limits.max_documents} max`
                  }
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Monthly Analyses</div>
                <div className="text-sm text-gray-600">
                  {profile.usage_limits.max_analyses_per_month === -1 
                    ? 'Unlimited' 
                    : `${profile.usage_limits.max_analyses_per_month} max`
                  }
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium">Team Members</div>
                <div className="text-sm text-gray-600">
                  {profile.usage_limits.max_team_members === -1 
                    ? 'Unlimited' 
                    : `${profile.usage_limits.max_team_members} max`
                  }
                </div>
              </div>
            </div>
          </div>

          {profile.subscription_tier === 'trial' && trialExpired && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">Trial Expired</h4>
              <p className="text-sm text-red-700 mb-3">
                Your trial period has ended. Upgrade to continue using all features.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleUpgrade('basic')}>
                  Upgrade to Basic
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUpgrade('professional')}>
                  Upgrade to Professional
                </Button>
              </div>
            </div>
          )}

          {profile.subscription_tier === 'trial' && !trialExpired && trialDaysRemaining <= 3 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Trial Ending Soon</h4>
              <p className="text-sm text-amber-700 mb-3">
                Only {trialDaysRemaining} days left in your trial. Upgrade now to avoid interruption.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleUpgrade('basic')}>
                  Upgrade to Basic
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUpgrade('professional')}>
                  Upgrade to Professional
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {profile.subscription_tier !== 'enterprise' && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <CardDescription>Unlock more features and higher limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.subscription_tier !== 'basic' && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Basic</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• 50 documents</li>
                    <li>• 100 analyses/month</li>
                    <li>• 5 team members</li>
                  </ul>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUpgrade('basic')}
                  >
                    Upgrade to Basic
                  </Button>
                </div>
              )}
              
              {profile.subscription_tier !== 'professional' && (
                <div className="p-4 border rounded-lg border-purple-200 bg-purple-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Professional</h3>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• 500 documents</li>
                    <li>• 1,000 analyses/month</li>
                    <li>• 20 team members</li>
                  </ul>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUpgrade('professional')}
                  >
                    Upgrade to Professional
                  </Button>
                </div>
              )}
              
              <div className="p-4 border rounded-lg border-gold-200 bg-gold-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-5 w-5 text-gold-600" />
                  <h3 className="font-medium">Enterprise</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Unlimited documents</li>
                  <li>• Unlimited analyses</li>
                  <li>• Unlimited team members</li>
                </ul>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleUpgrade('enterprise')}
                >
                  Upgrade to Enterprise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

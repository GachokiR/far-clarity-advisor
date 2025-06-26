
import React, { useState } from 'react';
import { TrialLimitsIndicator } from './TrialLimitsIndicator';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { useToast } from '@/hooks/use-toast';

interface TrialLimitsWrapperProps {
  children: React.ReactNode;
  checkType?: 'documents' | 'analyses' | 'team_members';
  blockingMessage?: string;
  showLimitsBeforeAction?: boolean;
}

export const TrialLimitsWrapper = ({ 
  children, 
  checkType = 'documents',
  blockingMessage,
  showLimitsBeforeAction = true
}: TrialLimitsWrapperProps) => {
  const { 
    canUploadDocument, 
    canRunAnalysis, 
    canAddTeamMember, 
    hasReachedAnyLimit,
    isApproachingLimits 
  } = useUsageLimits();
  const { toast } = useToast();
  const [showOverlay, setShowOverlay] = useState(false);

  const canPerformAction = () => {
    switch (checkType) {
      case 'documents':
        return canUploadDocument();
      case 'analyses':
        return canRunAnalysis();
      case 'team_members':
        return canAddTeamMember();
      default:
        return true;
    }
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log('Upgrade clicked from wrapper');
    toast({
      title: "Upgrade Available",
      description: "Contact support to upgrade your plan and unlock unlimited access.",
    });
    setShowOverlay(false);
  };

  const handleActionAttempt = () => {
    if (!canPerformAction()) {
      setShowOverlay(true);
      toast({
        title: "Limit Reached",
        description: blockingMessage || `You've reached the limit for ${checkType}. Please upgrade to continue.`,
        variant: "destructive"
      });
      return;
    }
  };

  return (
    <div className="relative">
      {/* Show limits indicator if approaching limits */}
      {showLimitsBeforeAction && isApproachingLimits() && (
        <div className="mb-4">
          <TrialLimitsIndicator 
            variant="banner"
            onUpgrade={handleUpgrade}
          />
        </div>
      )}

      {/* Wrap children with click handler for limit checking */}
      <div onClick={handleActionAttempt}>
        {children}
      </div>

      {/* Show overlay when limits are reached */}
      {showOverlay && (
        <TrialLimitsIndicator 
          variant="overlay"
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
};

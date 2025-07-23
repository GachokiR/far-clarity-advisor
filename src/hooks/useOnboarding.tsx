
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

export interface OnboardingStep {
  id: string;
  title: string;
  completed: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const steps: OnboardingStep[] = [
    { id: 'welcome', title: 'Welcome', completed: false },
    { id: 'tour', title: 'Platform Tour', completed: false },
    { id: 'upload', title: 'First Document', completed: false },
    { id: 'analysis', title: 'Quick Win', completed: false }
  ];

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = () => {
    const onboardingData = localStorage.getItem(`onboarding_${user?.id}`);
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setIsOnboardingComplete(data.completed || false);
      setCurrentStep(data.currentStep || 0);
    } else {
      // First time user, show onboarding
      setShowOnboarding(true);
    }
  };

  const saveOnboardingProgress = (step: number, completed: boolean = false) => {
    const data = {
      currentStep: step,
      completed,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`onboarding_${user?.id}`, JSON.stringify(data));
    setCurrentStep(step);
    setIsOnboardingComplete(completed);
  };

  const nextStep = () => {
    const next = Math.min(currentStep + 1, steps.length - 1);
    if (next === steps.length - 1) {
      saveOnboardingProgress(next, true);
    } else {
      saveOnboardingProgress(next);
    }
  };

  const previousStep = () => {
    const prev = Math.max(currentStep - 1, 0);
    saveOnboardingProgress(prev);
  };

  const skipOnboarding = () => {
    saveOnboardingProgress(steps.length - 1, true);
    setShowOnboarding(false);
  };

  const restartOnboarding = () => {
    localStorage.removeItem(`onboarding_${user?.id}`);
    setCurrentStep(0);
    setIsOnboardingComplete(false);
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    saveOnboardingProgress(steps.length - 1, true);
    setShowOnboarding(false);
  };

  return {
    currentStep,
    steps,
    isOnboardingComplete,
    showOnboarding,
    setShowOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    restartOnboarding,
    completeOnboarding
  };
};

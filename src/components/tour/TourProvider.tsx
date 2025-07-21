import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  route: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to FAR Clarity Advisor',
    content: 'Let\'s take a quick tour of your compliance management platform.',
    target: '[data-tour="welcome"]',
    route: '/'
  },
  {
    id: 'documents',
    title: 'Document Management',
    content: 'Upload your government contracts here for analysis.',
    target: '[data-tour="documents"]',
    route: '/documents'
  },
  {
    id: 'compliance',
    title: 'Compliance Tracking',
    content: 'Track and manage all your compliance requirements in one place.',
    target: '[data-tour="compliance"]',
    route: '/compliance'
  }
];

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  restartTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Add escape key handler to close tour
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        endTour();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive]);

  useEffect(() => {
    // Check if user has completed tour
    const hasCompletedTour = localStorage.getItem('tour-completed');
    if (!hasCompletedTour && location.pathname === '/') {
      // Start tour for new users after a delay
      setTimeout(() => {
        startTour();
      }, 1500);
    }
  }, [location.pathname]);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    // Navigate to first step route if not already there
    if (location.pathname !== tourSteps[0].route) {
      navigate(tourSteps[0].route);
    }
  };

  const endTour = () => {
    setIsActive(false);
    localStorage.setItem('tour-completed', 'true');
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      // Navigate to next step route
      navigate(tourSteps[nextStepIndex].route);
    } else {
      endTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      // Navigate to previous step route
      navigate(tourSteps[prevStepIndex].route);
    }
  };

  const restartTour = () => {
    localStorage.removeItem('tour-completed');
    setCurrentStep(0);
    setIsActive(true);
    navigate(tourSteps[0].route);
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <TourContext.Provider value={{
      isActive,
      currentStep,
      startTour,
      endTour,
      nextStep,
      previousStep,
      restartTour
    }}>
      {children}
      {isActive && currentTourStep && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={endTour} />
          <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4 p-6 pointer-events-auto relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{currentTourStep.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={endTour}
                className="h-8 w-8 absolute top-2 right-2"
                title="Close tour (Esc)"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-6">{currentTourStep.content}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={endTour}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip Tour
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={nextStep}
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </TourContext.Provider>
  );
};
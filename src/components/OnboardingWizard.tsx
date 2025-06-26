
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { WelcomeStep } from "./onboarding/WelcomeStep";
import { TourStep } from "./onboarding/TourStep";
import { UploadStep } from "./onboarding/UploadStep";
import { AnalysisStep } from "./onboarding/AnalysisStep";

export const OnboardingWizard = () => {
  const {
    currentStep,
    steps,
    showOnboarding,
    setShowOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding
  } = useOnboarding();

  if (!showOnboarding) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <TourStep onNext={nextStep} onPrevious={previousStep} />;
      case 2:
        return <UploadStep onNext={nextStep} onPrevious={previousStep} />;
      case 3:
        return <AnalysisStep onComplete={completeOnboarding} onPrevious={previousStep} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOnboarding(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-gray-500">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className={`${
                    index <= currentStep ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="animate-fade-in">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="ghost"
              onClick={skipOnboarding}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip Tour
            </Button>
            
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={previousStep}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {currentStep < steps.length - 1 && (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

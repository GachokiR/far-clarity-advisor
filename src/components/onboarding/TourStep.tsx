
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Eye, Upload, BarChart3, FileText } from "lucide-react";

interface TourStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const TourStep = ({ onNext, onPrevious }: TourStepProps) => {
  const [runTour, setRunTour] = useState(false);
  const [tourComplete, setTourComplete] = useState(false);

  const steps: Step[] = [
    {
      target: '[data-tour="upload-area"]',
      content: 'Start by uploading your government contracts, RFPs, or solicitation documents here. We support PDF, DOC, and DOCX files.',
      title: 'Document Upload',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="analysis-tab"]',
      content: 'After uploading, view detailed FAR compliance analysis with identified clauses, requirements, and risk assessments.',
      title: 'FAR Analysis',
      placement: 'bottom',
    },
    {
      target: '[data-tour="dashboard-tab"]',
      content: 'Monitor your compliance status, track document history, and access key metrics from your central dashboard.',
      title: 'Compliance Dashboard',
      placement: 'bottom',
    },
    {
      target: '[data-tour="profile-tab"]',
      content: 'Manage your account settings, view usage limits, and track your trial progress here.',
      title: 'Profile & Settings',
      placement: 'bottom',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      setTourComplete(true);
    }
  };

  const startTour = () => {
    setRunTour(true);
  };

  const skipTour = () => {
    setTourComplete(true);
  };

  return (
    <div className="text-center space-y-6">
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#2563eb',
            textColor: '#374151',
            backgroundColor: 'white',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
          }
        }}
      />

      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
          <Eye className="h-10 w-10 text-purple-600" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Platform Tour
        </h3>
        <p className="text-lg text-gray-600">
          Let's explore the key features you'll use every day
        </p>
      </div>

      {!tourComplete ? (
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-8">
            We'll show you around with interactive highlights of the most important 
            features. This will help you navigate efficiently and get the most out of Far V.02.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Document Upload</h4>
                    <p className="text-sm text-gray-600">Upload and process files</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold">FAR Analysis</h4>
                    <p className="text-sm text-gray-600">AI-powered compliance review</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">Dashboard</h4>
                    <p className="text-sm text-gray-600">Central command center</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-orange-600" />
                  <div>
                    <h4 className="font-semibold">Reports</h4>
                    <p className="text-sm text-gray-600">Generate compliance reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button size="lg" onClick={startTour} className="bg-purple-600 hover:bg-purple-700">
              Start Interactive Tour
            </Button>
            <div>
              <Button variant="ghost" onClick={skipTour} className="text-gray-500">
                Skip Tour
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Tour Complete!</h4>
                <p className="text-sm text-green-600">
                  You now know where to find the key features. Let's upload your first document.
                </p>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
            Continue to Upload
          </Button>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const { user } = useAuth();

  // Get user's company from profile or email domain
  const getCompanyName = () => {
    if (user?.user_metadata?.company) {
      return user.user_metadata.company;
    }
    // Fallback to email domain
    if (user?.email) {
      const domain = user.email.split('@')[1];
      return domain.split('.')[0];
    }
    return 'your organization';
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="h-10 w-10 text-blue-600" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Far V.02, {getCompanyName()}!
        </h3>
        <p className="text-lg text-gray-600">
          Let's get you set up in just 3 minutes
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600 mb-8">
          We'll walk you through the key features that will help you streamline 
          FAR compliance, analyze government contracts, and generate reports with confidence.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Platform Tour</h4>
              <p className="text-sm text-gray-600">
                Discover key features and navigation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">First Upload</h4>
              <p className="text-sm text-gray-600">
                Upload your first document for analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Quick Win</h4>
              <p className="text-sm text-gray-600">
                Get your first compliance analysis
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
          <Clock className="h-4 w-4" />
          <span>Estimated time: 3 minutes</span>
        </div>

        <Button size="lg" onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Let's Get Started
        </Button>
      </div>
    </div>
  );
};


import { CheckCircle, Shield, Users, Zap } from "lucide-react";

export const TrialHeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-teal-600 text-white py-12 px-6 rounded-t-lg">
      <div className="max-w-md mx-auto text-center">
        <Shield className="h-16 w-16 mx-auto mb-6 text-blue-100" />
        <h1 className="text-3xl font-bold mb-4">
          Start Your 14-Day Free Trial
        </h1>
        <p className="text-blue-100 mb-8 text-lg">
          Transform your FAR compliance process with AI-powered analysis
        </p>
        
        <div className="grid gap-4 text-left">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
            <span className="text-blue-50">Analyze up to 5 documents</span>
          </div>
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-green-300 flex-shrink-0" />
            <span className="text-blue-50">10 AI-powered compliance analyses</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-green-300 flex-shrink-0" />
            <span className="text-blue-50">Complete FAR clause library access</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-blue-100">
            <strong>No credit card required</strong> • Cancel anytime • Upgrade seamlessly
          </p>
        </div>
      </div>
    </div>
  );
};

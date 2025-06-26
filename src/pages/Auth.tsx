
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AuthHeader } from "@/components/AuthHeader";
import { AuthForm } from "@/components/AuthForm";
import { AuthToggle } from "@/components/AuthToggle";
import { TrialHeroSection } from "@/components/TrialHeroSection";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 overflow-hidden">
          {!isLogin && <TrialHeroSection />}
          
          <AuthHeader isLogin={isLogin} />
          
          <CardContent className="p-6 pt-0">
            <AuthForm isLogin={isLogin} />

            <div className="mt-6 text-center">
              <AuthToggle 
                isLogin={isLogin} 
                onToggle={() => setIsLogin(!isLogin)} 
              />
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-6 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

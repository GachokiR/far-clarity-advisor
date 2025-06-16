
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AuthHeader } from "@/components/AuthHeader";
import { AuthForm } from "@/components/AuthForm";
import { AuthToggle } from "@/components/AuthToggle";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <AuthHeader isLogin={isLogin} />
        <CardContent>
          <AuthForm isLogin={isLogin} />

          <div className="mt-4 text-center">
            <AuthToggle 
              isLogin={isLogin} 
              onToggle={() => setIsLogin(!isLogin)} 
            />
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-600 hover:text-gray-800 text-sm">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;


import { Shield } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <Shield className="h-12 w-12 text-blue-600" />
      </div>
      <CardTitle className="text-2xl">
        {isLogin ? "Sign In" : "Sign Up"}
      </CardTitle>
      <CardDescription>
        {isLogin 
          ? "Welcome back to Far V.02" 
          : "Create your Far V.02 account"
        }
      </CardDescription>
    </CardHeader>
  );
};

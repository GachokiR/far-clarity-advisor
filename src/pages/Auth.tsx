
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword } from "@/utils/inputValidation";
import { authRateLimiter } from "@/utils/rateLimiting";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Rate limiting check
    const rateLimitKey = `auth_${email}`;
    if (!authRateLimiter.isAllowed(rateLimitKey)) {
      const resetTime = authRateLimiter.getResetTime(rateLimitKey);
      const resetDate = new Date(resetTime).toLocaleTimeString();
      setError(`Too many attempts. Try again after ${resetDate}`);
      setLoading(false);
      return;
    }

    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.errors.join(', '));
      setLoading(false);
      return;
    }

    if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors.join(', '));
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signIn(emailValidation.sanitizedValue, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        await signUp(emailValidation.sanitizedValue, password);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      navigate("/");
    } catch (err: any) {
      // Don't expose detailed error messages
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (err.message.includes('User already registered')) {
        setError('An account with this email already exists');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isLogin ? 1 : 8}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              
              {!isLogin && <PasswordStrengthIndicator password={password} showRequirements />}
            </div>
            
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
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

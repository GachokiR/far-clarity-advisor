
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword } from "@/utils/inputValidation";
import { authRateLimiter } from "@/utils/rateLimiting";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { logAuthAttempt } from "@/utils/securityLogger";
import { sanitizeError } from "@/utils/errorSanitizer";
import { logger } from "@/utils/productionLogger";
import { EnhancedSignupForm, SignupFormData } from "@/components/EnhancedSignupForm";


interface AuthFormProps {
  isLogin: boolean;
}

export const AuthForm = ({ isLogin }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      const result = await signIn(emailValidation.sanitizedValue, password);
      
      if (result.error) {
        logAuthAttempt(emailValidation.sanitizedValue, false, { error: result.error.message });
        logger.error('Authentication failed', { email: emailValidation.sanitizedValue, error: result.error.message }, 'AuthForm');
        setError(result.error.message);
      } else {
        logAuthAttempt(emailValidation.sanitizedValue, true);
        logger.info('User signed in successfully', { email: emailValidation.sanitizedValue }, 'AuthForm');
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate("/");
      }
    } catch (err: any) {
      const sanitizedError = sanitizeError(err);
      setError(sanitizedError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (formData: SignupFormData) => {
    setLoading(true);
    setError("");

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        role: formData.role,
        company_size: formData.companySize,
        primary_agency: formData.primaryAgency,
        referral_source: formData.referralSource
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.error) {
        logAuthAttempt(formData.email, false, { error: result.error.message });
        logger.error('Signup failed', { email: formData.email, error: result.error.message }, 'AuthForm');
        setError(result.error.message);
      } else {
        logAuthAttempt(formData.email, true);
        logger.info('User signed up successfully', { email: formData.email }, 'AuthForm');
        
        toast({
          title: "Welcome to Far V.02! 🎉",
          description: "Your 14-day free trial has started. Please check your email to verify your account.",
        });
        navigate("/");
      }
    } catch (err: any) {
      const sanitizedError = sanitizeError(err);
      setError(sanitizedError.message);
    } finally {
      setLoading(false);
    }
  };


  if (isLogin) {
    return (
      <div>
        <form onSubmit={handleLogin} className="space-y-4">
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
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

      </div>
    );
  }

  return <EnhancedSignupForm onSubmit={handleSignup} loading={loading} error={error} />;
};

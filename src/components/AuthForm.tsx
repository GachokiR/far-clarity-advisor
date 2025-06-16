
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword } from "@/utils/inputValidation";
import { authRateLimiter } from "@/utils/rateLimiting";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { logAuthAttempt } from "@/utils/securityLogger";
import { sanitizeError } from "@/utils/errorSanitizer";
import { logger } from "@/utils/productionLogger";

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
        logAuthAttempt(emailValidation.sanitizedValue, true);
        logger.info('User signed in successfully', { email: emailValidation.sanitizedValue }, 'AuthForm');
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        await signUp(emailValidation.sanitizedValue, password);
        logAuthAttempt(emailValidation.sanitizedValue, true);
        logger.info('User signed up successfully', { email: emailValidation.sanitizedValue }, 'AuthForm');
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      navigate("/");
    } catch (err: any) {
      logAuthAttempt(emailValidation.sanitizedValue, false, { error: err.message });
      logger.error('Authentication failed', { email: emailValidation.sanitizedValue, error: err.message }, 'AuthForm');
      
      const sanitizedError = sanitizeError(err);
      setError(sanitizedError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

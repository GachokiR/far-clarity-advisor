
import { Progress } from "@/components/ui/progress";
import { validatePassword } from "@/utils/inputValidation";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthIndicator = ({ 
  password, 
  showRequirements = false 
}: PasswordStrengthIndicatorProps) => {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
    
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number): string => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const strength = calculateStrength(password);
  const validation = validatePassword(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Password strength:</span>
        <span className={`text-sm font-medium ${
          strength < 30 ? 'text-red-600' :
          strength < 60 ? 'text-yellow-600' :
          strength < 80 ? 'text-blue-600' :
          'text-green-600'
        }`}>
          {getStrengthText(strength)}
        </span>
      </div>
      
      <div className="relative">
        <Progress value={strength} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
          style={{ width: `${strength}%` }}
        />
      </div>

      {showRequirements && !validation.isValid && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

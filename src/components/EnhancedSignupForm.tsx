
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { validateEmail, validatePassword } from "@/utils/inputValidation";

interface EnhancedSignupFormProps {
  onSubmit: (formData: SignupFormData) => Promise<void>;
  loading: boolean;
  error: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  companySize: string;
  primaryAgency: string;
  referralSource: string;
}

export const EnhancedSignupForm = ({ onSubmit, loading, error }: EnhancedSignupFormProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    company: "",
    role: "",
    companySize: "",
    primaryAgency: "",
    referralSource: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors[0];
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    // Required field validation
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.company.trim()) errors.company = "Company name is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    if (!formData.companySize) errors.companySize = "Company size is required";
    if (!formData.primaryAgency.trim()) errors.primaryAgency = "Primary agency is required";
    if (!formData.referralSource) errors.referralSource = "Please tell us how you heard about us";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const updateField = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={validationErrors.firstName ? "border-red-500" : ""}
            />
            {validationErrors.firstName && (
              <p className="text-sm text-red-600">{validationErrors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={validationErrors.lastName ? "border-red-500" : ""}
            />
            {validationErrors.lastName && (
              <p className="text-sm text-red-600">{validationErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={validationErrors.email ? "border-red-500" : ""}
          />
          {validationErrors.email && (
            <p className="text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            className={validationErrors.password ? "border-red-500" : ""}
          />
          {validationErrors.password && (
            <p className="text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company Name *</Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => updateField("company", e.target.value)}
            className={validationErrors.company ? "border-red-500" : ""}
          />
          {validationErrors.company && (
            <p className="text-sm text-red-600">{validationErrors.company}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Your Role *</Label>
          <Input
            id="role"
            type="text"
            placeholder="e.g., Contracts Manager, Compliance Officer"
            value={formData.role}
            onChange={(e) => updateField("role", e.target.value)}
            className={validationErrors.role ? "border-red-500" : ""}
          />
          {validationErrors.role && (
            <p className="text-sm text-red-600">{validationErrors.role}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size *</Label>
          <Select value={formData.companySize} onValueChange={(value) => updateField("companySize", value)}>
            <SelectTrigger className={validationErrors.companySize ? "border-red-500" : ""}>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="200+">200+ employees</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.companySize && (
            <p className="text-sm text-red-600">{validationErrors.companySize}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryAgency">Primary Contracting Agency *</Label>
          <Input
            id="primaryAgency"
            type="text"
            placeholder="e.g., DoD, GSA, VA, DHS"
            value={formData.primaryAgency}
            onChange={(e) => updateField("primaryAgency", e.target.value)}
            className={validationErrors.primaryAgency ? "border-red-500" : ""}
          />
          {validationErrors.primaryAgency && (
            <p className="text-sm text-red-600">{validationErrors.primaryAgency}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralSource">How did you hear about us? *</Label>
          <Select value={formData.referralSource} onValueChange={(value) => updateField("referralSource", value)}>
            <SelectTrigger className={validationErrors.referralSource ? "border-red-500" : ""}>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="search">Search Engine</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="conference">Conference/Event</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.referralSource && (
            <p className="text-sm text-red-600">{validationErrors.referralSource}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors" 
        disabled={loading}
      >
        {loading ? "Creating Your Account..." : "Start Free Trial"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

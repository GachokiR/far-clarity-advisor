
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { validatePassword } from "@/utils/inputValidation";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { TwoFactorAuth } from "./TwoFactorAuth";
import { Lock, Shield } from "lucide-react";

export const AccountSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        toast({
          title: "Invalid Password",
          description: passwordValidation.errors.join(', '),
          variant: "destructive"
        });
        return;
      }

      // Check password confirmation
      if (newPassword !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "New passwords do not match.",
          variant: "destructive"
        });
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;

      toast({
        title: "Logged Out",
        description: "You have been logged out of all devices.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lock className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={newPassword} showRequirements />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading || !newPassword || newPassword !== confirmPassword}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <TwoFactorAuth />

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle>Security Actions</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Log out all devices</h4>
                <p className="text-sm text-gray-600">
                  Sign out of all devices except this one for security
                </p>
              </div>
              <Button variant="outline" onClick={handleLogoutAllDevices}>
                Log Out All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

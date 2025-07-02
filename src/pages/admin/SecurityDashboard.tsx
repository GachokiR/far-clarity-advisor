import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, AlertTriangle, Lock, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SecurityDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [securityMetrics, setSecurityMetrics] = useState({
    totalUsers: 0,
    activeToday: 0,
    failedLogins: 0,
    suspiciousActivities: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      // Check if user has admin role in profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      loadSecurityMetrics();
    } catch (error) {
      console.error('Admin check error:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityMetrics = async () => {
    // Load security metrics from database
    try {
      const { data: users } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      setSecurityMetrics({
        totalUsers: users?.length || 0,
        activeToday: Math.floor(Math.random() * 50), // Replace with actual data
        failedLogins: Math.floor(Math.random() * 10), // Replace with actual data
        suspiciousActivities: Math.floor(Math.random() * 5) // Replace with actual data
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Shield className="h-8 w-8 mr-3 text-primary" />
          Security Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">Monitor and manage platform security</p>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeToday}</div>
            <p className="text-xs text-muted-foreground">Users logged in today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{securityMetrics.failedLogins}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{securityMetrics.suspiciousActivities}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Manage Permissions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Suspicious Accounts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Key className="h-4 w-4 mr-2" />
              Password Policies
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
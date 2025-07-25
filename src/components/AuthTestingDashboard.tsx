import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, RefreshCw, User, Shield, Database } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase, checkAuth, getCurrentUser, getSession, diagnosePossibleAuthIssues } from '@/lib/supabase';
import { rbacService } from '@/utils/rbacService';
import { useToast } from '@/hooks/use-toast';

export const AuthTestingDashboard = () => {
  const { user, session, isAuthenticated, signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  
  // Test states
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error' | 'info'>>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [authDiagnosis, setAuthDiagnosis] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  const updateTestResult = (testName: string, result: 'pending' | 'success' | 'error' | 'info') => {
    setTestResults(prev => ({ ...prev, [testName]: result }));
  };

  // Test 1: Enhanced Signup Flow
  const testSignup = async () => {
    updateTestResult('signup', 'pending');
    addLog('Testing signup flow...');
    addLog(`Using credentials: ${testEmail}`);
    addLog(`Redirect URL will be: ${window.location.origin}/`);
    
    try {
      const result = await signUp(testEmail, testPassword);
      
      if (result.error) {
        updateTestResult('signup', 'error');
        addLog(`Signup failed: ${result.error.message}`);
        addLog(`Error code: ${result.error.status || 'unknown'}`);
        
        // Handle specific error cases
        if (result.error.message.includes('already registered')) {
          addLog('User already exists - this might be expected if testing repeatedly');
          addLog('Try using a different email or delete the existing user');
        } else if (result.error.message.includes('email confirmation')) {
          addLog('Email confirmation required - check your email or disable confirmation in Supabase');
        } else if (result.error.message.includes('password')) {
          addLog('Password issue - ensure it meets minimum requirements');
        }
      } else {
        updateTestResult('signup', 'success');
        addLog('Signup successful');
        addLog(`User created: ${!!result.data?.user}`);
        addLog(`Session created: ${!!result.data?.session}`);
        addLog(`User email: ${result.data?.user?.email}`);
        
        if (result.data?.user && !result.data?.session) {
          addLog('User created but no session - email confirmation may be required');
          addLog('Check your email for a confirmation link');
        }
        
        if (result.data?.user?.email_confirmed_at) {
          addLog('Email already confirmed');
        } else {
          addLog('Email confirmation pending');
        }
      }
    } catch (error: any) {
      updateTestResult('signup', 'error');
      addLog(`Signup exception: ${error.message}`);
      addLog(`Error details: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const testLogin = async () => {
    updateTestResult('login', 'pending');
    addLog('Testing login flow...');
    try {
      const result = await signIn(testEmail, testPassword);
      if (result.error) {
        updateTestResult('login', 'error');
        addLog(`Login failed: ${result.error.message}`);
      } else {
        updateTestResult('login', 'success');
        addLog('Login successful');
      }
    } catch (error) {
      updateTestResult('login', 'error');
      addLog(`Login error: ${error}`);
    }
  };

  const testLogout = async () => {
    updateTestResult('logout', 'pending');
    addLog('Testing logout flow...');
    try {
      const result = await signOut();
      if (result.error) {
        updateTestResult('logout', 'error');
        addLog(`Logout failed: ${result.error.message}`);
      } else {
        updateTestResult('logout', 'success');
        addLog('Logout successful');
      }
    } catch (error) {
      updateTestResult('logout', 'error');
      addLog(`Logout error: ${error}`);
    }
  };

  // Test 2: Session Persistence
  const testSessionPersistence = async () => {
    updateTestResult('persistence', 'pending');
    addLog('Testing session persistence...');
    try {
      const authCheck = await checkAuth();
      const currentUser = await getCurrentUser();
      const sessionData = await getSession();
      
      if (authCheck && currentUser && sessionData) {
        updateTestResult('persistence', 'success');
        addLog('Session persistence working correctly');
      } else {
        updateTestResult('persistence', 'error');
        addLog(`Session persistence issues: auth=${authCheck}, user=${!!currentUser}, session=${!!sessionData}`);
      }
    } catch (error) {
      updateTestResult('persistence', 'error');
      addLog(`Session persistence error: ${error}`);
    }
  };

  // Test 3: Permission System
  const testPermissions = async () => {
    updateTestResult('permissions', 'pending');
    addLog('Testing permission system...');
    try {
      if (user) {
        const hasAnalysisPermission = await rbacService.hasPermission(user.id, 'read:analytics');
        const userRole = await rbacService.getUserRole(user.id);
        const isAdmin = await rbacService.isAdmin(user.id);
        
        updateTestResult('permissions', 'success');
        addLog(`Permissions: analysis=${hasAnalysisPermission}, role=${userRole?.role}, admin=${isAdmin}`);
      } else {
        updateTestResult('permissions', 'info');
        addLog('No user logged in for permission testing');
      }
    } catch (error) {
      updateTestResult('permissions', 'error');
      addLog(`Permission error: ${error}`);
    }
  };

  // Test 4: Enhanced Database Connectivity
  const testDatabaseConnection = async () => {
    updateTestResult('database', 'pending');
    addLog('Testing database connection...');
    
    try {
      // Test basic connectivity with a simple auth check
      addLog('Testing basic Supabase connection...');
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError && authError.message !== 'Auth user not found') {
        addLog(`Auth service error: ${authError.message}`);
      } else {
        addLog('Basic Supabase connection successful');
      }

      // Test profiles table access
      addLog('Testing profiles table access...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      if (profileError) {
        addLog(`Profiles table error: ${profileError.message} (Code: ${profileError.code})`);
      } else {
        addLog('Profiles table accessible');
      }

      // Test user_roles table access specifically
      addLog('Testing user_roles table access...');
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .limit(1);
        
      if (rolesError) {
        addLog(`User roles table error: ${rolesError.message} (Code: ${rolesError.code})`);
        if (rolesError.message.includes('row-level security')) {
          addLog('RLS policy may be blocking access to user_roles table');
          addLog('This is expected if no user is logged in or user has no roles');
        }
        if (rolesError.code === '42P01') {
          addLog('Table does not exist - check database schema');
        }
      } else {
        addLog('User roles table accessible');
        addLog(`Found ${rolesData?.length || 0} role records`);
      }

      // Test with current user context if logged in
      if (user) {
        addLog(`Testing with current user context: ${user.id}`);
        const { data: userRoles, error: userRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (userRoleError) {
          addLog(`User-specific role query failed: ${userRoleError.message}`);
        } else {
          addLog(`User has ${userRoles?.length || 0} roles assigned`);
        }
      }

      // Overall assessment
      if (!profileError && !rolesError) {
        updateTestResult('database', 'success');
        addLog('All database connections successful');
      } else if (!profileError) {
        updateTestResult('database', 'info');
        addLog('Basic database works but user_roles has access restrictions');
      } else {
        updateTestResult('database', 'error');
        addLog('Database connection issues detected');
      }
    } catch (error: any) {
      updateTestResult('database', 'error');
      addLog(`Database connection exception: ${error.message}`);
      addLog(`Stack trace: ${error.stack}`);
    }
  };

  // Test 5: Auth Diagnosis
  const runAuthDiagnosis = async () => {
    addLog('Running auth diagnosis...');
    try {
      const issues = await diagnosePossibleAuthIssues();
      setAuthDiagnosis(issues);
      addLog(`Diagnosis completed: ${issues.length} items found`);
    } catch (error) {
      addLog(`Diagnosis error: ${error}`);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    addLog('Starting comprehensive auth testing...');
    
    await testSessionPersistence();
    await testPermissions();
    await testDatabaseConnection();
    await runAuthDiagnosis();
    
    setLoading(false);
    addLog('All tests completed');
    toast({
      title: "Testing Complete",
      description: "All authentication tests have been executed. Check the results below."
    });
  };

  const TestResultBadge = ({ test }: { test: string }) => {
    const result = testResults[test];
    const icon = {
      pending: <Clock className="h-3 w-3" />,
      success: <CheckCircle className="h-3 w-3" />,
      error: <XCircle className="h-3 w-3" />,
      info: <Clock className="h-3 w-3" />
    };
    
    const variant = {
      pending: 'secondary' as const,
      success: 'default' as const,
      error: 'destructive' as const,
      info: 'outline' as const
    };

    return (
      <Badge variant={variant[result] || 'secondary'} className="flex items-center gap-1">
        {icon[result] || icon.pending}
        {result || 'Not Run'}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Authentication Testing Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive testing and debugging for authentication flows</p>
        </div>
      </div>

      {/* Current Auth Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label>Authenticated</Label>
              <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <Label>User ID</Label>
              <p className="text-xs font-mono text-muted-foreground">{user?.id?.slice(0, 8) || 'None'}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email || 'None'}</p>
            </div>
            <div>
              <Label>Session</Label>
              <Badge variant={session ? 'default' : 'destructive'}>
                {session ? 'Active' : 'None'}
              </Badge>
            </div>
            <div>
              <Label>Email Confirmed</Label>
              <Badge variant={user?.email_confirmed_at ? 'default' : 'secondary'}>
                {user?.email_confirmed_at ? 'Yes' : user ? 'Pending' : 'N/A'}
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <Label>Environment Info</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <p>URL: {window.location.href}</p>
              <p>Origin: {window.location.origin}</p>
              <p>Supabase URL: https://qbrncgvscyyvatdgfidt.supabase.co</p>
              <p>Auth Flow: PKCE</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="testing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="testing" className="space-y-4">
          {/* Test Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Test Credentials</CardTitle>
              <CardDescription>Configure credentials for testing auth flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Test Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Test Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="password123"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auth Flow Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Flow Tests</CardTitle>
              <CardDescription>Test basic authentication operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Signup Test</span>
                    <TestResultBadge test="signup" />
                  </div>
                  <Button onClick={testSignup} variant="outline" className="w-full">
                    Test Signup
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Login Test</span>
                    <TestResultBadge test="login" />
                  </div>
                  <Button onClick={testLogin} variant="outline" className="w-full">
                    Test Login
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Logout Test</span>
                    <TestResultBadge test="logout" />
                  </div>
                  <Button onClick={testLogout} variant="outline" className="w-full">
                    Test Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Tests */}
          <Card>
            <CardHeader>
              <CardTitle>System Tests</CardTitle>
              <CardDescription>Test system integration and functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Session Persistence</span>
                    <TestResultBadge test="persistence" />
                  </div>
                  <Button onClick={testSessionPersistence} variant="outline" className="w-full">
                    Test Persistence
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Permissions</span>
                    <TestResultBadge test="permissions" />
                  </div>
                  <Button onClick={testPermissions} variant="outline" className="w-full">
                    Test Permissions
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <TestResultBadge test="database" />
                  </div>
                  <Button onClick={testDatabaseConnection} variant="outline" className="w-full">
                    Test Database
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={runAllTests} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    'Run All Tests'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Authentication Diagnosis
              </CardTitle>
              <CardDescription>Automated analysis of potential auth issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runAuthDiagnosis} variant="outline">
                Run Diagnosis
              </Button>
              
              {authDiagnosis.length > 0 && (
                <div className="space-y-2">
                  {authDiagnosis.map((issue, index) => (
                    <Alert key={index}>
                      <AlertDescription>{issue}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Logs</CardTitle>
              <CardDescription>Real-time logs from testing operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">No logs yet. Run some tests to see logs here.</p>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono text-muted-foreground">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
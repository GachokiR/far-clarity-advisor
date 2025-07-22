import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Clock, 
  FileText, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Shield, 
  Activity,
  User,
  Upload
} from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  activeTrials: number;
  documentsProcessed: number;
  systemHealth: 'good' | 'warning' | 'error';
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');
  
  // Mock system stats - replace with actual API call
  const systemStats: SystemStats = {
    totalUsers: 1247,
    activeTrials: 89,
    documentsProcessed: 156,
    systemHealth: 'good'
  };

  // Determine user status - using mock data for now
  const isAdmin = false; // TODO: Implement role checking
  const isTrialUser = true; // Mock - assume trial user for demo
  const isTrialExpired = false; // Mock data
  const isPaidUser = false; // Mock data
  
  // Mock user data for display
  const userData = {
    documentsUsed: 3,
    documentsLimit: 5,
    reportsUsed: 2,
    reportsLimit: 10,
    usersCount: 1,
    usersLimit: 1,
    initials: user?.email?.charAt(0)?.toUpperCase() || 'U',
    name: user?.email?.split('@')[0] || 'User'
  };

  const AdminBanner = () => (
    <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{systemStats.totalUsers} Total Users</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>{systemStats.activeTrials} Active Trials</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{systemStats.documentsProcessed} Docs Today</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/analytics')}
          >
            System Analytics
          </Button>
        </div>
      </div>
      
      {/* Admin View Toggle */}
      <div className="flex items-center space-x-2">
        <Button 
          variant={viewMode === 'admin' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('admin')}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin View
        </Button>
        <Button 
          variant={viewMode === 'user' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('user')}
        >
          <User className="w-4 h-4 mr-2" />
          User View
        </Button>
      </div>
    </div>
  );

  const TrialBanner = () => (
    <div className="bg-orange-500/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-orange-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-foreground font-medium">
              {isTrialExpired ? 'Trial expired' : 'Trial active'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{userData.documentsUsed}/{userData.documentsLimit}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span>{userData.reportsUsed}/{userData.reportsLimit}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{userData.usersCount}/{userData.usersLimit}</span>
          </div>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
          onClick={() => navigate('/upgrade')}
        >
          Upgrade
        </Button>
      </div>
    </div>
  );

  const ProBanner = () => (
    <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-foreground font-medium">Pro Account Active</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>Unlimited Documents</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span>Advanced Analytics</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Team Collaboration</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          onClick={() => navigate('/settings/billing')}
        >
          Manage Plan
        </Button>
      </div>
    </div>
  );

  const WelcomeBanner = () => (
    <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-foreground font-medium">Welcome! Ready to get started?</span>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          onClick={() => navigate('/trial')}
        >
          Start Free Trial
        </Button>
      </div>
    </div>
  );

  const renderBanner = () => {
    if (isAdmin && viewMode === 'admin') return <AdminBanner />;
    if (isTrialUser) return <TrialBanner />;
    if (isPaidUser) return <ProBanner />;
    return <WelcomeBanner />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Home className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">FAR Clarity Advisor</h1>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
          {userData.initials}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-4xl font-bold mb-2">
          <span className="text-primary">Welcome to </span>
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Compliance Pro
          </span>
        </h2>
        <p className="text-muted-foreground text-lg mb-6">FAR Compliance Management Platform</p>

        {/* Conditional Banner */}
        {renderBanner()}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Analysis Card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">Document Analysis</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Upload and analyze documents for FAR compliance
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
              onClick={() => navigate('/documents/upload')}
            >
              Upload Documents
            </Button>
          </div>

          {/* Compliance Analytics Card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">Compliance Analytics</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              View detailed compliance reports and metrics
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

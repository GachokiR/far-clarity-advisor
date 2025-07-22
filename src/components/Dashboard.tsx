
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
  Upload,
  Brain,
  CheckSquare,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');
  
  // Mock system stats
  const systemStats = {
    totalUsers: 1247,
    activeTrials: 89,
    documentsProcessed: 156,
    systemHealth: 'good' as const
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

  // Dashboard cards data
  const dashboardCards = [
    {
      id: 'document-analysis',
      title: 'Document Analysis',
      description: 'Upload and analyze documents for FAR compliance',
      icon: Upload,
      buttonText: 'Upload Documents',
      buttonAction: () => navigate('/documents/upload'),
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'compliance-analytics',
      title: 'Compliance Analytics',
      description: 'View detailed compliance reports and metrics',
      icon: BarChart3,
      buttonText: 'View Analytics',
      buttonAction: () => navigate('/analytics'),
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'compliance-checklists',
      title: 'Compliance Checklists',
      description: 'Track your compliance requirements and progress',
      icon: CheckSquare,
      buttonText: 'View Checklists',
      buttonAction: () => navigate('/checklists'),
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 'ai-recommendations',
      title: 'AI Recommendations',
      description: 'Get intelligent recommendations for compliance improvements',
      icon: Brain,
      buttonText: 'Get Recommendations',
      buttonAction: () => navigate('/recommendations'),
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'security-center',
      title: 'Security Center',
      description: 'Advanced security monitoring and threat detection',
      icon: Shield,
      buttonText: 'Security Dashboard',
      buttonAction: () => navigate('/security'),
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      buttonText: 'Manage Users',
      buttonAction: () => navigate('/users'),
      gradient: 'from-indigo-500 to-purple-600',
      adminOnly: true
    }
  ];

  // Filter cards based on user role
  const visibleCards = dashboardCards.filter(card => 
    !card.adminOnly || (card.adminOnly && isAdmin)
  );

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderBanner = () => {
    if (isAdmin && viewMode === 'admin') {
      return (
        <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Admin Dashboard</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{systemStats.totalUsers} Total Users</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span>{systemStats.activeTrials} Active Trials</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
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
    }

    if (isTrialUser) {
      return (
        <div className="bg-orange-500/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-foreground font-medium">
                  {isTrialExpired ? 'Trial expired' : 'Trial active'}
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{userData.documentsUsed}/{userData.documentsLimit}</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span>{userData.reportsUsed}/{userData.reportsLimit}</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
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
    }

    if (isPaidUser) {
      return (
        <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-foreground font-medium">Pro Account Active</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Unlimited Documents</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span>Advanced Analytics</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
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
    }

    return (
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Home className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">FAR Clarity Advisor</h1>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            {userData.initials}
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-card-foreground hover:bg-accent flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-card-foreground hover:bg-accent flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  navigate('/help');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-card-foreground hover:bg-accent flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </button>
              <hr className="border-border my-2" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-destructive hover:bg-accent flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
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

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleCards.map((card) => {
            const IconComponent = card.icon;
            
            return (
              <div 
                key={card.id}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-accent-foreground/20 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold text-card-foreground">{card.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {card.description}
                </p>
                <Button 
                  className={`w-full bg-gradient-to-r ${card.gradient} text-white hover:opacity-90 transition-opacity`}
                  onClick={card.buttonAction}
                >
                  {card.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
};

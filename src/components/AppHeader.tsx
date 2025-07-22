
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { rbacService } from '@/utils/rbacService';
import { Home, Menu, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const AppHeader = () => {
  const { user } = useAuth();
  const { isDemoUser } = useDemoAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIfAdmin();
  }, [user]);

  const checkIfAdmin = async () => {
    if (!user) return;
    
    try {
      const adminStatus = await rbacService.isAdmin(user.id);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const navItems = [
    { path: '/documents', label: 'Documents' },
    { path: '/documents/upload', label: 'Upload' },
    { path: '/compliance', label: 'Compliance' },
    { path: '/checklists', label: 'Checklists' },
    { path: '/analytics', label: 'Analytics' },
    ...(isAdmin ? [{ path: '/admin/security', label: 'Security' }] : [])
  ];

  const handleLogoClick = () => {
    if (user || isDemoUser) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                FAR Clarity Advisor
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user || isDemoUser ? (
              <UserMenu />
            ) : (
              <>
                {/* Always visible auth buttons on mobile and desktop */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-foreground hover:text-primary"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

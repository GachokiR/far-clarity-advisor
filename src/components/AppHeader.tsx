
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
    { path: '/compliance', label: 'Compliance' },
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

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

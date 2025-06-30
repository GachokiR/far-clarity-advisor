
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { Home, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppHeader = () => {
  const { user } = useAuth();
  const { isDemoUser } = useDemoAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Compliance Pro
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/analysis" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Analysis
            </Link>
            <Link 
              to="/security" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Security
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

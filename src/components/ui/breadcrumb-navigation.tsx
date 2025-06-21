
import { ChevronRight, Home, ArrowLeft, LayoutDashboard, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showDashboardButton?: boolean;
  showSecurityButton?: boolean;
  onTabChange?: (tab: string) => void;
  currentPath?: string;
  securityContext?: boolean;
}

export const BreadcrumbNavigation = ({ 
  items, 
  showBackButton = true, 
  showHomeButton = true,
  showDashboardButton = false,
  showSecurityButton = false,
  onTabChange,
  currentPath = "/",
  securityContext = false
}: BreadcrumbNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  const handleDashboardClick = () => {
    if (securityContext && onTabChange) {
      // If we're in security context, go to security dashboard tab
      onTabChange('dashboard');
    } else {
      // Otherwise go to main dashboard
      navigate('/');
    }
  };

  return (
    <div className={`${isMobile ? 'flex flex-col space-y-3 mb-4' : 'flex items-center space-x-4 mb-6'}`}>
      <div className={`${isMobile ? 'flex flex-wrap gap-2' : 'flex items-center space-x-2'}`}>
        {showBackButton && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            onClick={() => navigate(-1)}
            className={`${isMobile ? 'text-xs px-2 py-1' : ''} flex items-center space-x-1`}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Back</span>
          </Button>
        )}
        
        {showDashboardButton && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            onClick={handleDashboardClick}
            className={`${isMobile ? 'text-xs px-2 py-1' : ''} flex items-center space-x-1`}
          >
            <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? 'hidden sm:inline' : 'inline'}>
              {securityContext ? 'Security Dashboard' : 'Dashboard'}
            </span>
            {isMobile && <span className="sm:hidden">Dash</span>}
          </Button>
        )}

        {showSecurityButton && currentPath !== '/security' && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            asChild
          >
            <Link to="/security" className={`${isMobile ? 'text-xs px-2 py-1' : ''} flex items-center space-x-1`}>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Security</span>
            </Link>
          </Button>
        )}
        
        {showHomeButton && !securityContext && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            asChild
          >
            <Link to="/" className={`${isMobile ? 'text-xs px-2 py-1' : ''} flex items-center space-x-1`}>
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Home</span>
            </Link>
          </Button>
        )}

        {securityContext && location.pathname === '/security' && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            asChild
          >
            <Link to="/" className={`${isMobile ? 'text-xs px-2 py-1' : ''} flex items-center space-x-1`}>
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Main Dashboard</span>
              {isMobile && <span className="sm:hidden">Main</span>}
            </Link>
          </Button>
        )}
      </div>

      <Breadcrumb className={isMobile ? 'overflow-x-auto' : ''}>
        <BreadcrumbList className={isMobile ? 'flex-nowrap' : ''}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {(item.href || item.onClick) && index < items.length - 1 ? (
                  <BreadcrumbLink 
                    className={`${isMobile ? 'text-xs' : ''} cursor-pointer hover:text-foreground whitespace-nowrap`}
                    onClick={() => handleBreadcrumbClick(item)}
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className={`${isMobile ? 'text-xs' : ''} whitespace-nowrap`}>
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

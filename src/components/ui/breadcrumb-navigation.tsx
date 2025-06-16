
import { ChevronRight, Home, ArrowLeft, LayoutDashboard, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
}

export const BreadcrumbNavigation = ({ 
  items, 
  showBackButton = true, 
  showHomeButton = true,
  showDashboardButton = false,
  showSecurityButton = false,
  onTabChange,
  currentPath = "/"
}: BreadcrumbNavigationProps) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        )}
        
        {showDashboardButton && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center space-x-1">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
        )}

        {showSecurityButton && currentPath !== '/security' && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/security" className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </Link>
          </Button>
        )}
        
        {showHomeButton && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
        )}
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {(item.href || item.onClick) && index < items.length - 1 ? (
                  <BreadcrumbLink 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleBreadcrumbClick(item)}
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

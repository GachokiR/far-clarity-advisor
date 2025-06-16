
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
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
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export const BreadcrumbNavigation = ({ 
  items, 
  showBackButton = true, 
  showHomeButton = true 
}: BreadcrumbNavigationProps) => {
  const navigate = useNavigate();

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
                {item.href && index < items.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
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

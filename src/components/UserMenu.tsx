
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { useTour } from '@/components/tour/TourProvider';
import { User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { debug } from '@/utils/debug';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { restartTour } = useTour();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Debug logging
  console.log('UserMenu - user:', user);
  console.log('UserMenu - restartTour available:', typeof restartTour);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    debug.auth('User logout initiated');
    
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Logout Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out."
        });
      }
    } catch (error) {
      debug.error('Logout error', error, 'AUTH');
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.email || 'User';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={restartTour}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Restart Tour</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


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
import { useAuth } from '@/hooks/useAuth';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { User, LogOut, Settings, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { debug } from '@/utils/debug';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { isDemoUser } = useDemoAuth();
  const { endDemo, formattedTimeRemaining } = useDemoMode();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    debug.auth('User logout initiated');
    
    try {
      if (isDemoUser) {
        await endDemo();
      } else {
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
    if (isDemoUser) return 'Demo User';
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
            {isDemoUser && formattedTimeRemaining && (
              <div className="flex items-center space-x-1 text-xs text-amber-600">
                <TestTube className="h-3 w-3" />
                <span>Demo: {formattedTimeRemaining}</span>
              </div>
            )}
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

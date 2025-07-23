
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import Dashboard from "@/components/Dashboard";
import { DemoBanner } from "@/components/DemoBanner";
import { AppHeader } from "@/components/AppHeader";
import { Loader2 } from "lucide-react";
import { debug } from "@/utils/debug";

const Index = () => {
  debug.log('Index page rendering');
  
  const { user, loading: authLoading } = useAuth();
  const { isDemoUser, demoSession } = useDemoAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  debug.log('Index state:', { 
    user: user?.email, 
    authLoading, 
    isDemoUser, 
    demoSession: !!demoSession 
  });

  useEffect(() => {
    debug.log('Index useEffect running');
    
    const checkAuth = async () => {
      debug.log('Checking auth state...');
      
      if (authLoading) {
        debug.log('Auth still loading, waiting...');
        return;
      }

      // Handle demo mode
      if (isDemoUser && demoSession) {
        debug.log('Demo user detected, setting up demo profile');
        setUserProfile({
          id: demoSession.userId,
          company: "Time Defense Solutions",
          is_demo_user: true,
          demo_session_expires_at: demoSession.expiresAt
        });
        setLoading(false);
        return;
      }

      // Handle regular authenticated users
      if (user) {
        debug.log('Regular user detected, fetching profile for:', user.email);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            debug.error('Error fetching profile:', error);
          } else {
            debug.log('Profile fetched successfully:', profile);
            setUserProfile(profile);
          }
        } catch (error) {
          debug.error('Profile fetch exception:', error);
        }
        setLoading(false);
        return;
      }

      // No user and not in demo mode - redirect to landing page
      debug.log('No user found, redirecting to landing page');
      navigate("/");
    };

    checkAuth();
  }, [user, authLoading, navigate, isDemoUser, demoSession]);

  if (loading || authLoading) {
    debug.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  debug.log('Rendering main content', { isDemoUser, hasDemoSession: !!demoSession });
  
  return (
    <>
      {isDemoUser && <DemoBanner />}
      <Dashboard />
    </>
  );
};

export default Index;

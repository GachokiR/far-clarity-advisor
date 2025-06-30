
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { Dashboard } from "@/components/Dashboard";
import { DemoBanner } from "@/components/DemoBanner";
import { Loader2 } from "lucide-react";

const Index = () => {
  console.log('Index page rendering');
  
  const { user, loading: authLoading } = useAuth();
  const { isDemoUser, demoSession } = useDemoAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log('Index state:', { 
    user: user?.email, 
    authLoading, 
    isDemoUser, 
    demoSession: !!demoSession 
  });

  useEffect(() => {
    console.log('Index useEffect running');
    
    const checkAuth = async () => {
      console.log('Checking auth state...');
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      // Handle demo mode
      if (isDemoUser && demoSession) {
        console.log('Demo user detected, setting up demo profile');
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
        console.log('Regular user detected, fetching profile for:', user.email);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            console.log('Profile fetched successfully:', profile);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Profile fetch exception:', error);
        }
        setLoading(false);
        return;
      }

      // No user and not in demo mode - redirect to auth
      console.log('No user found, redirecting to auth');
      navigate("/auth");
    };

    checkAuth();
  }, [user, authLoading, navigate, isDemoUser, demoSession]);

  if (loading || authLoading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main content');
  return (
    <div className="min-h-screen bg-gray-50">
      {isDemoUser && <DemoBanner />}
      <div className="container mx-auto px-4 py-8">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;

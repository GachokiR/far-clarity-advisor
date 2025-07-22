import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoAuthProvider } from "@/hooks/useDemoAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { TourProvider } from "@/components/tour/TourProvider";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Index";
import Auth from "./pages/Auth";
import { SecurityDashboard } from "./pages/admin/SecurityDashboard";
import Analysis from "./pages/Analysis";
import Documents from "./pages/Documents";
import DocumentUpload from "./pages/DocumentUpload";
import Compliance from "./pages/Compliance";
import Checklists from "./pages/Checklists";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        console.log('Query retry attempt:', failureCount, error);
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});

console.log('App component initializing...');

const App = () => {
  console.log('Rendering App component');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DemoAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ConnectionStatus />
              <BrowserRouter>
                <TourProvider>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/documents/upload" element={<DocumentUpload />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/compliance" element={<Compliance />} />
                    <Route path="/checklists" element={<Checklists />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/admin/security" element={<SecurityDashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TourProvider>
              </BrowserRouter>
            </TooltipProvider>
          </DemoAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

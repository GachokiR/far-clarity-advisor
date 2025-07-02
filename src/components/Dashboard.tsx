import { useState } from "react";
import { TrialLimitsIndicator } from "@/components/TrialLimitsIndicator";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { NavigationTestRunner } from "@/components/NavigationTestRunner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFeatureCards } from "@/components/dashboard/DashboardFeatureCards";
import { DashboardActivityStatus } from "@/components/dashboard/DashboardActivityStatus";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useToast } from "@/hooks/use-toast";
import { debug } from "@/utils/debug";

export const Dashboard = () => {
  const { restartOnboarding } = useOnboarding();
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showTestRunner, setShowTestRunner] = useState(false);

  const handleUpgrade = () => {
    debug.log('Upgrade button clicked');
    toast({
      title: "Upgrade Feature",
      description: "Upgrade functionality will be available soon.",
    });
  };

  const handleRestartTour = () => {
    debug.log('Restart tour button clicked');
    try {
      restartOnboarding();
      toast({
        title: "Tour Restarted",
        description: "The onboarding tour has been restarted.",
      });
    } catch (error) {
      debug.error('Error restarting tour', error);
      toast({
        title: "Tour Error",
        description: "Unable to restart the tour. Please refresh the page and try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadDocuments = () => {
    debug.log('Upload documents button clicked');
    setIsUploadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        onRestartTour={handleRestartTour}
        onToggleTestRunner={() => setShowTestRunner(!showTestRunner)}
      />

      {/* Trial Limits Indicator - Compact variant for header */}
      <TrialLimitsIndicator 
        variant="compact" 
        onUpgrade={handleUpgrade}
        className="mb-6"
      />
      
      <DashboardFeatureCards onUploadDocuments={handleUploadDocuments} />

      <DashboardActivityStatus />

      {/* Navigation Test Runner */}
      {showTestRunner && (
        <NavigationTestRunner onClose={() => setShowTestRunner(false)} />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

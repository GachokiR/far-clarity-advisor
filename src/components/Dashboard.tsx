import { useState } from "react";
import { TrialLimitsIndicator } from "@/components/TrialLimitsIndicator";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFeatureCards } from "@/components/dashboard/DashboardFeatureCards";
import { DashboardActivityStatus } from "@/components/dashboard/DashboardActivityStatus";
import { useToast } from "@/hooks/use-toast";
import { debug } from "@/utils/debug";

export const Dashboard = () => {
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUpgrade = () => {
    debug.log('Upgrade button clicked');
    toast({
      title: "Upgrade Feature",
      description: "Upgrade functionality will be available soon.",
    });
  };


  const handleUploadDocuments = () => {
    debug.log('Upload documents button clicked');
    setIsUploadModalOpen(true);
  };

  return (
    <div className="space-y-6" data-tour="welcome">
      <DashboardHeader />

      {/* Trial Limits Indicator - Compact variant for header */}
      <TrialLimitsIndicator 
        variant="compact" 
        onUpgrade={handleUpgrade}
        className="mb-6"
      />
      
      <DashboardFeatureCards onUploadDocuments={handleUploadDocuments} />

      <DashboardActivityStatus />

      {/* Document Upload Modal */}
      <DocumentUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

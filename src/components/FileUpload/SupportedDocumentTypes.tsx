
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const SupportedDocumentTypes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported Document Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-md">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="font-medium">Solicitations</div>
            <div className="text-sm text-gray-600">RFPs, RFQs, IFBs</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-md">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium">Contracts</div>
            <div className="text-sm text-gray-600">Awards, Modifications</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-md">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="font-medium">Proposals</div>
            <div className="text-sm text-gray-600">Bids, Technical Proposals</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

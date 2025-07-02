import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardActivityStatus = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest compliance and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="text-sm">
                <p className="font-medium">Document analysis completed</p>
                <p className="text-muted-foreground">Contract_v2.pdf - 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="text-sm">
                <p className="font-medium">Security scan initiated</p>
                <p className="text-muted-foreground">Automated security check - 15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="text-sm">
                <p className="font-medium">Compliance alert</p>
                <p className="text-muted-foreground">FAR 52.219-14 review needed - 1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Security Status</span>
              <span className="text-sm text-green-600 font-medium">Secure</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Compliance Score</span>
              <span className="text-sm text-blue-600 font-medium">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Threats</span>
              <span className="text-sm text-green-600 font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">System Uptime</span>
              <span className="text-sm text-green-600 font-medium">99.9%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
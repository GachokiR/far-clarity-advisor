
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, DollarSign, Clock, FileText } from "lucide-react";

export const ComplianceAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClause, setSelectedClause] = useState(null);

  const farClauses = [
    {
      id: "52.219-14",
      title: "Limitations on Subcontracting",
      description: "Requires prime contractors to perform a minimum percentage of work with their own employees.",
      risk: "High",
      cost: "$5,000-$15,000",
      timeframe: "2-4 weeks",
      requirements: [
        "Develop subcontracting plan",
        "Track percentage of work performed",
        "Maintain documentation",
        "Submit quarterly reports"
      ]
    },
    {
      id: "52.204-10",
      title: "Reporting Executive Compensation",
      description: "Requires disclosure of executive compensation information.",
      risk: "Medium",
      cost: "$2,500-$5,000",
      timeframe: "1-2 weeks",
      requirements: [
        "Gather executive compensation data",
        "Complete SAM.gov registration",
        "Submit annual reports",
        "Maintain records"
      ]
    },
    {
      id: "52.222-50",
      title: "Combating Trafficking in Persons",
      description: "Prohibits trafficking in persons and requires compliance plan.",
      risk: "Low",
      cost: "$1,000-$3,000",
      timeframe: "3-7 days",
      requirements: [
        "Develop compliance plan",
        "Train employees",
        "Establish reporting procedures",
        "Monitor subcontractors"
      ]
    }
  ];

  const filteredClauses = farClauses.filter(clause =>
    clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clause.id.includes(searchQuery)
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>FAR Clause Database</CardTitle>
          <CardDescription>Search and analyze specific FAR clauses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="search">Search FAR Clauses</Label>
              <Input
                id="search"
                placeholder="Enter FAR clause number (e.g., 52.219-14) or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="mt-6">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clause List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClauses.map((clause) => (
          <Card key={clause.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">FAR {clause.id}</CardTitle>
                  <CardDescription className="font-medium">{clause.title}</CardDescription>
                </div>
                <Badge className={getRiskColor(clause.risk)}>{clause.risk} Risk</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{clause.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Est. Cost</div>
                    <div className="text-sm text-gray-600">{clause.cost}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Timeframe</div>
                    <div className="text-sm text-gray-600">{clause.timeframe}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Requirements:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {clause.requirements.slice(0, 2).map((req, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Full Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Compliance Tools</CardTitle>
          <CardDescription>Common compliance tasks and checklists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Generate Checklist
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Risk Assessment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Cost Estimator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

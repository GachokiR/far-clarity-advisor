
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function Checklists() {

  const checklists = [
    {
      id: 1,
      title: "FAR Part 9 - Contractor Qualifications",
      description: "Verify contractor responsibility and capability requirements",
      status: "completed",
      progress: 100,
      items: [
        { id: 1, text: "Financial capacity verification", completed: true },
        { id: 2, text: "Technical capability assessment", completed: true },
        { id: 3, text: "Past performance review", completed: true },
      ]
    },
    {
      id: 2,
      title: "FAR Part 15 - Contracting by Negotiation",
      description: "Ensure compliance with negotiation procedures",
      status: "in-progress",
      progress: 60,
      items: [
        { id: 1, text: "Proposal evaluation criteria", completed: true },
        { id: 2, text: "Competitive range determination", completed: true },
        { id: 3, text: "Discussions and negotiations", completed: false },
        { id: 4, text: "Final proposal revisions", completed: false },
      ]
    },
    {
      id: 3,
      title: "FAR Part 52 - Solicitation Provisions",
      description: "Review required contract clauses and provisions",
      status: "pending",
      progress: 0,
      items: [
        { id: 1, text: "Required clauses identification", completed: false },
        { id: 2, text: "Optional clauses review", completed: false },
        { id: 3, text: "Clause applicability verification", completed: false },
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Checklists</h1>
          <p className="text-muted-foreground">
            Track your progress through FAR compliance requirements
          </p>
        </div>

        <div className="grid gap-6">
          {checklists.map((checklist) => (
            <Card key={checklist.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(checklist.status)}
                    <div>
                      <CardTitle className="text-lg">{checklist.title}</CardTitle>
                      <CardDescription>{checklist.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(checklist.status)}>
                    {checklist.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{checklist.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${checklist.progress}%` }}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox 
                          checked={item.completed}
                          disabled
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}

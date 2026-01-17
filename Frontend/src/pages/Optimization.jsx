import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const recommendations = [
  {
    id: "1",
    title: "Redistribute Marketing Tasks",
    description:
      "3 team members are underutilized. Redistribute 12 tasks from overloaded members.",
    impact: "High",
    savings: "15 hours/week",
    status: "pending",
  },
  {
    id: "2",
    title: "Skill Gap Training",
    description:
      "5 employees need React training to improve frontend task allocation.",
    impact: "Medium",
    savings: "20% faster delivery",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Team Rebalancing",
    description:
      "Engineering team has 30% higher workload. Consider hiring or reallocation.",
    impact: "High",
    savings: "Prevent burnout",
    status: "pending",
  },
  {
    id: "4",
    title: "Automation Opportunity",
    description:
      "12 hours/week spent on manual data entry. Consider automation tools.",
    impact: "Medium",
    savings: "12 hours/week",
    status: "completed",
  },
];

const impactColors = {
  High: "destructive",
  Medium: "secondary",
  Low: "secondary",
};

const statusColors = {
  pending: "secondary",
  "in-progress": "secondary",
  completed: "secondary",
};

export default function Optimization() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">AI Workforce Optimization</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered recommendations to optimize your workforce
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">73%</div>
            <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potential Time Savings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">27h</div>
            <p className="text-xs text-muted-foreground mt-1">Per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recommendations</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {recommendations.filter((r) => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        {recommendations.map((rec) => (
          <Card key={rec.id} data-testid={`card-recommendation-${rec.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{rec.title}</h3>
                    <Badge variant={impactColors[rec.impact]}>
                      {rec.impact} Impact
                    </Badge>
                    <Badge variant={statusColors[rec.status]}>
                      {rec.status === "in-progress"
                        ? "In Progress"
                        : rec.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-medium">Savings: {rec.savings}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {rec.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => console.log("Dismiss", rec.id)}
                        data-testid={`button-dismiss-${rec.id}`}
                      >
                        Dismiss
                      </Button>
                      <Button
                        onClick={() => console.log("Implement", rec.id)}
                        data-testid={`button-implement-${rec.id}`}
                      >
                        Implement
                      </Button>
                    </>
                  )}
                  {rec.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

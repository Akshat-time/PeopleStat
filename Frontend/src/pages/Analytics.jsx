import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Activity,
  AlertTriangle,
  Building2,
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { WorkDistributionChart } from "@/components/WorkDistributionChart";
import { ProductivityChart } from "@/components/ProductivityChart";
import { FitmentScoreChart } from "@/components/FitmentScoreChart";

export default function Analytics() {
  const { data: employeeStats = {} } = useQuery({
    queryKey: ["/api/employees/stats"],
    refetchInterval: 5000,
  });

  const stats = employeeStats.stats || {
    totalEmployees: 0,
    avgProductivity: 0,
    avgUtilization: 0,
    highPerformers: 0,
  };

  const employees = employeeStats.employees || [];

  const departmentCount = useMemo(() => {
    return new Set(employees.map(e => e.department).filter(Boolean)).size;
  }, [employees]);

  const productivityHealth =
    stats.avgProductivity >= 80 ? "Good" :
    stats.avgProductivity >= 60 ? "Moderate" : "At Risk";

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-extrabold">Analytics</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Deep workforce insights, trends, and performance analysis
        </p>
      </div>

      {/* KPI SNAPSHOT */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPI title="Total Employees" value={stats.totalEmployees} icon={Users} />
        <KPI title="Avg Productivity" value={`${stats.avgProductivity}%`} icon={TrendingUp} />
        <KPI title="Avg Utilization" value={`${stats.avgUtilization}%`} icon={Activity} />
        <KPI title="Departments Active" value={departmentCount} icon={Building2} />
      </div>

      {/* INSIGHT SUMMARY */}
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Analytical Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Insight
            label="Productivity Health"
            value={productivityHealth}
            variant={productivityHealth === "Good" ? "success" : "destructive"}
          />
          <Insight
            label="High Performers Identified"
            value={`${stats.highPerformers} employees`}
          />
          <Insight
            label="Operational Risk"
            value={
              stats.avgUtilization < 60
                ? "Underutilization detected"
                : "Utilization within normal range"
            }
          />
        </CardContent>
      </Card>

      {/* OPERATIONAL ANALYTICS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Work Distribution Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkDistributionChart />
            <p className="text-xs text-muted-foreground mt-2">
              Shows completed, pending, and overdue tasks across time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductivityChart />
            <p className="text-xs text-muted-foreground mt-2">
              Tracks workforce productivity over recent periods.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TALENT ANALYTICS */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Fitment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <FitmentScoreChart />
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
            <Badge variant="outline">Excellent (90–100)</Badge>
            <Badge variant="outline">Good (75–89)</Badge>
            <Badge variant="outline">Needs Training (&lt;75)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* INTERPRETATION */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>What This Means</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Productivity trends help identify burnout or inefficiencies.</p>
          <p>• Fitment analysis highlights training vs hiring needs.</p>
          <p>• Work distribution reveals operational bottlenecks.</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function KPI({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Insight({ label, value, variant }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <Badge variant={variant || "secondary"}>{value}</Badge>
    </div>
  );
}
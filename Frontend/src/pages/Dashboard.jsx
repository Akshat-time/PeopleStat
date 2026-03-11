import { useWorkforceData } from "@/contexts/WorkforceContext";
import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  Users,
  Brain,
  Activity,
  Zap,
  AlertTriangle,
  Grid,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { getWorkforceKPIs, getDepartmentDistributions, getAISignals } from "@/lib/workforce-utils";

const COLORS = ["#3b82f6", "#93c5fd", "#e5e7eb", "#1d4ed8", "#60a5fa"];

export default function Dashboard() {
  const { employees, getOverallRisk, getFitmentBand, getFatigueRisk } = useWorkforceData();
  if (!employees) return <div>Loading workforce data...</div>;

  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedMetric, setSelectedMetric] = useState(null);

  const go = (path) => navigate(path);

  const kpis = useMemo(() => getWorkforceKPIs(employees), [employees]);
  const deptDist = useMemo(() => getDepartmentDistributions(employees), [employees]);
  const aiSignals = useMemo(() => getAISignals(employees), [employees]);

  const derivedData = useMemo(() => {
    return {
      workforce: {
        value: kpis.totalEmployees,
        topImpacted: employees.slice(0, 3).map(emp => emp.name),
        action: "Review hiring needs in understaffed departments"
      },
      fitment: {
        value: kpis.avgFitment + "%",
        topImpacted: [...employees].sort((a, b) => a.scores.fitment - b.scores.fitment).slice(0, 3).map(emp => emp.name),
        action: "Implement targeted training programs"
      },
      burnout: {
        value: kpis.burnoutRisk + "%",
        topImpacted: employees.filter(emp => emp.scores.fatigue >= 75).slice(0, 3).map(emp => emp.name),
        action: "Schedule wellness interventions"
      },
      automation: {
        value: "$" + kpis.automationSavings,
        topImpacted: [...employees].sort((a, b) => b.scores.automationPotential - a.scores.automationPotential).slice(0, 3).map(emp => emp.name),
        action: "Prioritize RPA implementation"
      }
    };
  }, [kpis]);

  // Derived chart data
  const fitmentPie = useMemo(() => [
    { name: "Fit/Overfit", value: employees.filter(e => e.scores.fitment >= 70).length },
    { name: "Train-to-Fit", value: employees.filter(e => e.scores.fitment >= 50 && e.scores.fitment < 70).length },
    { name: "Unfit", value: employees.filter(e => e.scores.fitment < 50).length },
  ], []);

  const fatiguePie = useMemo(() => [
    { name: "Low", value: employees.filter(e => e.scores.fatigue < 50).length },
    { name: "Medium", value: employees.filter(e => e.scores.fatigue >= 50 && e.scores.fatigue < 75).length },
    { name: "High", value: employees.filter(e => e.scores.fatigue >= 75).length },
  ], []);

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Workforce Intelligence Command Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Live organizational health, risk & optimization intelligence
        </p>
      </div>

      {/* HERO STRIP */}
      <div className="grid md:grid-cols-4 gap-6">
        <Hero title="Workforce" value={derivedData.workforce.value} icon={Users} onClick={() => go("/employees")} />
        <Hero title="Fitment Index" value={derivedData.fitment.value} icon={Brain} onClick={() => go("/fitment")} />
        <Hero title="Burnout Risk" value={derivedData.burnout.value} icon={AlertTriangle} onClick={() => go("/fatigue")} />
        <Hero title="Automation" value={derivedData.automation.value} icon={Zap} onClick={() => go("/workforce-intelligence")} />
      </div>

      {/* VISUAL INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <InsightCard title="Fitment Health" onClick={() => go("/fitment")}>
          <PieBlock data={fitmentPie} />
        </InsightCard>

        <InsightCard title="Fatigue Risk" onClick={() => go("/fatigue")}>
          <PieBlock data={fatiguePie} />
        </InsightCard>

        <InsightCard title="Automation Potential" onClick={() => go("/workforce-intelligence")}>
          <div className="flex items-center justify-center h-[220px]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground uppercase">Potential Savings</p>
              <p className="text-5xl font-bold text-blue-600">{"$" + kpis.automationSavings}</p>
              <p className="text-xs text-muted-foreground mt-2">Annualized Opportunity</p>
            </div>
          </div>
        </InsightCard>

        <InsightCard title="Department Distribution (Fitment)" onClick={() => go("/employees")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptDist}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fitment" fill="#3b82f6" name="Avg Fitment %" />
            </BarChart>
          </ResponsiveContainer>
        </InsightCard>

        <InsightCard title="Utilization by Dept" onClick={() => go("/employees")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptDist}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#93c5fd" name="Avg Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </InsightCard>

        <InsightCard title="6×6 Workforce Matrix" onClick={() => go("/six-by-six")}>
          <div className="grid grid-cols-3 gap-3">
            {["Critical", "High", "Medium", "Stable", "Strong", "Elite"].map(x => (
              <div
                key={x}
                onClick={(e) => {
                  e.stopPropagation();
                  go(`/six-by-six?level=${x}`);
                }}
                className="p-4 rounded-lg bg-blue-50 text-center text-sm font-semibold hover:bg-blue-100"
              >
                {x}
              </div>
            ))}
          </div>
        </InsightCard>

      </div>

      {/* AI SIGNALS */}
      <Card>
        <CardHeader>
          <CardTitle>AI Workforce Signals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSignals.length > 0 ? aiSignals.map((sig, i) => (
            <Signal key={i} onClick={() => go(sig.path)}>{sig.message}</Signal>
          )) : (
            <p className="text-sm text-muted-foreground italic">No critical signals detected today.</p>
          )}
        </CardContent>
      </Card>

      {/* METRIC DETAIL MODAL */}
      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMetric === 'workforce' && 'Workforce Overview'}
              {selectedMetric === 'fitment' && 'Fitment Index Details'}
              {selectedMetric === 'burnout' && 'Burnout Risk Analysis'}
              {selectedMetric === 'automation' && 'Automation Potential'}
            </DialogTitle>
          </DialogHeader>
          {selectedMetric && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedMetric === 'workforce' && 'This metric represents the total number of employees in the organization.'}
                {selectedMetric === 'fitment' && 'Fitment Index measures how well employees are matched to their roles based on skills and performance.'}
                {selectedMetric === 'burnout' && 'Burnout Risk indicates the percentage of employees showing high fatigue levels.'}
                {selectedMetric === 'automation' && 'Automation Potential shows estimated annual savings from automating repetitive tasks.'}
              </p>
              <div>
                <h4 className="font-semibold mb-2">Top 3 Impacted Employees:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {derivedData[selectedMetric].topImpacted.map((name, i) => (
                    <li key={i} className="text-sm">{name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suggested Action:</h4>
                <p className="text-sm">{derivedData[selectedMetric].action}</p>
              </div>
              <Button onClick={() => {
                setSelectedMetric(null);
                if (selectedMetric === 'workforce') go('/employees');
                if (selectedMetric === 'fitment') go('/fitment');
                if (selectedMetric === 'burnout') go('/fatigue');
                if (selectedMetric === 'automation') go('/workforce-intelligence');
              }}>
                View Details
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ===== UI Blocks ===== */

function Hero({ title, value, icon: Icon, onClick }) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-blue-600" />
      </CardContent>
    </Card>
  );
}

function InsightCard({ title, children, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition border-blue-100"
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
          <Grid className="h-4 w-4 text-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PieBlock({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={45} outerRadius={80}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Signal({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between cursor-pointer hover:bg-muted p-3 rounded-lg border border-transparent hover:border-blue-100 transition-all"
    >
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-100 text-blue-800 border-none">AI INSIGHT</Badge>
        <p className="text-sm font-medium">{children}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

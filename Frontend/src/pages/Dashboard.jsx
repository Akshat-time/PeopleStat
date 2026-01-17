import React from "react";
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

/* ================== INTELLIGENCE DATA ================== */
const fitmentData = [
  { name: "Strong", value: 58 },
  { name: "Moderate", value: 32 },
  { name: "Weak", value: 10 },
];

const fatigueData = [
  { name: "Low", value: 60 },
  { name: "Medium", value: 25 },
  { name: "High", value: 15 },
];

const skillData = [
  { name: "Strong", value: 48 },
  { name: "Developing", value: 37 },
  { name: "Weak", value: 15 },
];

const gapData = [
  { dept: "Engineering", gap: 420000 },
  { dept: "Sales", gap: 310000 },
  { dept: "Marketing", gap: 260000 },
];

const automationData = [
  { name: "Automatable", value: 22 },
  { name: "Manual", value: 78 },
];

const COLORS = ["#3b82f6", "#93c5fd", "#e5e7eb"];

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const go = (path) => navigate(path);

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
        <Hero title="Workforce" value="120" icon={Users} />
        <Hero title="Fitment Index" value="82%" icon={Brain} />
        <Hero title="Burnout Risk" value="15%" icon={AlertTriangle} />
        <Hero title="Automation" value="$6.2M" icon={Zap} />
      </div>

      {/* VISUAL INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Fitment */}
        <InsightCard title="Fitment Health" onClick={() => go("/fitment")}>
          <PieBlock data={fitmentData} />
        </InsightCard>

        {/* Fatigue */}
        <InsightCard title="Fatigue Risk" onClick={() => go("/fatigue")}>
          <PieBlock data={fatigueData} />
        </InsightCard>

        {/* Soft Skills */}
        <InsightCard title="Skill Health" onClick={() => go("/softskills")}>
          <PieBlock data={skillData} />
        </InsightCard>

        {/* Gap */}
        <InsightCard title="Gap Exposure" onClick={() => go("/gap-analysis")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gapData}>
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gap" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </InsightCard>

        {/* Automation */}
        <InsightCard title="Automation Potential" onClick={() => go("/workforce-intelligence")}>
          <PieBlock data={automationData} />
        </InsightCard>

        {/* 6x6 */}
        <InsightCard title="6×6 Workforce Matrix" onClick={() => go("/6x6-workforce-analysis")}>
          <div className="grid grid-cols-3 gap-3">
            {["Critical", "High", "Medium", "Stable", "Strong", "Elite"].map(x => (
              <div key={x} className="p-4 rounded-lg bg-blue-50 text-center text-sm font-semibold">
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
          <Signal>12 employees in burnout risk cluster</Signal>
          <Signal>Sales productivity leakage detected</Signal>
          <Signal>Engineering overstaffed by 8 FTE</Signal>
          <Signal>6 roles ready for automation</Signal>
        </CardContent>
      </Card>

    </div>
  );
}

/* ===== UI Blocks ===== */

function Hero({ title, value, icon: Icon }) {
  return (
    <Card>
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
        <CardTitle className="flex justify-between items-center">
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
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Signal({ children }) {
  return (
    <div className="flex items-center gap-3">
      <Badge className="bg-blue-100 text-blue-800">AI</Badge>
      <p className="text-sm">{children}</p>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, AlertTriangle, TrendingUp, ArrowRight, GraduationCap, UserX, Zap, ChevronDown, ChevronUp } from "lucide-react";

/* ----------------------- MATRIX DEFINITIONS ----------------------- */

const rows = [
  "Productivity",
  "Utilization",
  "Fitment",
  "Fatigue",
  "Automation Potential",
  "Business Criticality",
];

const cols = ["Critical", "High", "Medium", "Stable", "Strong", "Elite"];

const bucketRanges = [
  { name: "Critical", min: 0, max: 30 },
  { name: "High", min: 31, max: 45 },
  { name: "Medium", min: 46, max: 60 },
  { name: "Stable", min: 61, max: 75 },
  { name: "Strong", min: 76, max: 90 },
  { name: "Elite", min: 91, max: 100 },
];

/* ----------------------- SAMPLE WORKFORCE ----------------------- */

const employees = [
  {
    name: "Sarah Johnson",
    role: "Senior Accountant",
    dept: "Finance",
    productivity: 82,
    utilization: 91,
    fitment: 78,
    fatigue: 72,
    automation: 40,
    leadership: 85,
  },
  {
    name: "Michael Torres",
    role: "AP Processor",
    dept: "Finance",
    productivity: 54,
    utilization: 68,
    fitment: 45,
    fatigue: 83,
    automation: 78,
    leadership: 32,
  },
  {
    name: "David Chen",
    role: "R2R Analyst",
    dept: "Finance",
    productivity: 76,
    utilization: 84,
    fitment: 88,
    fatigue: 40,
    automation: 35,
    leadership: 64,
  },
  {
    name: "Priya Patel",
    role: "Treasury Specialist",
    dept: "Finance",
    productivity: 60,
    utilization: 72,
    fitment: 55,
    fatigue: 69,
    automation: 58,
    leadership: 48,
  },
];

/* ----------------------- HELPERS ----------------------- */

function bucket(score) {
  return bucketRanges.find(b => score >= b.min && score <= b.max)?.name || "Medium";
}

function getBusinessCriticality(e) {
  return (
    e.leadership * 0.45 +
    (e.role.includes("Senior") ? 80 : 60) * 0.25 +
    e.productivity * 0.15 +
    e.fitment * 0.15
  );
}

function aiRecommendation(e) {
  if (e.fatigue > 75) return "Reduce workload and rebalance tasks.";
  if (e.fitment < 50) return "Reskill or redeploy to better-fit role.";
  if (e.automation > 70) return "Target for automation or role redesign.";
  if (e.leadership > 80) return "Consider for leadership or strategic projects.";
  return "Maintain and monitor performance.";
}

/* ----------------------- COMPONENT ----------------------- */

export default function SixBySixAnalysis() {
  const [selected, setSelected] = useState(null);

  const enriched = useMemo(() => {
    return employees.map(e => ({
      ...e,
      "Business Criticality": Math.round(getBusinessCriticality(e)),
    }));
  }, []);

  const matrix = useMemo(() => {
    const m = {};
    rows.forEach(r => cols.forEach(c => (m[`${r}-${c}`] = [])));

    enriched.forEach(e => {
      rows.forEach(r => {
        const value = r === "Business Criticality" ? e[r] : e[r.toLowerCase()];
        const col = bucket(value);
        m[`${r}-${col}`].push(e);
      });
    });
    return m;
  }, [enriched]);

  return (
    <div className="p-10 bg-slate-50 min-h-screen space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">6×6 Workforce Intelligence Matrix</h1>
        <p className="text-slate-500">AI-driven segmentation of risk, fitment and performance</p>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-4 gap-6">
        <KPI title="Workforce at Risk" value="127 FTE" />
        <KPI title="Cost at Risk" value="$8.2M" />
        <KPI title="Automation Potential" value="$3.4M" />
        <KPI title="Productivity Leakage" value="21%" />
      </div>

      {/* MATRIX */}
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-3">
          <div />
          {cols.map(c => (
            <div key={c} className="text-center text-sm font-semibold text-slate-600">
              {c}
            </div>
          ))}

          {rows.map(r => (
            <React.Fragment key={r}>
              <div className="text-sm font-semibold text-slate-700">{r}</div>
              {cols.map(c => {
                const list = matrix[`${r}-${c}`];
                return (
                  <div
                    key={c}
                    onClick={() => setSelected({ r, c, list })}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition"
                  >
                    <div className="text-lg font-bold text-blue-700">{list.length}</div>
                    <div className="text-xs text-slate-500">Employees</div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selected?.r} → {selected?.c}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selected?.list.map((e, i) => (
              <div key={i} className="p-4 border rounded-lg bg-slate-50">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-sm text-slate-500">{e.role} • {e.dept}</div>
                  </div>
                  <Badge>{e["Business Criticality"]}</Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                  <div>Fitment: {e.fitment}</div>
                  <div>Fatigue: {e.fatigue}</div>
                  <div>Automation: {e.automation}</div>
                  <div>Leadership: {e.leadership}</div>
                </div>

                <div className="mt-3 bg-blue-50 p-3 rounded text-sm text-blue-700 flex gap-2">
                  <Brain className="w-4 h-4" />
                  {aiRecommendation(e)}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ----------------------- SMALL UI ----------------------- */

function KPI({ title, value }) {
  return (
    <Card className="p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold text-blue-700">{value}</div>
    </Card>
  );
}

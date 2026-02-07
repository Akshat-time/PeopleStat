import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, AlertTriangle, TrendingUp, ArrowRight, GraduationCap, UserX, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { employees as centralEmployees, getOverallRisk } from "@/data/mockEmployeeData";

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

/* ----------------------- HELPERS ----------------------- */

function bucket(score) {
  return bucketRanges.find(b => score >= b.min && score <= b.max)?.name || "Medium";
}

function getBusinessCriticality(e) {
  // Score based on aptitude, role seniority, and performance
  const roleBonus = e.position.includes("Lead") || e.position.includes("Senior") ? 85 : 60;
  return (
    e.scores.aptitude * 0.4 +
    roleBonus * 0.3 +
    e.scores.productivity * 0.15 +
    e.scores.fitment * 0.15
  );
}

function aiRecommendation(e) {
  if (e.scores.fatigue > 75) return "Reduce workload and rebalance tasks.";
  if (e.scores.fitment < 50) return "Reskill or redeploy to better-fit role.";
  if (e.scores.automationPotential > 70) return "Target for automation or role redesign.";
  if (e.scores.aptitude > 85) return "Consider for leadership or strategic projects.";
  return "Maintain and monitor performance.";
}

/* ----------------------- COMPONENT ----------------------- */

export default function SixBySixAnalysis() {
  const [selected, setSelected] = useState(null);

  const enriched = useMemo(() => {
    return centralEmployees.map(e => ({
      ...e,
      "Business Criticality": Math.round(getBusinessCriticality(e)),
    }));
  }, []);

  const matrix = useMemo(() => {
    const m = {};
    rows.forEach(r => cols.forEach(c => (m[`${r}-${c}`] = [])));

    enriched.forEach(e => {
      rows.forEach(r => {
        let value = 0;
        if (r === "Business Criticality") {
          value = e[r];
        } else {
          // Map row name to scores key
          const key = r.toLowerCase().replace(" potential", "Potential");
          value = e.scores[key] || 0;
        }
        const col = bucket(value);
        m[`${r}-${col}`].push(e);
      });
    });
    return m;
  }, [enriched]);

  const kpis = useMemo(() => {
    const highRisk = centralEmployees.filter(e => getOverallRisk(e) === "High").length;
    const totalCost = centralEmployees.reduce((sum, e) => sum + e.salary, 0);
    const costAtRisk = centralEmployees
      .filter(e => getOverallRisk(e) === "High")
      .reduce((sum, e) => sum + e.salary, 0);
    const avgAutomation = centralEmployees.reduce((sum, e) => sum + e.scores.automationPotential, 0) / centralEmployees.length;

    return {
      riskCount: highRisk,
      costAtRisk: (costAtRisk / 1000).toFixed(0) + "K",
      totalCost: (totalCost / 1000000).toFixed(1) + "M",
      autoPct: Math.round(avgAutomation)
    };
  }, []);

  return (
    <div className="p-10 bg-slate-50 min-h-screen space-y-8 font-['Inter']">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">6×6 Workforce Intelligence Matrix</h1>
        <p className="text-slate-500 mt-1">AI-driven segmentation of risk, fitment and performance across {centralEmployees.length} nodes</p>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-4 gap-6">
        <KPI title="Workforce at Risk" value={`${kpis.riskCount} Employees`} />
        <KPI title="Payroll Exposure" value={`$${kpis.totalCost}`} />
        <KPI title="Cost at Risk" value={`$${kpis.costAtRisk}`} />
        <KPI title="Avg Automation Potential" value={`${kpis.autoPct}%`} />
      </div>

      {/* MATRIX */}
      <Card className="p-8 border-slate-200 shadow-sm bg-white">
        <div className="grid grid-cols-7 gap-4">
          <div />
          {cols.map(c => (
            <div key={c} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2">
              {c}
            </div>
          ))}

          {rows.map(r => (
            <React.Fragment key={r}>
              <div className="text-xs font-bold text-slate-600 flex items-center pr-4">{r}</div>
              {cols.map(c => {
                const list = matrix[`${r}-${c}`];
                const count = list.length;
                return (
                  <div
                    key={c}
                    onClick={() => count > 0 && setSelected({ r, c, list })}
                    className={`border rounded-xl p-4 transition-all duration-200 group ${count > 0
                        ? "bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-600 hover:border-blue-700 hover:shadow-lg hover:shadow-blue-100"
                        : "bg-slate-50 border-slate-100 opacity-40 grayscale"
                      }`}
                  >
                    <div className={`text-2xl font-black ${count > 0 ? "text-blue-700 group-hover:text-white" : "text-slate-300"}`}>
                      {count}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-tighter ${count > 0 ? "text-blue-500 group-hover:text-blue-100" : "text-slate-300"}`}>
                      {count === 1 ? 'Asset' : 'Assets'}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-50 border-none shadow-2xl p-0">
          <div className="p-6 bg-white border-b sticky top-0 z-10 flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-black text-slate-900">{selected?.r} :: {selected?.c}</DialogTitle>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Drilldown Analysis // {selected?.list.length} Records Found</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {selected?.list.map((e, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">
                      {e.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{e.name}</div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">{e.position} • {e.department}</div>
                    </div>
                  </div>
                  <Badge className="bg-slate-100 text-slate-900 border-slate-200 px-3 py-1 font-black">
                    BC SCORE: {e["Business Criticality"]}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Metric label="Fitment" value={`${e.scores.fitment}%`} />
                  <Metric label="Fatigue" value={`${e.scores.fatigue}%`} warning={e.scores.fatigue > 75} />
                  <Metric label="Automation" value={`${e.scores.automationPotential}%`} />
                  <Metric label="Aptitude" value={`${e.scores.aptitude}%`} />
                </div>

                <div className="bg-slate-900 p-4 rounded-xl text-xs font-medium text-white flex gap-3 items-center group">
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-400 transition-colors">
                    <Brain className="w-4 h-4" />
                  </div>
                  <span><span className="text-blue-400 font-bold uppercase tracking-widest mr-2">MAYA Recommendation:</span> {aiRecommendation(e)}</span>
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
    <Card className="p-6 border-slate-200 shadow-sm bg-white">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</div>
      <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
    </Card>
  );
}

function Metric({ label, value, warning }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1">{label}</div>
      <div className={`text-lg font-black ${warning ? 'text-red-600' : 'text-slate-900'}`}>{value}</div>
    </div>
  );
}

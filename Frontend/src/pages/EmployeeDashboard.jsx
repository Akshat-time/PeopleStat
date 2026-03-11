import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target, Zap, AlertTriangle, Brain, BarChart3,
  CheckCircle2, Circle, ArrowRight, TrendingUp,
  Clock, Users, Activity, Star, Briefcase,
  ChevronRight, Award, Lightbulb, User
} from "lucide-react";

// ── Tiny SVG Radar Chart (no external lib needed) ───────────────────────────
function RadarChart({ data, size = 200 }) {
  const labels = data.map(d => d.label);
  const values = data.map(d => Math.min(100, Math.max(0, d.value)));
  const n = labels.length;
  const cx = size / 2, cy = size / 2, r = size * 0.38;

  const toXY = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + r * (val / 100) * Math.cos(angle),
      y: cy + r * (val / 100) * Math.sin(angle),
    };
  };

  const spokes = Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x2: cx + r * Math.cos(angle), y2: cy + r * Math.sin(angle) };
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map(level =>
    Array.from({ length: n }, (_, i) => toXY(i, level * 100))
      .map(p => `${p.x},${p.y}`)
      .join(" ")
  );

  const valuePoly = values
    .map((v, i) => toXY(i, v))
    .map(p => `${p.x},${p.y}`)
    .join(" ");

  const labelPos = spokes.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const pad = 18;
    return {
      x: cx + (r + pad) * Math.cos(angle),
      y: cy + (r + pad) * Math.sin(angle),
      label: labels[i],
      val: values[i],
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridPolygons.map((poly, i) => (
        <polygon key={i} points={poly} fill="none" stroke="#E2E8F0" strokeWidth="1" />
      ))}
      {spokes.map((s, i) => (
        <line key={i} x1={cx} y1={cy} x2={s.x2} y2={s.y2} stroke="#E2E8F0" strokeWidth="1" />
      ))}
      <polygon points={valuePoly} fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="2" />
      {values.map((v, i) => {
        const p = toXY(i, v);
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3B82F6" />;
      })}
      {labelPos.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="700"
          fill="#64748B"
        >
          {lp.label}
        </text>
      ))}
    </svg>
  );
}

// ── Metric KPI Card ──────────────────────────────────────────────────────────
function MetricCard({ title, value, icon: Icon, description, color, badge, onClick }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-slate-200" onClick={onClick}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className={`p-2 rounded-lg ${color.replace("text-", "bg-").replace("600", "100").replace("500", "50")}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h2>
          {badge && (
            <Badge variant="outline" className="text-[9px] py-0 font-bold text-green-600 border-green-200 bg-green-50">
              LIVE
            </Badge>
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// ── Assessment Step ───────────────────────────────────────────────────────────
function AssessmentStep({ label, done, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
        done
          ? "bg-green-50 border-green-200 hover:bg-green-100"
          : "bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-200"
      }`}
      onClick={onClick}
    >
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <Circle className="h-5 w-5 text-slate-300 flex-shrink-0" />
      )}
      <span className={`text-sm font-semibold ${done ? "text-green-700" : "text-slate-600"}`}>{label}</span>
      {!done && <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />}
    </div>
  );
}

// ── Career Ladder ─────────────────────────────────────────────────────────────
function CareerLadder({ current, next, future }) {
  const steps = [
    { label: "Future Leadership", role: future, icon: Star, color: "text-purple-600", bg: "bg-purple-50 border-purple-200", active: false },
    { label: "Next Role", role: next, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", active: false },
    { label: "Current Role", role: current, icon: Briefcase, color: "text-green-600", bg: "bg-green-50 border-green-200", active: true },
  ];

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 flex items-center justify-center ${step.bg} ${step.active ? "ring-2 ring-green-400 ring-offset-1" : ""}`}>
            <step.icon className={`h-5 w-5 ${step.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{step.label}</p>
            <p className={`text-sm font-bold truncate ${step.active ? "text-green-700" : "text-slate-700"}`}>
              {step.role || "—"}
            </p>
          </div>
          {i < steps.length - 1 && (
            <div className="absolute left-5 mt-10 w-0.5 h-3 bg-slate-200" style={{ position: "relative", left: "-22px", top: "6px", width: "2px", height: "12px", background: "#E2E8F0", marginBottom: "-8px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [rawEmp, setRawEmp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.email) { setIsLoading(false); return; }
      try {
        const res = await api.get(`/employees?email=${user.email}`);
        const d = res.data;
        if (d.success && d.data && d.data.length > 0) {
          setRawEmp(d.data[0]);
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [user]);

  // ── Derived State ─────────────────────────────────────────────────────────
  const emp = useMemo(() => {
    if (!rawEmp) return null;

    const fr = rawEmp.fitmentResponses || {};
    const wh = rawEmp.workingHours || {};
    const pc = rawEmp.processCharacteristics || {};
    const em = rawEmp.employeeMaster || {};

    const score = (v) => {
      if (!v) return 60;
      const s = v.toLowerCase();
      if (s.includes("volunteers") || s.includes("consensus") || s.includes("alignment") || s.includes("high") || s.includes("minimal")) return 90;
      if (s.includes("similar") || s.includes("listening") || s.includes("medium")) return 60;
      return 30;
    };

    const commScore   = score(fr.communicativeness);
    const adaptScore  = score(fr.changeReadyTechSavviness);
    const leadScore   = score(fr.multiplexer);
    const collabScore = score(fr.teamPlayerCollaboration);
    const innoScore   = score(fr.selfMotivated);

    const fitment = Math.round((commScore + adaptScore + leadScore + collabScore + innoScore) / 5);

    const numericHours = Object.values(wh).filter(v => !isNaN(Number(v)) && v !== "").map(Number);
    const totalHours = numericHours.reduce((s, v) => s + v, 0);
    const utilization = totalHours > 0 ? Math.min(100, Math.round((totalHours / 160) * 100)) : 0;

    const meetingHrs  = Number(wh.meetingHoursPerWeek || 0) * 4;
    const trainingHrs = Number(wh.trainingHoursPerMonth || 0);
    const overtimeFreq = meetingHrs + trainingHrs;
    const workloadIntensity = totalHours > 0 ? (totalHours / 160) * 100 : 0;
    const fatigueScore = totalHours > 0
      ? Math.min(100, Math.round((workloadIntensity * 0.6) + (overtimeFreq * 0.4)))
      : 0;

    const hardSkills = pc.coreSkills ? pc.coreSkills.split(",").map(s => s.trim()).filter(Boolean) : [];
    const softSkills = pc.tools ? pc.tools.split(",").map(s => s.trim()).filter(Boolean) : [];

    const hasWH = totalHours > 0;
    const hasFR = Object.keys(fr).length > 0;
    const hasProfile = !!(em.employeeName || em.currentRole);

    const workloadRows = [];
    const workloadFields = [
      { key: "customerInvoicing", label: "Customer Invoicing" },
      { key: "invoicePosting", label: "Invoice Posting" },
      { key: "paymentProcessing", label: "Payment Processing" },
      { key: "mdmSupport", label: "MDM Support" },
      { key: "recordToReport", label: "Record to Report" },
      { key: "treasury", label: "Treasury" },
      { key: "taxation", label: "Taxation" },
      { key: "meetings", label: "Meetings" },
      { key: "training", label: "Training" },
      { key: "others", label: "Others" }
    ];

    workloadFields.forEach(f => {
      const val = Number(wh[f.key]);
      if (val > 0) {
        workloadRows.push({ 
          process: f.label, 
          freq: f.key === "meetings" ? "Weekly" : f.key === "training" ? "Monthly" : "Daily", 
          time: `${val}h`, 
          monthly: val 
        });
      }
    });

    const currentRole    = em.currentRole || pc.designation || "N/A";
    const nextRole       = pc.recommendedRole || (fitment > 80 ? "Senior " + currentRole : "Team Lead");
    const futureRole     = fitment > 85 ? "Director / Principal" : "Senior Manager";
    const name           = em.employeeName || user?.username || user?.email?.split("@")[0] || "Employee";
    const department     = em.department || rawEmp.department || "General";
    const designation    = pc.designation || em.currentRole || "Associate";
    const manager        = em.managerName || "—";

    return {
      name, department, designation, manager,
      fitment, utilization, fatigueScore, totalHours,
      commScore, adaptScore, leadScore, collabScore, innoScore,
      hardSkills, softSkills,
      currentRole, nextRole, futureRole,
      hasProfile, hasFR, hasWH,
      workloadRows,
      overtimeFreq: Math.round(overtimeFreq),
      fatigueRisk: fatigueScore > 75 ? "Critical" : fatigueScore > 50 ? "High" : fatigueScore > 25 ? "Medium" : "Low",
    };
  }, [rawEmp, user]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  if (!emp) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md p-8 text-center border-blue-100">
          <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Your Portal</h2>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            Complete your Employee Data Form to unlock personalized career insights, skill analytics, and fatigue monitoring.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={() => navigate("/employee/data-form")}>
            Complete Your Assessment →
          </Button>
        </Card>
      </div>
    );
  }

  const radarData = [
    { label: "Comm.", value: emp.commScore },
    { label: "Lead.", value: emp.leadScore },
    { label: "Adapt.", value: emp.adaptScore },
    { label: "Collab.", value: emp.collabScore },
    { label: "Innov.", value: emp.innoScore },
  ];

  const fatigueColor = emp.fatigueScore > 75 ? "text-red-600" : emp.fatigueScore > 50 ? "text-amber-600" : "text-green-600";

  return (
    <div className="space-y-6 pb-10">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <span className="text-blue-600">{emp.name}</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {emp.designation} · {emp.department}
            {emp.manager !== "—" && <> · Reports to <span className="font-semibold">{emp.manager}</span></>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/employee/data-form")}>
            <ClipboardList className="h-4 w-4 mr-1" /> Update Data
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/employee/profile")}>
            <User className="h-4 w-4 mr-1" /> My Profile
          </Button>
        </div>
      </div>

      {/* ── KPI STRIP ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Fitment Score"
          value={emp.fitment + "%"}
          icon={Target}
          description="Role alignment index"
          color="text-blue-600"
          badge
          onClick={() => navigate("/softskills")}
        />
        <MetricCard
          title="Utilization Rate"
          value={emp.utilization + "%"}
          icon={Zap}
          description={`${emp.totalHours}h / 160h monthly workload`}
          color="text-amber-600"
          badge
          onClick={() => navigate("/fatigue")}
        />
        <MetricCard
          title="Fatigue Risk"
          value={emp.fatigueRisk}
          icon={AlertTriangle}
          description={`Score: ${emp.fatigueScore}% · ${emp.fatigueScore > 60 ? "Needs attention" : "Healthy range"}`}
          color={fatigueColor}
          badge
          onClick={() => navigate("/fatigue")}
        />
      </div>

      {/* ── ROW 2: Radar + Career Ladder + Assessment ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Radar Chart */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" /> Skill Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <RadarChart data={radarData} size={200} />
            <div className="grid grid-cols-2 gap-2 w-full text-[11px]">
              {radarData.map(d => (
                <div key={d.label} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-1.5">
                  <span className="text-slate-500 font-semibold">{d.label}</span>
                  <span className="font-black text-blue-700">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Ladder */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" /> Career Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CareerLadder
              current={emp.currentRole}
              next={emp.nextRole}
              future={emp.futureRole}
            />
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide mb-1">AI Insight</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {emp.fitment >= 80
                  ? `You're in the top 20% for role alignment. Focus on ${emp.commScore < 75 ? "communication" : "leadership"} to accelerate to ${emp.nextRole}.`
                  : `Improve your fitment score by completing behavioral assessments and upskilling in ${emp.hardSkills[0] || "core domains"}.`}
              </p>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-8" size="sm" onClick={() => navigate("/ai-assistant")}>
              <Lightbulb className="h-3 w-3 mr-1" /> Chat with AI Career Coach
            </Button>
          </CardContent>
        </Card>

        {/* Assessment Tracker */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Assessment Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">Overall Completion</span>
              <span className="text-sm font-black text-blue-700">
                {[emp.hasProfile, emp.hasFR, emp.hasWH].filter(Boolean).length}/3
              </span>
            </div>
            <Progress
              value={Math.round(([emp.hasProfile, emp.hasFR, emp.hasWH].filter(Boolean).length / 3) * 100)}
              className="h-2 mb-3"
            />
            <AssessmentStep
              label="Employee Profile"
              done={emp.hasProfile}
              onClick={() => navigate("/employee/data-form")}
            />
            <AssessmentStep
              label="Behavioral Assessment"
              done={emp.hasFR}
              onClick={() => navigate("/employee/data-form")}
            />
            <AssessmentStep
              label="Workload Information"
              done={emp.hasWH}
              onClick={() => navigate("/employee/data-form")}
            />
            {(!emp.hasProfile || !emp.hasFR || !emp.hasWH) && (
              <Button size="sm" variant="outline" className="w-full text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/employee/data-form")}>
                Complete Missing Sections →
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 3: Workload Summary + Workload Table ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Workload Summary */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" /> Workload Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Total Monthly Hours", value: emp.totalHours > 0 ? `${emp.totalHours}h` : "—", sub: "Recorded workload", color: "bg-blue-50 text-blue-700" },
                { label: "Overtime Frequency", value: emp.overtimeFreq > 0 ? `${emp.overtimeFreq}h` : "—", sub: "Meetings + Training", color: "bg-amber-50 text-amber-700" },
                { label: "Fatigue Risk", value: emp.fatigueRisk, sub: `Score: ${emp.fatigueScore}%`, color: emp.fatigueScore > 60 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${item.color} bg-opacity-60`}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                  <p className="text-xl font-black">{item.value}</p>
                </div>
              ))}
            </div>
            {!emp.hasWH && (
              <p className="text-[11px] text-slate-400 text-center py-2">
                Fill out the Data Form to see your workload analysis.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Workload Breakdown Table */}
        <Card className="lg:col-span-3 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" /> Workload Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emp.workloadRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-1 text-slate-400 font-bold uppercase tracking-wide">Process</th>
                      <th className="text-left py-2 px-1 text-slate-400 font-bold uppercase tracking-wide">Frequency</th>
                      <th className="text-left py-2 px-1 text-slate-400 font-bold uppercase tracking-wide">Time Spent</th>
                      <th className="text-right py-2 px-1 text-slate-400 font-bold uppercase tracking-wide">Monthly Hrs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emp.workloadRows.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-1 font-semibold text-slate-800">{row.process}</td>
                        <td className="py-2 px-1 text-slate-500">{row.freq}</td>
                        <td className="py-2 px-1 text-slate-500">{row.time}</td>
                        <td className="py-2 px-1 text-right font-black text-blue-700">{row.monthly}h</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-black">
                      <td className="py-2 px-1 text-slate-700" colSpan={3}>Total</td>
                      <td className="py-2 px-1 text-right text-blue-800 text-sm">
                        {emp.workloadRows.reduce((s, r) => s + r.monthly, 0)}h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No workload data yet.</p>
                <Button size="sm" variant="link" className="text-blue-500 text-xs mt-1"
                  onClick={() => navigate("/employee/data-form")}>
                  Add your workload information →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 4: Top Skills + AI Card ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Skills */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" /> Your Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emp.hardSkills.length > 0 || emp.softSkills.length > 0 ? (
              <div className="space-y-4">
                {emp.hardSkills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Technical / Hard Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {emp.hardSkills.map(s => (
                        <Badge key={s} className="bg-blue-50 text-blue-700 border border-blue-100 font-semibold text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {emp.softSkills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tools / Soft Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {emp.softSkills.map(s => (
                        <Badge key={s} className="bg-purple-50 text-purple-700 border border-purple-100 font-semibold text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button size="sm" variant="outline" className="text-xs mt-2" onClick={() => navigate("/softskills")}>
                  View Full Skill Report <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Add your skills in the Data Form.</p>
                <Button size="sm" variant="link" className="text-blue-500 text-xs" onClick={() => navigate("/employee/data-form")}>
                  Go to Data Form →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Career Assistant */}
        <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-600" /> AI Career Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Strategic Insight</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {emp.fitment >= 80
                  ? `Your ${emp.hardSkills[0] || "core"} proficiency puts you in the top 15% for ${emp.nextRole} positions. Strengthen ${emp.leadScore < 70 ? "leadership" : "communication"} to fast-track promotion.`
                  : `Your current fitment score is ${emp.fitment}%. Complete all assessments and improve ${emp.adaptScore < 60 ? "adaptability" : "collaboration"} skills to reach the next level.`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Next Role Match", value: emp.fitment + "%", color: "text-blue-700" },
                { label: "Promotion ETA", value: emp.fitment >= 85 ? "6 months" : "12 months", color: "text-purple-700" },
                { label: "Skill Gap", value: (100 - emp.fitment) + "%", color: "text-amber-700" },
                { label: "Risk Level", value: emp.fatigueRisk, color: emp.fatigueScore > 60 ? "text-red-700" : "text-green-700" },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-lg p-2 text-center">
                  <p className="text-slate-400 font-semibold">{item.label}</p>
                  <p className={`font-black mt-0.5 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm" onClick={() => navigate("/ai-assistant")}>
              Chat with AI Career Coach
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function ClipboardList({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="12" y1="11" x2="16" y2="11" /><line x1="12" y1="16" x2="16" y2="16" /><line x1="8" y1="11" x2="8.01" y2="11" /><line x1="8" y1="16" x2="8.01" y2="16" />
    </svg>
  );
}

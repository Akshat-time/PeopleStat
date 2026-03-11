import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain, MessageCircle, Users, Shield, Heart, Zap,
  TrendingUp, TrendingDown, ArrowRight, AlertTriangle,
  CheckCircle, Target, ChevronRight, Lightbulb, Star,
  BookOpen, Search, Filter, Download, Info,
  XCircle, Clock
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import api from "@/services/api";
import EmployeeDrawer from "@/components/EmployeeDrawer";
import { useWorkforceData } from "@/contexts/WorkforceContext";

// ── SVG Radar Chart ────────────────────────────────────────────────────────
function RadarChart({ data, size = 240, color = "#6366F1" }) {
  const n = data.length;
  const cx = size / 2, cy = size / 2, r = size * 0.36;
  const toXY = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * (val / 100) * Math.cos(angle), y: cy + r * (val / 100) * Math.sin(angle) };
  };
  const gridPolygons = [0.25, 0.5, 0.75, 1].map(level =>
    Array.from({ length: n }, (_, i) => toXY(i, level * 100)).map(p => `${p.x},${p.y}`).join(" ")
  );
  const spokes = Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x2: cx + r * Math.cos(angle), y2: cy + r * Math.sin(angle) };
  });
  const valuePoly = data.map((d, i) => toXY(i, d.value)).map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridPolygons.map((p, i) => <polygon key={i} points={p} fill="none" stroke="#E2E8F0" strokeWidth="1" />)}
      {spokes.map((s, i) => <line key={i} x1={cx} y1={cy} x2={s.x2} y2={s.y2} stroke="#E2E8F0" strokeWidth="1" />)}
      <polygon points={valuePoly} fill={color.replace(")", ",0.15)").replace("rgb", "rgba")} stroke={color} strokeWidth="2" />
      {data.map((d, i) => {
        const p = toXY(i, d.value);
        return <circle key={i} cx={p.x} cy={p.y} r="5" fill={color} />;
      })}
      {spokes.map((s, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const px = cx + (r + 22) * Math.cos(angle);
        const py = cy + (r + 22) * Math.sin(angle);
        return (
          <g key={i}>
            <text x={px} y={py - 6} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#334155">
              {data[i].label}
            </text>
            <text x={px} y={py + 6} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="900" fill={color}>
              {data[i].value}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEE VIEW — Personal Skill Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function EmployeeSkillView() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [rawEmp, setRawEmp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) { setIsLoading(false); return; }
      try {
        const res = await api.get(`/employees?email=${user.email}`);
        const d = res.data;
        if (d.success && d.data?.length > 0) setRawEmp(d.data[0]);
      } catch(e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [user]);

  const skills = useMemo(() => {
    if (!rawEmp) return null;
    const fr = rawEmp.fitmentResponses || {};
    const pc = rawEmp.processCharacteristics || {};

    const score = (v) => {
      if (!v) return 60;
      const s = String(v).toLowerCase();
      if (s.includes("volunteers") || s.includes("consensus") || s.includes("alignment") || s.includes("high") || s.includes("minimal")) return 90;
      if (s.includes("similar") || s.includes("listening") || s.includes("medium")) return 60;
      return 30;
    };

    const comm  = score(fr.communicativeness);
    const lead  = score(fr.multiplexer);
    const adapt = score(fr.changeReadyTechSavviness);
    const collab = score(fr.teamPlayerCollaboration);
    const inno   = score(fr.selfMotivated);
    const fitment = Math.round((comm + lead + adapt + collab + inno) / 5);

    const hardSkills = pc.coreSkills ? pc.coreSkills.split(",").map(s => s.trim()).filter(Boolean) : [];
    const softSkills = pc.tools ? pc.tools.split(",").map(s => s.trim()).filter(Boolean) : [];

    // Strength vs Gap analysis
    const traits = [
      { name: "Communication", score: comm, benchmark: 78, icon: MessageCircle },
      { name: "Leadership", score: lead, benchmark: 75, icon: Shield },
      { name: "Adaptability", score: adapt, benchmark: 80, icon: Zap },
      { name: "Collaboration", score: collab, benchmark: 82, icon: Users },
      { name: "Innovation", score: inno, benchmark: 77, icon: Lightbulb },
    ];

    // Recommended skills to improve (below benchmark)
    const toImprove = traits.filter(t => t.score < t.benchmark);

    return { comm, lead, adapt, collab, inno, fitment, hardSkills, softSkills, traits, toImprove };
  }, [rawEmp]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!rawEmp || !skills) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md p-8 text-center border-indigo-100">
        <Brain className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Skill Data Yet</h2>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">
          Complete your behavioral assessment to generate your personal skill dashboard.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700 w-full" onClick={() => navigate("/employee/data-form")}>
          Complete Assessment →
        </Button>
      </Card>
    </div>
  );

  const radarData = [
    { label: "Communication", value: skills.comm },
    { label: "Leadership", value: skills.lead },
    { label: "Adaptability", value: skills.adapt },
    { label: "Collaboration", value: skills.collab },
    { label: "Innovation", value: skills.inno },
  ];

  const healthScore = Math.round((skills.comm + skills.lead + skills.adapt + skills.collab + skills.inno) / 5);
  const healthStatus = healthScore > 80 ? "Optimized" : healthScore > 60 ? "Stable" : "Needs Attention";
  const healthColor  = healthScore > 80 ? "#3B82F6" : healthScore > 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Skill Intelligence</h1>
            <p className="text-slate-500 text-sm mt-1">Your personal behavioral and cognitive performance dashboard</p>
          </div>
          <Button size="sm" variant="outline" className="border-slate-200" onClick={() => navigate("/employee/data-form")}>
            Update Assessment
          </Button>
        </div>

        {/* Top Row: Radar + Health Gauge + Trait Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Radar Chart */}
          <Card className="lg:col-span-5 border-slate-200 flex flex-col items-center">
            <CardHeader className="pb-0 self-start">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-500" /> Skill Radar Map
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2">
              <RadarChart data={radarData} size={240} color="#6366F1" />
            </CardContent>
          </Card>

          {/* Health Gauge */}
          <Card className="lg:col-span-3 border-slate-200 flex flex-col items-center justify-center p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Behavioral Health Index</p>
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" stroke="#F1F5F9" strokeWidth="14" fill="none" />
              <circle cx="80" cy="80" r="68" stroke={healthColor} strokeWidth="14" fill="none"
                strokeDasharray={`${2 * Math.PI * 68}`}
                strokeDashoffset={`${2 * Math.PI * 68 * (1 - healthScore / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div className="text-center -mt-2">
              <p className="text-5xl font-black text-slate-900">{healthScore}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Global Points</p>
              <Badge className="mt-3 font-bold text-xs" style={{ background: healthColor + "20", color: healthColor, border: `1px solid ${healthColor}30` }}>
                {healthStatus.toUpperCase()}
              </Badge>
            </div>
          </Card>

          {/* Trait Cards 2×2 */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {skills.traits.map(trait => {
              const gap = trait.score < trait.benchmark;
              const TIcon = trait.icon;
              return (
                <Card key={trait.name} className="p-4 border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <TIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <Badge variant="outline" className={`border-none text-[9px] font-black ${gap ? "text-amber-600" : "text-green-600"}`}>
                      {gap ? "▼ GAP" : "▲ STRONG"}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{trait.name}</p>
                  <p className="text-3xl font-black text-slate-900">{trait.score}%</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${gap ? "bg-amber-400" : "bg-indigo-500"}`} style={{ width: `${trait.score}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-300 font-bold">BM: {trait.benchmark}%</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Strength vs Gap + Recommended Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Strength vs Gap Analysis */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" /> Skill Strength vs Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.traits.map(trait => {
                const gap = trait.benchmark - trait.score;
                const isStrong = gap <= 0;
                return (
                  <div key={trait.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{trait.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{trait.score}%</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isStrong ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                          {isStrong ? `+${Math.abs(gap)}% above` : `${Math.abs(gap)}% below`}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`absolute h-full rounded-full ${isStrong ? "bg-green-500" : "bg-amber-400"}`}
                        style={{ width: `${trait.score}%`, transition: "width 0.5s ease" }} />
                      {/* Benchmark marker */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 opacity-50"
                        style={{ left: `${trait.benchmark}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400">Benchmark: {trait.benchmark}%</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recommended Skills to Improve */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" /> Recommended Skills to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skills.toImprove.length > 0 ? skills.toImprove.map(trait => {
                const gap = trait.benchmark - trait.score;
                const TIcon = trait.icon;
                const tips = {
                  "Communication": "Practice structured feedback frameworks. Join presentation workshops.",
                  "Leadership": "Volunteer to lead small team projects or internal initiatives.",
                  "Adaptability": "Seek cross-functional project assignments. Embrace change actively.",
                  "Collaboration": "Join cross-departmental teams. Participate in pair programming.",
                  "Innovation": "Dedicate time for R&D side projects. Attend tech conferences.",
                };
                return (
                  <div key={trait.name} className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors">
                    <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                      <TIcon className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-amber-900">{trait.name}</p>
                        <Badge className="bg-amber-200 text-amber-800 border-none text-[10px] font-black">
                          Gap: {gap}%
                        </Badge>
                      </div>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">{tips[trait.name]}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
                  <p className="font-bold text-green-700 text-sm">All Skills Above Benchmark!</p>
                  <p className="text-slate-400 text-xs mt-1">You're excelling in all behavioral areas. Keep it up!</p>
                </div>
              )}

              {/* Current Skills from Form */}
              {(skills.hardSkills.length > 0 || skills.softSkills.length > 0) && (
                <div className="pt-3 border-t border-amber-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Your Current Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {[...skills.hardSkills, ...skills.softSkills].slice(0, 8).map(s => (
                      <Badge key={s} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MANAGER VIEW — Workforce-wide soft skills analysis (UNCHANGED FROM ORIGINAL)
// ─────────────────────────────────────────────────────────────────────────────
function ManagerSkillView() {
  const [centralEmployees, setCentralEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        const data = res.data;
        if (data.success && data.data) {
          const mapped = data.data.map(emp => {
            const fr = emp.fitmentResponses || {};
            const getScore = (val) => val === 'High' ? 90 : val === 'Medium' ? 60 : 30;
            const commScore  = getScore(fr.communicationLevel || 'Medium');
            const collabScore = getScore(fr.collaborationPreference || 'Medium');
            const adaptScore = getScore(fr.adaptability || 'Medium');
            const innoScore  = getScore(fr.innovationMindset || 'Medium');
            const leadScore  = getScore(fr.leadershipPotential || 'Medium');
            const avgFitment = Math.round((commScore + collabScore + adaptScore + innoScore + leadScore) / 5);
            const w = emp.workingHours || {};
            const totalHours = Object.values(w).filter(v => !isNaN(Number(v)) && v !== "").map(Number).reduce((s, v) => s + v, 0) || 160;
            const workloadIntensity = (totalHours / 160) * 100;
            const fatigueScore = Math.min(100, Math.round(workloadIntensity * 0.8));
            return {
              employeeId: emp.employeeMaster?.employeeId || emp._id,
              name: emp.employeeMaster?.employeeName || "Unknown",
              position: emp.employeeMaster?.currentRole || "Unknown Role",
              department: "General",
              scores: { skill: commScore, aptitude: leadScore, fatigue: fatigueScore, fitment: avgFitment, utilization: Math.round(workloadIntensity), productivity: adaptScore }
            };
          });
          setCentralEmployees(mapped);
        } else { setCentralEmployees([]); }
      } catch (e) { console.error(e); setCentralEmployees([]); }
      finally { setIsLoading(false); }
    };
    fetchEmployees();
  }, []);

  const traitScores = useMemo(() => {
    const total = centralEmployees.length || 1;
    const s = centralEmployees.reduce((acc, e) => {
      acc.communication += e.scores.skill;
      acc.teamwork += (e.scores.skill + e.scores.aptitude) / 2;
      acc.leadership += e.scores.aptitude;
      acc.empathy += (e.scores.skill + (100 - e.scores.fatigue)) / 2;
      acc.stressResilience += 100 - e.scores.fatigue;
      acc.learningAgility += (e.scores.skill + 2 * e.scores.aptitude) / 3;
      return acc;
    }, { communication: 0, teamwork: 0, leadership: 0, empathy: 0, stressResilience: 0, learningAgility: 0 });
    return Object.fromEntries(Object.entries(s).map(([k, v]) => [k, Math.round(v / total)]));
  }, [centralEmployees]);

  const teamHealth = useMemo(() => {
    const avgScore = Math.round(Object.values(traitScores).reduce((a, b) => a + b, 0) / 6);
    return {
      score: avgScore,
      status: avgScore > 80 ? "Optimized" : avgScore > 60 ? "Stable" : "Critical",
    };
  }, [traitScores]);

  const traits = useMemo(() => [
    { id: "communication", name: "Communication", score: traitScores.communication, benchmark: 78, trend: "up", icon: MessageCircle },
    { id: "teamwork", name: "Teamwork", score: traitScores.teamwork, benchmark: 82, trend: "up", icon: Users },
    { id: "leadership", name: "Leadership", score: traitScores.leadership, benchmark: 75, trend: "up", icon: Shield },
    { id: "empathy", name: "Empathy", score: traitScores.empathy, benchmark: 80, trend: "up", icon: Heart },
    { id: "resilience", name: "Stress Resilience", score: traitScores.stressResilience, benchmark: 85, trend: "down", icon: Zap },
    { id: "agility", name: "Learning Agility", score: traitScores.learningAgility, benchmark: 80, trend: "up", icon: Brain },
  ], [traitScores]);

  const filteredEmployees = useMemo(() =>
    centralEmployees.filter(emp =>
      String(emp.name).toLowerCase().includes(search.toLowerCase()) ||
      String(emp.employeeId).toLowerCase().includes(search.toLowerCase())
    ), [search, centralEmployees]);

  const getScoreBadge = (score) => score >= 85 ? "bg-blue-100 text-blue-700" : score >= 70 ? "bg-green-100 text-green-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  const getScoreLabel = (score) => score >= 85 ? "EXPERT" : score >= 70 ? "PROFICIENT" : score >= 55 ? "DEVELOPING" : "FOCUS";

  if (isLoading) return <div className="flex items-center justify-center min-h-[40vh]"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Soft Skills Intelligence</h1>
          <p className="text-slate-500 mt-1">Behavioral assessment and cognitive performance analytics across workforce</p>
        </div>

        {/* Health + Traits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 p-8 border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Health Index</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Behavioral Composite</p>
              </div>
              <Badge className={teamHealth.score > 80 ? 'bg-blue-100 text-blue-700 font-black' : 'bg-amber-100 text-amber-700 font-black'}>
                {teamHealth.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle cx="88" cy="88" r="78" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                  <circle cx="88" cy="88" r="78" stroke="#3B82F6" strokeWidth="12" fill="none"
                    strokeDasharray={`${2 * Math.PI * 78}`}
                    strokeDashoffset={`${2 * Math.PI * 78 * (1 - teamHealth.score / 100)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900">{teamHealth.score}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Pts</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {traits.map(trait => (
              <Card key={trait.id} className="p-5 border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <trait.icon className="h-5 w-5 text-slate-500" />
                  </div>
                  <Badge variant="outline" className={`border-none px-1 text-[10px] font-black ${trait.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trait.trend === 'up' ? '▲ GAINING' : '▼ DROPPING'}
                  </Badge>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{trait.name}</p>
                <p className="text-3xl font-black text-slate-900">{trait.score}%</p>
                <p className="text-[10px] text-slate-300 font-bold mt-1">IND: {trait.benchmark}%</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Employee Table */}
        <Card className="border-slate-200 rounded-2xl shadow-sm overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Workforce Behavioral Overview</h2>
              <p className="text-slate-500 text-sm">Soft-skill breakdown across all employees</p>
            </div>
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 border-slate-200 w-full sm:w-48" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-100">
                  <TableHead className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">Employee</TableHead>
                  <TableHead className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">Communication</TableHead>
                  <TableHead className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">Leadership</TableHead>
                  <TableHead className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">Resilience</TableHead>
                  <TableHead className="font-bold text-slate-700 text-[10px] uppercase tracking-widest text-right">Fitment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(emp => (
                  <TableRow key={emp.employeeId} className="cursor-pointer hover:bg-slate-50 h-14 border-slate-100 group"
                    onClick={() => setSelectedEmployee(emp)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[11px] text-slate-500">
                          {String(emp.name).split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 w-24">
                        <Progress value={emp.scores.skill} className="h-1.5" />
                        <span className="text-[10px] font-bold text-slate-400">{emp.scores.skill}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-none text-[10px] font-bold ${getScoreBadge(emp.scores.aptitude)}`}>
                        {getScoreLabel(emp.scores.aptitude)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${emp.scores.fatigue < 40 ? 'bg-blue-500' : emp.scores.fatigue < 70 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-slate-700">{100 - emp.scores.fatigue}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-blue-600 font-black text-sm">{emp.scores.fitment}%</span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-slate-400 py-8">No employees found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {selectedEmployee && (
        <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Router Component — Branch based on role
// ─────────────────────────────────────────────────────────────────────────────
export default function Softskills() {
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";
  return isEmployee ? <EmployeeSkillView /> : <ManagerSkillView />;
}

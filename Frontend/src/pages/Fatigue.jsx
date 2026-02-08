import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Users,
  Clock,
  Activity,
  Heart,
  AlertTriangle,
  Target,
  Zap,
  DollarSign,
  Info,
  CheckCircle2,
} from "lucide-react";
import { employees as initialEmployees, getFatigueRisk, getOverallRisk } from "@/data/mockEmployeeData";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import EmployeeDrawer from "@/components/EmployeeDrawer";

export default function Fatigue() {
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // State for interactivity
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'summary', 'metric', 'signal', 'action'
  const [modalData, setModalData] = useState(null);

  const centralEmployees = useMemo(() => {
    if (isEmployee) {
      return initialEmployees.filter(e => e.employeeId === user.employeeId);
    }
    return initialEmployees;
  }, [isEmployee, user]);

  const fatigueMetrics = useMemo(() => {
    const avgFatigue = centralEmployees.reduce((sum, e) => sum + e.scores.fatigue, 0) / centralEmployees.length;
    return {
      overallScore: Math.round(avgFatigue),
      riskLevel: avgFatigue >= 75 ? "CRITICAL" : avgFatigue >= 50 ? "HIGH" : "MEDIUM",
      trend: -5,
    };
  }, [centralEmployees]);

  const keyIndicators = useMemo(() => [
    {
      id: "utilization",
      title: "Workload Intensity",
      value: Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.utilization, 0) / centralEmployees.length),
      change: 12,
      changeType: "up",
      icon: Target,
      definition: "Average utilization rate across all assigned projects and tasks.",
      recommendation: "Consider redistributing high-priority tasks from overloaded teams."
    },
    {
      id: "overtime",
      title: "Overtime Frequency",
      value: 64, // Semi-mock
      change: 8,
      changeType: "up",
      icon: Clock,
      definition: "Percentage of employees reporting working hours beyond standard shifts.",
      recommendation: "Implement strictly enforced 'switch-off' hours for remote teams."
    },
    {
      id: "productivity",
      title: "Focus Consistency",
      value: Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.productivity, 0) / centralEmployees.length),
      change: 15,
      changeType: "down",
      icon: Activity,
      definition: "Measure of sustained attention and output consistency throughout the day.",
      recommendation: "Incorporate focus-blocks and reduce non-essential recurring meetings."
    },
    {
      id: "fatigue",
      title: "Stress Signals",
      value: Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.fatigue, 0) / centralEmployees.length),
      change: 9,
      changeType: "up",
      icon: Heart,
      definition: "AI-detected patterns in work habits indicating physiological or mental strain.",
      recommendation: "Schedule 1-on-1 wellness checks for high-risk flagged individuals."
    },
  ], [centralEmployees]);

  const employeeRisks = useMemo(() => {
    return [...centralEmployees]
      .sort((a, b) => b.scores.fatigue - a.scores.fatigue)
      .map(emp => ({
        ...emp,
        burnoutRisk: getFatigueRisk(emp.scores.fatigue).toUpperCase(),
      }));
  }, [centralEmployees]);

  const teamFatigue = useMemo(() => {
    const depts = [...new Set(centralEmployees.map(e => e.department))];
    return depts.map(dept => {
      const deptEmps = centralEmployees.filter(e => e.department === dept);
      const avgFatigue = deptEmps.reduce((sum, e) => sum + e.scores.fatigue, 0) / deptEmps.length;
      return {
        team: dept,
        fatigue: Math.round(avgFatigue),
        risk: avgFatigue >= 75 ? "CRITICAL" : avgFatigue >= 50 ? "HIGH" : "MEDIUM",
      };
    }).sort((a, b) => b.fatigue - a.fatigue);
  }, [centralEmployees]);

  const wellbeingSignals = useMemo(() => [
    {
      title: "High Burnout Risk",
      count: centralEmployees.filter(e => e.scores.fatigue >= 75).length,
      employees: centralEmployees.filter(e => e.scores.fatigue >= 75),
      factor: "Extended high utilization (>95%)",
      color: "red",
    },
    {
      title: "Low Engagement",
      count: centralEmployees.filter(e => e.scores.productivity < 65).length,
      employees: centralEmployees.filter(e => e.scores.productivity < 65),
      factor: "Repetitive task cycles",
      color: "yellow",
    },
    {
      title: "High Stress Exposure",
      count: centralEmployees.filter(e => e.scores.fatigue >= 50 && e.scores.fatigue < 75).length,
      employees: centralEmployees.filter(e => e.scores.fatigue >= 50 && e.scores.fatigue < 75),
      factor: "Irregular working patterns",
      color: "orange",
    },
    {
      title: "Low Recovery Time",
      count: centralEmployees.filter(e => e.scores.utilization > 90).length,
      employees: centralEmployees.filter(e => e.scores.utilization > 90),
      factor: "Back-to-back meeting loads",
      color: "blue",
    },
  ], [centralEmployees]);

  const recommendedActions = [
    {
      title: "Enforce No-Meeting Days",
      fteImpact: "2.5 FTE",
      fatigueReduction: "15%",
      productivityGain: "8%",
      cost: "$12K",
      employeesCount: centralEmployees.length,
    },
    {
      title: "Rotate On-Call Duties",
      fteImpact: "1.8 FTE",
      fatigueReduction: "12%",
      productivityGain: "6%",
      cost: "$8K",
      employeesCount: 12,
    },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case "CRITICAL": return "border-red-200 bg-red-50/50";
      case "HIGH": return "border-orange-200 bg-orange-50/50";
      case "MEDIUM": return "border-blue-200 bg-blue-50/50";
      case "LOW": return "border-green-200 bg-green-50/50";
      default: return "border-slate-200 bg-white";
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "CRITICAL": return "bg-red-100 text-red-700 border-red-200";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM": return "bg-blue-100 text-blue-700 border-blue-200";
      case "LOW": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-['Inter']">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fatigue Analysis</h1>
            <p className="text-slate-500 mt-1">Strategic workforce health and recovery monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 bg-white text-slate-700" onClick={() => toast({ title: "Refreshing Data", description: "Calculating latest fatigue vectors..." })}>
              <Activity className="mr-2 h-4 w-4" />
              Live Monitor
            </Button>
          </div>
        </div>

        {/* TOP BANNER */}
        {!isEmployee && (
          <Card
            className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 border-none rounded-2xl shadow-lg text-white cursor-pointer hover:shadow-xl transition-all group overflow-hidden relative"
            onClick={() => setActiveModal('summary')}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-500 rounded-lg animate-pulse">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-red-400 font-bold tracking-wider text-xs uppercase">AI Critical Focus</span>
                </div>
                <h2 className="text-3xl font-bold">Fatigue Risk Alert</h2>
                <p className="text-slate-300 max-w-xl text-lg">
                  <span className="text-white font-bold">{wellbeingSignals[0].count} employees</span> are showing high attrition risk patterns. Primary driver identified as <span className="text-slate-100 italic underline decoration-red-500">Chronic Over-utilization</span>.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all border border-white/10">
                <div className="text-right">
                  <p className="text-slate-300 text-sm">Action Required</p>
                  <p className="font-bold">View Intervention Plan</p>
                </div>
                <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute right-[-5%] top-[-50%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </Card>
        )}

        {/* HEALTH INDEX & METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card
            className="lg:col-span-4 p-8 bg-white border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
            onClick={() => {
              setActiveModal('metric');
              setModalData({
                title: "Health Index",
                value: fatigueMetrics.overallScore,
                risk: fatigueMetrics.riskLevel,
                definition: "Aggregate score calculating workforce sustainability across physical, tactical, and organizational dimensions.",
                recommendation: "Increase low-intensity tasks for Engineering team to stabilize recovery scores."
              });
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                  <circle
                    cx="80" cy="80" r="70" stroke={fatigueMetrics.riskLevel === 'CRITICAL' ? '#EF4444' : '#3B82F6'} strokeWidth="12" fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - fatigueMetrics.overallScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{fatigueMetrics.overallScore}</span>
                  <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Global Score</span>
                </div>
              </div>
              <div className="text-center w-full">
                <Badge className={`px-4 py-1 text-sm font-bold mb-3 ${getRiskBadge(fatigueMetrics.riskLevel)}`}>
                  {fatigueMetrics.riskLevel} Fatigue Level
                </Badge>
                <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>Dropped <span className="text-red-600 font-bold">{Math.abs(fatigueMetrics.trend)} pts</span> vs last cycle</span>
                  <Info className="h-4 w-4 text-slate-300 ml-1 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyIndicators.map((indicator) => (
              <Card
                key={indicator.id}
                className="p-6 bg-white border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => {
                  setActiveModal('metric');
                  setModalData(indicator);
                }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className={`p-4 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors`}>
                    <indicator.icon className="h-6 w-6 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <Badge className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${indicator.changeType === 'up' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {indicator.changeType === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {indicator.change}% Delta
                  </Badge>
                </div>
                <div className="mt-8 relative z-10">
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-none mb-1">{indicator.title}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-slate-900 tracking-tight leading-none">{indicator.value}%</p>
                    <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mb-1" />
                  </div>
                </div>
                {/* Subtle card background pattern */}
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <indicator.icon className="h-24 w-24" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RISK MATRIX TABLE */}
        <Card className="border-slate-200 rounded-2xl shadow-sm overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Employee Fatigue Risk Matrix</h2>
              <p className="text-slate-500 text-sm">Individual assessment sorted by intensity</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">7 High Risk</Badge>
              <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">12 Warning</Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Employee</TableHead>
                  <TableHead className="font-bold text-slate-700">Workload</TableHead>
                  <TableHead className="font-bold text-slate-700">Stress Vector</TableHead>
                  <TableHead className="font-bold text-slate-700">Focus Profile</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Sustainability Score</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeRisks.map((emp) => (
                  <TableRow
                    key={emp.employeeId}
                    className="cursor-pointer hover:bg-slate-50/80 transition-colors group h-16 border-slate-100"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 group-hover:bg-white group-hover:border-blue-300 transition-colors">
                          {emp.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{emp.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{emp.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5 min-w-[120px]">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Utilization</span>
                          <span>{emp.scores.utilization}%</span>
                        </div>
                        <Progress value={emp.scores.utilization} className="h-1.5" indicatorClassName={emp.scores.utilization > 90 ? 'bg-red-500' : 'bg-slate-300'} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${emp.scores.fatigue > 75 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : emp.scores.fatigue > 50 ? 'bg-orange-500' : 'bg-green-500'}`} />
                        <span className="font-bold text-slate-700">{emp.scores.fatigue}% Intensity</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-bold border-none ${emp.scores.productivity > 80 ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {emp.scores.productivity > 80 ? 'SUSTAINED' : 'ERRATIC'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black text-slate-900 tabular-nums">
                      {100 - emp.scores.fatigue}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={`font-black tracking-widest text-[10px] uppercase border px-2.5 py-0.5 ${getRiskBadge(emp.burnoutRisk)}`}>
                        {emp.burnoutRisk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* TEAM & DEPARTMENT FATIGUE */}
        {!isEmployee && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-slate-400" />
              Organizational Intensity Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamFatigue.map((team) => (
                <Card
                  key={team.team}
                  className={`p-6 border-l-4 rounded-xl shadow-sm hover:scale-[1.02] transition-all cursor-pointer bg-white group ${team.risk === 'CRITICAL' ? 'border-l-red-500 hover:border-red-300' : team.risk === 'HIGH' ? 'border-l-orange-500 hover:border-orange-300' : 'border-l-blue-500 hover:border-blue-300'}`}
                  onClick={() => navigate(`/employees?department=${team.team}&risk=fatigue`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">{team.team}</h3>
                    <Badge className={`font-bold tabular-nums ${getRiskBadge(team.risk)}`}>
                      {team.risk}
                    </Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{team.fatigue}%</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Avg Fatigue</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors">
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* WELLBEING SIGNALS */}
        {!isEmployee && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-6 w-6 text-slate-400" />
              Strategic Fatigue Vectors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wellbeingSignals.map((signal) => (
                <Card
                  key={signal.title}
                  className={`p-6 border rounded-2xl shadow-sm transition-all cursor-pointer hover:shadow-md hover:translate-y-[-4px] overflow-hidden relative group border-slate-200 bg-white`}
                  onClick={() => {
                    setActiveModal('signal');
                    setModalData(signal);
                  }}
                >
                  <div className="text-center relative z-10">
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-none mb-3">{signal.title}</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">{signal.count}</p>
                    <p className="text-xs text-slate-400 italic">Identified Drivers →</p>
                  </div>
                  {/* Visual Background indicator */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${signal.color === 'red' ? 'bg-red-500' : signal.color === 'yellow' ? 'bg-yellow-500' : signal.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI RECOMMENDED ACTIONS */}
        {!isEmployee && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Brain className="h-6 w-6 text-slate-400" />
              AI Adaptive Mitigation Strategies
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendedActions.map((action) => (
                <Card key={action.title} className="p-8 bg-white border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 transition-all group overflow-hidden relative">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6 relative z-10">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-500 rounded-full" />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{action.title}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Gain</p>
                          <p className="text-xl font-black text-green-600">{action.productivityGain}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sustainability</p>
                          <p className="text-xl font-black text-blue-600">+{action.fatigueReduction}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col gap-3">
                      <div className="p-4 bg-slate-900 rounded-xl text-center text-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Cost Factor</p>
                        <p className="text-2xl font-black italic">{action.cost}</p>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-blue-200"
                        onClick={() => {
                          setActiveModal('action');
                          setModalData(action);
                        }}
                      >
                        Apply Strategy
                      </Button>
                    </div>
                  </div>
                  {/* Decorative icon background */}
                  <Brain className="absolute right-[-20px] top-[-20px] h-32 w-32 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Summary Modal */}
      <Dialog open={activeModal === 'summary'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Fatigue Vector Summary</DialogTitle>
            <DialogDescription className="text-slate-500">AI-driven breakdown of critical workforce health signals.</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Risk Level</p>
                <p className="text-xl font-black text-red-800">CRITICAL</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacted</p>
                <p className="text-xl font-black text-slate-800">{wellbeingSignals[0].count} Emps</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Proj. Attrition</p>
                <p className="text-xl font-black text-blue-800">12.5%</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Primary Recovery Obstacles</h4>
              <ul className="space-y-3 font-medium text-slate-700">
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                  <span>Engineering team averaging <span className="text-red-600 font-bold">58 hours/week</span> (threshold 45).</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0" />
                  <span>Interrupted sleep patterns detected via erratic meeting responses after 10PM.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0" />
                  <span>High context-switching (average 14 app shifts per hour).</span>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-4">Critical Personnel</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {wellbeingSignals[0].employees.map(emp => (
                  <div key={emp.employeeId} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="font-bold text-slate-800">{emp.name}</span>
                    <Badge className="bg-red-100 text-red-600 border-red-200">{emp.scores.fatigue}% Fatigue</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-slate-900 hover:bg-black text-white" onClick={() => navigate("/optimization")}>
              Launch Mitigation Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Metric Detail Modal */}
      <Dialog open={activeModal === 'metric'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">{modalData?.title} Profile</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Metric</p>
                <p className="text-4xl font-black text-slate-900">{modalData?.value}%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Risk Status</p>
                <Badge className={getRiskBadge(modalData?.risk || (modalData?.value > 75 ? 'CRITICAL' : modalData?.value > 50 ? 'HIGH' : 'MEDIUM'))}>
                  {modalData?.risk || (modalData?.value > 75 ? 'Critical' : modalData?.value > 50 ? 'High' : 'Normal')}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Metric Definition
                </h4>
                <p className="text-sm text-blue-800/80 leading-relaxed font-medium">{modalData?.definition}</p>
              </div>

              <div className="p-4 rounded-xl border border-green-100 bg-green-50/50">
                <h4 className="font-bold text-green-900 text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Strategic Recommendation
                </h4>
                <p className="text-sm text-green-800/80 leading-relaxed font-medium">{modalData?.recommendation}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700" onClick={() => navigate("/analytics")}>
                View Full Departmental Breakdown
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signal / Vector Modal */}
      <Dialog open={activeModal === 'signal'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">{modalData?.title} Intelligence</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="p-6 bg-slate-900 rounded-2xl text-white text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Affected Population</p>
              <p className="text-6xl font-black tracking-tighter">{modalData?.count}</p>
              <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">Global Asset Count</p>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dominant Contributing Factor</h4>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="font-black text-orange-900 italic text-lg">{modalData?.factor}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Personnel Summary</h4>
                <div className="grid grid-cols-2 gap-2">
                  {modalData?.employees.slice(0, 6).map(emp => (
                    <div key={emp.employeeId} className="p-3 border border-slate-100 rounded-lg text-sm font-bold text-slate-700 flex justify-between bg-slate-50/50">
                      <span>{emp.name}</span>
                      <span className="text-slate-400">{emp.department[0]}</span>
                    </div>
                  ))}
                  {modalData?.count > 6 && (
                    <div className="col-span-2 p-2 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                      + {modalData.count - 6} more individuals
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full bg-slate-900 hover:bg-black text-white" onClick={() => navigate("/employees")}>
                Filter Global Directory
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Modal */}
      <Dialog open={activeModal === 'action'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Execute Strategy?</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="p-3 bg-blue-500 rounded-xl text-white">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-black text-blue-900">{modalData?.title}</h4>
                <p className="text-xs text-blue-700 font-bold uppercase tracking-widest">Adaptive Mitigation Protocol</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold text-sm">Affected Workforce</span>
                <span className="font-black text-slate-900">{modalData?.employeesCount} Employees</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold text-sm">Expected Impact</span>
                <span className="font-black text-green-600">-{modalData?.fatigueReduction} Fatigue</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold text-sm">Productivity Lock</span>
                <span className="font-black text-blue-600">+{modalData?.productivityGain} Gain</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl italic text-sm text-slate-600 leading-relaxed border border-slate-200">
              "This strategy will automate recurring notification suppressions and block calendars for affected teams during peak focus cycles."
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={() => {
              toast({ title: "Strategy Deployed", description: `${modalData.title} is now active.` });
              setActiveModal(null);
            }}>
              Confirm & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Drawer Integration */}
      <EmployeeDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}

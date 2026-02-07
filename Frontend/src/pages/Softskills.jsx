import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brain,
  MessageCircle,
  Users,
  Shield,
  Heart,
  Zap,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  Filter,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { employees as initialEmployees, getOverallRisk } from "@/data/mockEmployeeData";
import { useAuth } from "@/lib/auth";

export default function Softskills() {
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";

  const centralEmployees = useMemo(() => {
    if (isEmployee) {
      return initialEmployees.filter(e => e.employeeId === user.employeeId);
    }
    return initialEmployees;
  }, [isEmployee, user]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const teamHealth = useMemo(() => {
    const avgSkill = centralEmployees.reduce((sum, e) => sum + e.scores.skill, 0) / centralEmployees.length;
    return {
      score: Math.round(avgSkill),
      max: 100,
      skills: [
        { name: "Communication", level: "Strong", color: "bg-green-500" },
        { name: "Emotional Intelligence", level: "Strong", color: "bg-green-500" },
        { name: "Collaboration", level: "Medium", color: "bg-yellow-500" },
        { name: "Stress Resilience", level: "Medium", color: "bg-yellow-500" },
        { name: "Leadership", level: "Strong", color: "bg-green-500" },
      ],
    };
  }, []);

  const traits = useMemo(() => {
    return [
      { name: "Communication", score: Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.skill, 0) / centralEmployees.length), benchmark: 72, trend: "up", icon: MessageCircle },
      { name: "Teamwork", score: 82, benchmark: 80, trend: "up", icon: Users },
      { name: "Leadership", score: Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.aptitude, 0) / centralEmployees.length), benchmark: 75, trend: "up", icon: Shield },
      { name: "Empathy", score: 85, benchmark: 82, trend: "up", icon: Heart },
      { name: "Stress Resilience", score: 100 - Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.fatigue, 0) / centralEmployees.length), benchmark: 79, trend: "down", icon: Zap },
      { name: "Learning Agility", score: Math.round(centralEmployees.reduce((sum, e) => sum + e.scores.aptitude, 0) / centralEmployees.length), benchmark: 85, trend: "up", icon: Brain },
    ];
  }, []);

  const riskSignals = useMemo(() => {
    const highBurnout = centralEmployees.filter(e => e.scores.fatigue > 80);
    const lowLeadership = centralEmployees.filter(e => e.scores.aptitude < 60);
    const traineeCandidates = centralEmployees.filter(e => e.scores.fitment < 70);

    return [
      { title: "High Burnout Risk", count: highBurnout.length, employees: highBurnout.slice(0, 3).map(e => `${e.name} (${e.scores.fatigue}%)`) },
      { title: "Skill Gap Alert", count: traineeCandidates.length, employees: traineeCandidates.slice(0, 3).map(e => `${e.name} (${e.scores.fitment}%)`) },
      { title: "Low Leadership Score", count: lowLeadership.length, employees: lowLeadership.slice(0, 3).map(e => `${e.name} (${e.scores.aptitude}%)`) },
      { title: "Critical Attrition", count: 2, employees: ["Sarah Johnson", "Ramesh Kumar"] },
    ];
  }, []);

  const recommendations = useMemo(() => {
    const promoReady = centralEmployees.filter(e => e.scores.fitment > 90);
    const coachingReq = centralEmployees.filter(e => e.scores.fatigue > 70);
    return [
      { title: "Promotion Ready", employees: promoReady.slice(0, 3).map(e => e.name) },
      { title: "Coaching Required", employees: coachingReq.slice(0, 3).map(e => e.name) },
      { title: "Role Reassignment", employees: ["James Wilson", "Robert Taylor"] },
      { title: "Leadership Pipeline", employees: ["Priya Sharma", "Sarah Johnson"] },
    ];
  }, []);

  const employeesWithMeta = useMemo(() => {
    return centralEmployees.map(e => {
      const risk = getOverallRisk(e);
      return {
        ...e,
        id: e.employeeId,
        role: e.position,
        personality: "INTJ-A", // Keeping some placeholder meta for visuals
        communication: e.scores.skill,
        leadership: e.scores.aptitude,
        stress: e.scores.fatigue,
        teamRisk: Math.round(e.scores.fatigue * 0.4),
        riskFlag: risk.toLowerCase(),
        avatar: `https://i.pravatar.cc/40?u=${e.employeeId}`,
        workStyle: "Collaborative",
        motivation: "Innovation",
        burnoutRisk: e.scores.fatigue > 70 ? "High" : e.scores.fatigue > 40 ? "Medium" : "Low",
        conflictRisk: "Low",
        attritionRisk: e.scores.fatigue > 80 ? "High" : "Low",
        currentFit: e.scores.fitment,
        managerFit: Math.min(100, e.scores.fitment + 5),
        clientFit: Math.min(100, e.scores.skill + 2),
        leadershipFit: e.scores.aptitude,
        strengths: e.skills.hard.join(", "),
        risks: e.scores.fatigue > 75 ? "High fatigue levels" : "None detected",
        development: "Leadership tracks",
      };
    });
  }, []);

  const filteredEmployees = useMemo(() => {
    return employeesWithMeta.filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || emp.riskFlag === filter)
    );
  }, [search, filter, employeesWithMeta]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsProfileOpen(true);
  };

  const getRiskColor = (flag) => {
    switch (flag) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskIcon = (flag) => {
    switch (flag) {
      case "low": return <CheckCircle className="w-4 h-4" />;
      case "medium": return <Clock className="w-4 h-4" />;
      case "high": return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Inter']">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Soft Skills Intelligence</h1>
            <p className="text-gray-600 mt-2">Behavioral, cognitive and leadership insights powered by MayaMaya</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* AI Behavioral Summary */}
        {!isEmployee && (
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                AI Behavioral Summary
                <Badge variant="secondary" className="ml-2">Based on current workforce dataset</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p>
                The current workforce demonstrates a resilient core with an average skill score of {teamHealth.score}%.
                While leadership potential is strong ({traits[2].score}%), we are monitoring {riskSignals[0].count} high-burnout cases
                that could impact overall team stability if unaddressed.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Team Soft Skills Health */}
        {!isEmployee && (
          <Card>
            <CardHeader>
              <CardTitle>Team Soft Skills Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle
                        cx="48" cy="48" r="36" stroke="#3b82f6" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - teamHealth.score / teamHealth.max)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{teamHealth.score}</div>
                        <div className="text-xs text-gray-500">avg</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Global Workforce Health</h3>
                    <p className="text-sm text-gray-600">Composite soft skill performance</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {teamHealth.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${skill.color}`}></div>
                        <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      </div>
                      <Badge variant={skill.level === "Strong" ? "default" : "secondary"} className="text-xs">
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trait Benchmark Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {traits.map((trait, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <trait.icon className="w-5 h-5 text-blue-600" />
                  {trait.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <h4 className="text-xs font-semibold text-gray-600 mb-1">{trait.name}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{trait.score}%</div>
                <p className="text-[10px] text-gray-400">Industry: {trait.benchmark}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employee Assessment Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Assessment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leadership</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatigue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Flag</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEmployeeClick(emp)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase mr-3">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                            <div className="text-xs text-gray-500">{emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.communication}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.leadership}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.stress}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getRiskColor(emp.riskFlag)}>
                          {getRiskIcon(emp.riskFlag)}
                          <span className="ml-1 capitalize">{emp.riskFlag}</span>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Risk & Talent Signals */}
        {!isEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riskSignals.map((signal, index) => (
              <Card key={index} className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{signal.title}</h4>
                  <div className="text-2xl font-bold text-red-600 mb-3">{signal.count}</div>
                  <ul className="space-y-1">
                    {signal.employees.map((emp, idx) => (
                      <li key={idx} className="text-xs text-gray-600">{emp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* AI Coaching & Workforce Recommendations */}
        {!isEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">{rec.title}</h4>
                  <ul className="space-y-2">
                    {rec.employees.map((emp, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {emp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Employee Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Behavioral Intelligence Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-600">{selectedEmployee.role}</p>
                  <p className="text-sm text-gray-500 font-mono text-xs">{selectedEmployee.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase text-gray-500 tracking-wider">Fitment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-blue-600">{selectedEmployee.scores.fitment}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase text-gray-500 tracking-wider">Fatigue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-black ${selectedEmployee.scores.fatigue > 75 ? 'text-red-600' : 'text-slate-900'}`}>{selectedEmployee.scores.fatigue}%</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold">Behavioral Assessment Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedEmployee.scores).filter(([k]) => ['skill', 'aptitude', 'productivity', 'utilization'].includes(k)).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-1">
                        <span>{key}</span>
                        <span>{val}%</span>
                      </div>
                      <Progress value={val} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold text-blue-700">AI Logic Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-sm italic text-gray-600 border-l-4 border-blue-500 pl-4 bg-blue-50 py-3">
                  "Individual shows strong capability in {selectedEmployee.strengths}. Recommendation: focus on {selectedEmployee.development}."
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Assign Growth Module</Button>
                <Button variant="outline" className="flex-1">Initiate Review</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

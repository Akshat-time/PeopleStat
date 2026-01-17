import React, { useState } from "react";
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

// Mock data
const teamHealth = {
  score: 80,
  max: 100,
  skills: [
    { name: "Communication", level: "Strong", color: "bg-green-500" },
    { name: "Emotional Intelligence", level: "Strong", color: "bg-green-500" },
    { name: "Collaboration", level: "Medium", color: "bg-yellow-500" },
    { name: "Stress Resilience", level: "Medium", color: "bg-yellow-500" },
    { name: "Leadership", level: "Strong", color: "bg-green-500" },
  ],
};

const traits = [
  { name: "Communication", score: 78, benchmark: 75, trend: "up", icon: MessageCircle },
  { name: "Teamwork", score: 82, benchmark: 80, trend: "up", icon: Users },
  { name: "Leadership", score: 74, benchmark: 78, trend: "down", icon: Shield },
  { name: "Empathy", score: 85, benchmark: 82, trend: "up", icon: Heart },
  { name: "Stress Resilience", score: 76, benchmark: 79, trend: "down", icon: Zap },
  { name: "Learning Agility", score: 88, benchmark: 85, trend: "up", icon: Brain },
];

const employees = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    role: "Senior Developer",
    personality: "INTJ-A",
    communication: 92,
    leadership: 85,
    stress: 78,
    teamRisk: 15,
    riskFlag: "low",
    avatar: "https://i.pravatar.cc/40?img=1",
    department: "Engineering",
    workStyle: "Analytical, Independent",
    motivation: "Problem-solving, Innovation",
    burnoutRisk: "Low",
    conflictRisk: "Medium",
    attritionRisk: "Low",
    currentFit: 88,
    managerFit: 82,
    clientFit: 75,
    leadershipFit: 90,
    strengths: "Technical expertise, Problem-solving",
    risks: "Communication in team settings",
    development: "Leadership training, Team collaboration",
  },
  {
    id: "EMP002",
    name: "Mike Chen",
    role: "Product Manager",
    personality: "ENFP-T",
    communication: 88,
    leadership: 92,
    stress: 65,
    teamRisk: 25,
    riskFlag: "medium",
    avatar: "https://i.pravatar.cc/40?img=2",
    department: "Product",
    workStyle: "Creative, Collaborative",
    motivation: "User impact, Innovation",
    burnoutRisk: "Medium",
    conflictRisk: "Low",
    attritionRisk: "Medium",
    currentFit: 85,
    managerFit: 95,
    clientFit: 90,
    leadershipFit: 88,
    strengths: "User empathy, Strategic thinking",
    risks: "Stress management",
    development: "Stress resilience, Time management",
  },
  {
    id: "EMP003",
    name: "Emily Rodriguez",
    role: "HR Specialist",
    personality: "ISFJ-A",
    communication: 95,
    leadership: 78,
    stress: 82,
    teamRisk: 10,
    riskFlag: "low",
    avatar: "https://i.pravatar.cc/40?img=3",
    department: "HR",
    workStyle: "Supportive, Detail-oriented",
    motivation: "Helping others, Stability",
    burnoutRisk: "Low",
    conflictRisk: "Low",
    attritionRisk: "Low",
    currentFit: 92,
    managerFit: 85,
    clientFit: 88,
    leadershipFit: 80,
    strengths: "Empathy, Organization",
    risks: "Leadership confidence",
    development: "Leadership skills, Public speaking",
  },
];

const riskSignals = [
  { title: "High Burnout Risk", count: 3, employees: ["Mike Chen (65%)", "David Lee (62%)", "Anna Kim (58%)"] },
  { title: "Low Leadership Readiness", count: 5, employees: ["John Smith (45%)", "Lisa Wong (52%)", "Tom Brown (48%)"] },
  { title: "High Conflict Risk", count: 2, employees: ["Sarah Davis (78%)", "Mark Johnson (72%)"] },
  { title: "Low Adaptability", count: 4, employees: ["Emma Wilson (35%)", "Chris Taylor (42%)", "Nina Patel (38%)"] },
];

const recommendations = [
  { title: "Promotion Ready", employees: ["Sarah Johnson", "Emily Rodriguez"] },
  { title: "Coaching Required", employees: ["Mike Chen", "David Lee"] },
  { title: "Role Reassignment", employees: ["Anna Kim", "John Smith"] },
  { title: "Leadership Pipeline", employees: ["Lisa Wong", "Tom Brown"] },
];

export default function Softskills() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || emp.riskFlag === filter)
  );

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              AI Behavioral Summary
              <Badge variant="secondary" className="ml-2">Based on MayaMaya Assessment Data</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              Our team demonstrates strong communication and empathy capabilities, with solid leadership potential across most roles.
              However, stress resilience varies significantly, with some team members showing elevated burnout risk indicators.
              Collaboration patterns are generally positive, though conflict resolution skills could be enhanced through targeted training.
            </p>
          </CardContent>
        </Card>

        {/* Team Soft Skills Health */}
        <Card>
          <CardHeader>
            <CardTitle>Team Soft Skills Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - teamHealth.score / teamHealth.max)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{teamHealth.score}</div>
                      <div className="text-xs text-gray-500">out of {teamHealth.max}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Strong Overall Health</h3>
                  <p className="text-sm text-gray-600">Composite score across all soft skills</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {teamHealth.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
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
                <h4 className="text-sm font-medium text-gray-900 mb-1">{trait.name}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{trait.score}/100</div>
                <p className="text-xs text-gray-500">Industry: {trait.benchmark}/100</p>
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
            {/* Filters */}
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
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leadership</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Flag</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEmployeeClick(emp)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full" src={emp.avatar} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                            <div className="text-sm text-gray-500">{emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.personality}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.communication}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.leadership}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.stress}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.teamRisk}%</td>
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

            {/* Pagination */}
            <div className="px-6 py-3 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing 1 to {filteredEmployees.length} of {filteredEmployees.length} results
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">1</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk & Talent Signals */}
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

        {/* AI Coaching & Workforce Recommendations */}
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
      </div>

      {/* Employee Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-4">
                <img className="h-16 w-16 rounded-full" src={selectedEmployee.avatar} alt="" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-600">{selectedEmployee.role}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                </div>
              </div>

              {/* Personality Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">MayaMaya Personality Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Type:</span> {selectedEmployee.personality}
                  </div>
                  <div>
                    <span className="font-medium">Work Style:</span> {selectedEmployee.workStyle}
                  </div>
                  <div>
                    <span className="font-medium">Motivation Drivers:</span> {selectedEmployee.motivation}
                  </div>
                </CardContent>
              </Card>

              {/* Behavioral Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Behavioral Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Communication</span>
                      <span>{selectedEmployee.communication}%</span>
                    </div>
                    <Progress value={selectedEmployee.communication} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Empathy</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Leadership</span>
                      <span>{selectedEmployee.leadership}%</span>
                    </div>
                    <Progress value={selectedEmployee.leadership} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Collaboration</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stress Tolerance</span>
                      <span>{selectedEmployee.stress}%</span>
                    </div>
                    <Progress value={selectedEmployee.stress} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Adaptability</span>
                      <span>79%</span>
                    </div>
                    <Progress value={79} />
                  </div>
                </CardContent>
              </Card>

              {/* Leadership Readiness */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Leadership Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">85/100</div>
                  <Badge className="bg-green-100 text-green-800">Ready in 6 months</Badge>
                </CardContent>
              </Card>

              {/* Risk Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Risk Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Burnout Risk</span>
                    <Badge className={selectedEmployee.burnoutRisk === "Low" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {selectedEmployee.burnoutRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Conflict Risk</span>
                    <Badge className={selectedEmployee.conflictRisk === "Low" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {selectedEmployee.conflictRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Attrition Risk</span>
                    <Badge className={selectedEmployee.attritionRisk === "Low" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {selectedEmployee.attritionRisk}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Role Fitment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Soft Skills Role Fitment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Role Fit</span>
                    <span className="font-medium">{selectedEmployee.currentFit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manager Role Fit</span>
                    <span className="font-medium">{selectedEmployee.managerFit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client-Facing Fit</span>
                    <span className="font-medium">{selectedEmployee.clientFit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Future Leadership Fit</span>
                    <span className="font-medium">{selectedEmployee.leadershipFit}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI-Generated Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Strengths</h5>
                    <p className="text-sm text-gray-600">{selectedEmployee.strengths}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700 mb-1">Risks</h5>
                    <p className="text-sm text-gray-600">{selectedEmployee.risks}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-700 mb-1">Recommended Development Focus</h5>
                    <p className="text-sm text-gray-600">{selectedEmployee.development}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Assign Coach</Button>
                <Button variant="outline" className="flex-1">Enroll in Leadership Track</Button>
                <Button variant="outline" className="flex-1">Flag as Succession Candidate</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
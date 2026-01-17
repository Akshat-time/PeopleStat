import { useState } from "react";
import {
  Users,
  AlertTriangle,
  Search,
  Filter,
  Download,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Eye,
  ChevronRight,
  Zap,
  Target,
  Activity,
  Heart,
  ArrowRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import EmployeeDrawer from "@/components/EmployeeDrawer";

// ---------------- MOCK DATA ----------------
const employees = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    role: "Senior Developer",
    department: "Engineering",
    fitment: 92,
    productivity: 88,
    utilization: 94,
    risk: "LOW",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "EMP002",
    name: "David Martinez",
    role: "Product Manager",
    department: "Product",
    fitment: 76,
    productivity: 72,
    utilization: 68,
    risk: "MEDIUM",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "EMP003",
    name: "Emily Chen",
    role: "UX Designer",
    department: "Design",
    fitment: 89,
    productivity: 91,
    utilization: 87,
    risk: "LOW",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "EMP004",
    name: "James Wilson",
    role: "Data Analyst",
    department: "Analytics",
    fitment: 64,
    productivity: 58,
    utilization: 52,
    risk: "HIGH",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "EMP005",
    name: "Lisa Anderson",
    role: "Marketing Specialist",
    department: "Marketing",
    fitment: 85,
    productivity: 82,
    utilization: 79,
    risk: "LOW",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    id: "EMP006",
    name: "Robert Taylor",
    role: "DevOps Engineer",
    department: "Engineering",
    fitment: 94,
    productivity: 96,
    utilization: 98,
    risk: "HIGH",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
  {
    id: "EMP007",
    name: "Maria Garcia",
    role: "HR Manager",
    department: "HR",
    fitment: 78,
    productivity: 75,
    utilization: 71,
    risk: "MEDIUM",
    avatar: "https://randomuser.me/api/portraits/women/52.jpg",
  },
  {
    id: "EMP008",
    name: "Michael Brown",
    role: "Sales Lead",
    department: "Sales",
    fitment: 81,
    productivity: 84,
    utilization: 88,
    risk: "LOW",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: "EMP009",
    name: "Kevin Lee",
    role: "QA Engineer",
    department: "Engineering",
    fitment: 73,
    productivity: 69,
    utilization: 65,
    risk: "MEDIUM",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
  },
  {
    id: "EMP010",
    name: "Jennifer White",
    role: "Content Writer",
    department: "Marketing",
    fitment: 56,
    productivity: 52,
    utilization: 48,
    risk: "HIGH",
    avatar: "https://randomuser.me/api/portraits/women/53.jpg",
  },
];

const kpiCards = [
  {
    title: "Total Employees",
    value: "247",
    delta: "+8%",
    deltaType: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Avg Fitment Score",
    value: "82.4%",
    delta: "+12%",
    deltaType: "up",
    icon: Target,
    color: "green",
  },
  {
    title: "High Performers",
    value: "42",
    delta: "+5%",
    deltaType: "up",
    icon: TrendingUp,
    color: "purple",
  },
  {
    title: "Low Utilization",
    value: "18",
    delta: "-3%",
    deltaType: "down",
    icon: Activity,
    color: "orange",
  },
  {
    title: "High Fatigue Risk",
    value: "12",
    delta: "+15%",
    deltaType: "up",
    icon: Heart,
    color: "red",
  },
];

// ---------------- PAGE ----------------
export default function Employees() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFitmentColor = (score) => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "HIGH": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "MEDIUM": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Eye className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-['Inter']">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-[#0F172A]">Employees</h1>
            <p className="text-[#64748B] mt-1">
              Monitor and manage workforce performance and wellbeing
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-[#E5E7EB] text-[#0F172A]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* AI WORKFORCE INSIGHT BANNER */}
        <Card className="p-6 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border-[#E5E7EB] rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2563EB] rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A]">AI Workforce Insights</h3>
                <p className="text-[#64748B] mt-1">
                  3 employees showing signs of high fatigue risk. 5 employees are underutilized and ready for additional responsibilities. Consider redistributing workload to optimize team performance.
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF]">
              View Recommendations
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* KPI CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((card, index) => (
            <Card key={index} className="p-4 bg-white border-[#E5E7EB] rounded-xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <Badge className={`text-xs font-medium ${
                  card.deltaType === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {card.deltaType === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {card.delta}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${
                  card.color === 'blue' ? 'bg-blue-100' :
                  card.color === 'green' ? 'bg-green-100' :
                  card.color === 'purple' ? 'bg-purple-100' :
                  card.color === 'orange' ? 'bg-orange-100' :
                  'bg-red-100'
                }`}>
                  <card.icon className={`h-5 w-5 ${
                    card.color === 'blue' ? 'text-blue-600' :
                    card.color === 'green' ? 'text-green-600' :
                    card.color === 'purple' ? 'text-purple-600' :
                    card.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] font-medium">{card.title}</p>
                <p className="text-2xl font-semibold text-[#0F172A] mt-1">{card.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* WORKFORCE OVERVIEW TABLE + RIGHT SIDEBAR */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* TABLE */}
          <Card className="xl:col-span-3 p-6 bg-white border-[#E5E7EB] rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#0F172A]">Workforce Overview</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-9 w-64 border-[#E5E7EB]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-[#E5E7EB]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC]">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="p-3 text-left font-medium text-[#0F172A]">Employee</th>
                  <th className="p-3 font-medium text-[#0F172A]">Role</th>
                  <th className="p-3 font-medium text-[#0F172A]">Department</th>
                  <th className="p-3 font-medium text-[#0F172A]">Fitment</th>
                  <th className="p-3 font-medium text-[#0F172A]">Productivity</th>
                  <th className="p-3 font-medium text-[#0F172A]">Utilization %</th>
                  <th className="p-3 font-medium text-[#0F172A]">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 10).map((e) => (
                  <tr key={e.id} className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] cursor-pointer" onClick={() => setSelectedEmployee(e)}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={e.avatar} className="h-10 w-10 rounded-full" />
                        <div>
                          <p className="font-medium text-[#0F172A]">{e.name}</p>
                          <p className="text-xs text-[#64748B]">{e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#0F172A]">{e.role}</td>
                    <td className="p-3 text-[#0F172A]">{e.department}</td>
                    <td className="p-3">
                      <Badge className={`font-medium ${getFitmentColor(e.fitment)}`}>
                        {e.fitment}%
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Progress value={e.productivity} className="w-20" />
                    </td>
                    <td className="p-3 font-medium text-[#0F172A]">{e.utilization}%</td>
                    <td className="p-3">
                      {getRiskIcon(e.risk)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-6">
              <Button variant="link" className="text-[#2563EB] hover:text-[#1D4ED8]">
                View All Employees
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* AI WORKFORCE ALERTS */}
            <Card className="p-4 bg-white border-[#E5E7EB] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#0F172A] mb-4">AI Workforce Alerts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">🔴</span>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">High Burnout Risk</p>
                      <p className="text-xs text-[#64748B]">Robert Taylor (98% capacity for 3 weeks)</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">🟠</span>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Low Fitment Alert</p>
                      <p className="text-xs text-[#64748B]">James Wilson at 64%</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">🔵</span>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Underutilized Talent</p>
                      <p className="text-xs text-[#64748B]">Jennifer White at 56%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* TOP 3 AT-RISK EMPLOYEES */}
            <Card className="p-4 bg-white border-[#E5E7EB] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#0F172A] mb-4">Top 3 At-Risk Employees</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-[#0F172A]">Robert Taylor</span>
                  <Badge className="bg-red-100 text-red-800">HIGH</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-[#0F172A]">James Wilson</span>
                  <Badge className="bg-yellow-100 text-yellow-800">MED</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-[#0F172A]">David Martinez</span>
                  <Badge className="bg-yellow-100 text-yellow-800">MED</Badge>
                </div>
              </div>
            </Card>

            {/* PROMOTION-READY */}
            <Card className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#0F172A] mb-3">Promotion-Ready</h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-[#0F172A]">Sarah Johnson → Tech Lead</p>
                <p className="text-sm text-[#0F172A]">Emily Chen → Senior Designer</p>
              </div>
              <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-100">
                View All Candidates
              </Button>
            </Card>
          </div>
        </div>

        {/* DRAWER */}
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      </div>
    </div>
  );
}

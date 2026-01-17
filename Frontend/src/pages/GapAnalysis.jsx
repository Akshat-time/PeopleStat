import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Download,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const employees = [
  {
    id: 1,
    name: "Raviteja",
    role: "Business Development",
    department: "Sales",
    gaps: 2,
    severity: "High",
    aiScore: 62,
  },
  {
    id: 2,
    name: "Anjali Verma",
    role: "Frontend Developer",
    department: "Engineering",
    gaps: 1,
    severity: "Low",
    aiScore: 88,
  },
  {
    id: 3,
    name: "Rahul Sharma",
    role: "Data Analyst",
    department: "Analytics",
    gaps: 3,
    severity: "Medium",
    aiScore: 71,
  },
];

const barData = [
  { name: "Raviteja", gaps: 2 },
  { name: "Anjali", gaps: 1 },
  { name: "Rahul", gaps: 3 },
];

const donutData = [
  { name: "High", value: 1 },
  { name: "Medium", value: 1 },
  { name: "Low", value: 1 },
];

const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

/* ---------------- COMPONENT ---------------- */

export default function GapAnalysis() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gap Analysis</h1>
          <p className="text-muted-foreground">
            Skill, performance & development gaps across employees
          </p>
        </div>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employee or role..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gap Count by Employee</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="gaps" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gap Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Gap Overview</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3">Role</th>
                <th className="p-3">Skill Gaps</th>
                <th className="p-3">Severity</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3">{e.role}</td>
                  <td className="p-3">{e.gaps}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        e.severity === "High"
                          ? "destructive"
                          : e.severity === "Medium"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {e.severity}
                    </Badge>
                  </td>
                  <td className="p-3">{e.aiScore}%</td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      onClick={() => setSelectedEmployee(e)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* FULL EMPLOYEE DETAIL (EXACT LIKE 2nd IMAGE STRUCTURE) */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <EmployeeDetail employee={selectedEmployee} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- DETAIL PAGE ---------------- */

function EmployeeDetail({ employee }) {
  return (
    <div className="space-y-6">

      {/* HEADER CARD */}
      <Card>
        <CardContent className="flex items-center gap-6 py-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
            {employee.name[0]}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{employee.name}</h2>
            <p className="text-muted-foreground">{employee.role}</p>
            <p className="text-sm text-muted-foreground">
              {employee.department}
            </p>
          </div>

          <Button>Edit Profile</Button>
        </CardContent>
      </Card>

      {/* TABS (VISUAL ONLY FOR NOW) */}
      <div className="flex gap-3 border-b pb-2 text-sm">
        <span className="font-semibold border-b-2 border-primary pb-2">
          Skills & Performance
        </span>
        <span className="text-muted-foreground">Development & Goals</span>
        <span className="text-muted-foreground">Team Assignment</span>
      </div>

      {/* SKILL GAP SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Gaps for Upskilling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Technical Skill Gaps</p>
          <p>• Soft Skill Gaps</p>
        </CardContent>
      </Card>

      {/* PERFORMANCE CATEGORIES */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Categories</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="border rounded-lg p-4">
            <p className="font-semibold">Communication</p>
            <p className="text-muted-foreground">Needs improvement</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="font-semibold">Teamwork</p>
            <p className="text-muted-foreground">Average</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="font-semibold">Adaptability</p>
            <p className="text-muted-foreground">Good</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

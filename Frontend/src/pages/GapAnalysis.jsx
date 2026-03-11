import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { employees as centralEmployees, getFitmentBand } from "@/data/mockEmployeeData";

/* ---------------- COMPONENT ---------------- */

export default function GapAnalysis() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employeesWithGaps = useMemo(() => {
    return centralEmployees.filter(e => e.scores.fitment < 85).map(e => {
      let severity = "Low";
      let gapCount = 1;
      if (e.scores.fitment < 50) {
        severity = "High";
        gapCount = 4;
      } else if (e.scores.fitment < 75) {
        severity = "Medium";
        gapCount = 2;
      }
      return { ...e, severity, gapCount };
    });
  }, []);

  const filteredEmployees = useMemo(() => {
    return employeesWithGaps.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, employeesWithGaps]);

  const barData = useMemo(() => {
    return filteredEmployees.slice(0, 10).map(e => ({ name: e.name.split(' ')[0], gaps: e.gapCount }));
  }, [filteredEmployees]);

  const donutData = useMemo(() => {
    const counts = { "High": 0, "Medium": 0, "Low": 0 };
    employeesWithGaps.forEach(e => counts[e.severity]++);
    return [
      { name: "High", value: counts["High"] },
      { name: "Medium", value: counts["Medium"] },
      { name: "Low", value: counts["Low"] },
    ];
  }, [employeesWithGaps]);

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="space-y-8 p-6 font-['Inter']">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gap Analysis</h1>
          <p className="text-muted-foreground">
            Skill, performance & development gaps across {centralEmployees.length} employees
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
            <CardTitle>Gap Count by Employee (Top 10)</CardTitle>
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
                  paddingAngle={5}
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
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Gaps</th>
                <th className="p-3 text-center">Severity</th>
                <th className="p-3 text-center">Fitment Score</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((e) => (
                <tr key={e.employeeId} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {e.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{e.position}</td>
                  <td className="p-3 text-center font-bold">{e.gapCount}</td>
                  <td className="p-3 text-center">
                    <Badge variant={getSeverityVariant(e.severity)}>
                      {e.severity}
                    </Badge>
                  </td>
                  <td className="p-3 text-center font-medium">{e.scores.fitment}%</td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
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

      {/* DETAILS DIALOG */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
    <div className="space-y-6 p-2">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-2xl font-bold text-blue-600">
          {employee.name[0]}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-lg text-muted-foreground">{employee.position}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{employee.department}</Badge>
            <Badge variant="outline">{employee.employeeId}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50/50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 uppercase">Fitment Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">-{100 - employee.scores.fitment}%</p>
            <p className="text-xs text-red-600/70 mt-1">Below target baseline</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 uppercase">Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{employee.scores.productivity}%</p>
            <p className="text-xs text-blue-600/70 mt-1">Consistency score</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 uppercase">Fatigue Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{employee.scores.fatigue}%</p>
            <p className="text-xs text-purple-600/70 mt-1">Stress exposure</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Technical Competency</span>
              <span className="text-muted-foreground">{employee.scores.fitment}% Matching</span>
            </div>
            <Progress value={employee.scores.fitment} className="h-2" />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm">Recommended Interventions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="font-medium text-sm">Focused Upskilling</p>
                <p className="text-xs text-muted-foreground mt-1">Complete advanced {employee.position} certification.</p>
              </div>
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="font-medium text-sm">Peer Mentorship</p>
                <p className="text-xs text-muted-foreground mt-1">Pair with a High-Fitment {employee.position}.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Search, Download, User, Briefcase, DollarSign, AlertTriangle, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { employees as initialEmployees, getFitmentBand } from "@/data/mockEmployeeData";
import { useAuth } from "@/lib/auth";

export default function FitmentAnalysis() {
  const { user } = useAuth();
  const isEmployee = user?.role === "employee";

  const centralEmployees = useMemo(() => {
    if (isEmployee) {
      return initialEmployees.filter(e => e.employeeId === user.employeeId);
    }
    return initialEmployees;
  }, [isEmployee, user]);

  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [processFilter, setProcessFilter] = useState("All Departments");
  const [fitmentFilter, setFitmentFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    if (filter === "low-fitment") return "Unfit";
    return "All Fitment Status";
  });

  const distribution = useMemo(() => {
    const counts = { "Unfit": 0, "Train-to-Fit": 0, "Fit": 0, "Overfit": 0 };
    centralEmployees.forEach(e => {
      counts[getFitmentBand(e.scores.fitment)]++;
    });
    return [
      { name: "Unfit", value: counts["Unfit"], color: "#ef4444" },
      { name: "Train-to-Fit", value: counts["Train-to-Fit"], color: "#f59e0b" },
      { name: "Fit", value: counts["Fit"], color: "#10b981" },
      { name: "Overfit", value: counts["Overfit"], color: "#8b5cf6" },
    ];
  }, []);

  const kpiData = useMemo(() => {
    const fitPlusOver = distribution.filter(d => d.name === "Fit" || d.name === "Overfit").reduce((a, b) => a + b.value, 0);
    const misalignedCount = distribution.filter(d => d.name === "Unfit" || d.name === "Train-to-Fit").reduce((a, b) => a + b.value, 0);
    const percentFit = (fitPlusOver / centralEmployees.length * 100).toFixed(1);
    const costAtRisk = centralEmployees.filter(e => e.scores.fitment < 70).reduce((sum, e) => sum + e.salary, 0);

    return [
      { title: "WORKFORCE FITMENT", value: `${percentFit}%`, subtitle: "Fit + Overfit Combined", trend: "+2.1%", trendUp: true, color: "from-blue-500 to-blue-600" },
      { title: "MISALIGNED WORKFORCE", value: misalignedCount.toString(), subtitle: "Unfit + Train-to-Fit", trend: "-1.3%", trendUp: false, color: "from-yellow-500 to-yellow-600" },
      { title: "AT-RISK FTE", value: misalignedCount.toString(), subtitle: "Employees Misaligned", trend: "+8", trendUp: false, color: "from-red-500 to-red-600" },
      { title: "COST AT RISK", value: `$${(costAtRisk / 1000000).toFixed(1)}M`, subtitle: "Annual Salary @ Risk", trend: "+$0.5M", trendUp: false, color: "from-purple-500 to-purple-600" },
    ];
  }, [distribution]);

  const scatterData = useMemo(() => {
    return centralEmployees.map(e => ({
      name: e.name,
      fitment: e.scores.fitment,
      productivity: e.scores.productivity,
      category: getFitmentBand(e.scores.fitment)
    }));
  }, []);

  const processRisks = useMemo(() => {
    const depts = [...new Set(centralEmployees.map(e => e.department))];
    return depts.map(dept => {
      const emps = centralEmployees.filter(e => e.department === dept);
      const unfit = emps.filter(e => e.scores.fitment < 70).length;
      const riskPercent = Math.round((unfit / emps.length) * 100);
      return {
        process: dept,
        unfit: riskPercent,
        risk: riskPercent > 40 ? "High" : riskPercent > 20 ? "Medium" : "Low",
        fte: unfit,
        skill: "Core Competency"
      };
    }).sort((a, b) => b.unfit - a.unfit);
  }, []);

  const filteredEmployees = useMemo(() => {
    return centralEmployees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchesDept = processFilter === "All Departments" || emp.department === processFilter;
      const matchesFit = fitmentFilter === "All Fitment Status" || getFitmentBand(emp.scores.fitment) === fitmentFilter;
      return matchesSearch && matchesDept && matchesFit;
    }).sort((a, b) => b.scores.fitment - a.scores.fitment);
  }, [search, processFilter, fitmentFilter]);

  const getFitmentColor = (fitmentBand) => {
    switch (fitmentBand) {
      case "Unfit": return "bg-red-100 text-red-800";
      case "Train-to-Fit": return "bg-orange-100 text-orange-800";
      case "Fit": return "bg-green-100 text-green-800";
      case "Overfit": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High": return "border-red-500 bg-red-50";
      case "Medium": return "border-yellow-500 bg-yellow-50";
      case "Low": return "border-green-500 bg-green-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const departments = useMemo(() => ["All Departments", ...new Set(centralEmployees.map(e => e.department))], []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Inter']">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workforce Fitment Intelligence</h1>
          <p className="text-gray-600 mt-2">Enterprise-grade workforce optimization insights driven by AI Analysis</p>
        </div>

        {/* KPI Strip */}
        {!isEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <div key={index} className={`bg-gradient-to-r ${kpi.color} rounded-lg p-6 text-white shadow-lg`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide">{kpi.title}</h3>
                  <div className="flex items-center text-sm">
                    {kpi.trendUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{kpi.value}</div>
                <p className="text-sm opacity-90">{kpi.subtitle}</p>
              </div>
            ))}
          </div>
        )}

        {/* Explorer Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Fitment Explorer</h2>
              <div className="flex flex-wrap gap-4">
                <select value={processFilter} onChange={(e) => setProcessFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <select value={fitmentFilter} onChange={(e) => setFitmentFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
                  <option>All Fitment Status</option>
                  <option>Unfit</option>
                  <option>Train-to-Fit</option>
                  <option>Fit</option>
                  <option>Overfit</option>
                </select>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fitment</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Productivity</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.employeeId} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{emp.name}</div>
                            <div className="text-xs text-gray-500">{emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">{emp.position}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className={getFitmentColor(getFitmentBand(emp.scores.fitment))}>
                          {getFitmentBand(emp.scores.fitment)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Progress value={emp.scores.productivity} className="w-16" />
                          <span>{emp.scores.productivity}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700 font-medium">${emp.salary.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Alignment Details</h3>
              {selectedEmployee ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedEmployee.name}</h4>
                      <p className="text-sm text-gray-500">{selectedEmployee.position}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="block text-gray-500 text-xs uppercase">Department</span>
                      <span className="font-medium">{selectedEmployee.department}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="block text-gray-500 text-xs uppercase">Fitment Band</span>
                      <Badge className={getFitmentColor(getFitmentBand(selectedEmployee.scores.fitment))}>
                        {getFitmentBand(selectedEmployee.scores.fitment)}
                      </Badge>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="block text-gray-500 text-xs uppercase">Productivity</span>
                      <span className="font-semibold text-blue-600">{selectedEmployee.scores.productivity}%</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="block text-gray-500 text-xs uppercase">Utilization</span>
                      <span className="font-semibold text-teal-600">{selectedEmployee.scores.utilization}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">Select an employee for drill-down analysis</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEmployee ? "Your Personal Breakdown" : "Fitment Distribution"}</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    {!isEmployee && <Legend verticalAlign="bottom" height={36} />}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Process Risk Overview */}
        {!isEmployee && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Risk Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processRisks.map((process, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-lg bg-gray-50 ${getRiskColor(process.risk)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{process.process}</h4>
                    <Badge variant="outline" className={process.risk === "High" ? "text-red-600" : "text-gray-600"}>{process.risk}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{process.unfit}%</div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-tighter font-bold">Misaligned Workforce</p>
                  <div className="text-xs text-gray-500">
                    <div>At-risk Individuals: {process.fte}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matrix Analysis */}
        {!isEmployee && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fitment vs Productivity Matrix</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="fitment" name="Fitment %" unit="%" domain={[0, 100]} />
                  <YAxis type="number" dataKey="productivity" name="Productivity %" unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Employees" data={scatterData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 text-center text-sm">
              <div className="p-3 border rounded-lg bg-green-50"><p className="font-bold text-green-700">Stars</p><p className="text-xs text-green-600">High Fit / High Prod</p></div>
              <div className="p-3 border rounded-lg bg-blue-50"><p className="font-bold text-blue-700">Hidden Gems</p><p className="text-xs text-blue-600">Low Fit / High Prod</p></div>
              <div className="p-3 border rounded-lg bg-yellow-50"><p className="font-bold text-yellow-700">Misallocated</p><p className="text-xs text-yellow-600">High Fit / Low Prod</p></div>
              <div className="p-3 border rounded-lg bg-red-50"><p className="font-bold text-red-700">Exit/Reskill</p><p className="text-xs text-red-600">Low Fit / Low Prod</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

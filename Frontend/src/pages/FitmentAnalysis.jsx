import React, { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Search, Download, User, Briefcase, DollarSign, AlertTriangle } from "lucide-react";

// Mock data
const kpiData = [
  { title: "WORKFORCE FITMENT", value: "68.4%", subtitle: "Fit + Overfit Combined", trend: "+2.1%", trendUp: true, color: "from-blue-500 to-blue-600" },
  { title: "MISALIGNED WORKFORCE", value: "31.6%", subtitle: "Train-to-Fit + Unfit", trend: "-1.3%", trendUp: false, color: "from-yellow-500 to-yellow-600" },
  { title: "AT-RISK FTE", value: "127", subtitle: "Employees Misaligned", trend: "+8", trendUp: false, color: "from-red-500 to-red-600" },
  { title: "COST AT RISK", value: "$8.2M", subtitle: "Annual Salary Cost", trend: "+$0.5M", trendUp: false, color: "from-purple-500 to-purple-600" },
];

const employees = [
  { id: "EMP001", name: "Michael Torres", role: "Senior Accountant", process: "Invoice Processing", fitment: "Unfit", productivity: 62, gaps: "SAP, Excel", cost: 82000, avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "EMP002", name: "Sarah Johnson", role: "Financial Analyst", process: "Record to Report", fitment: "Overfit", productivity: 94, gaps: "None", cost: 95000, avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "EMP003", name: "David Chen", role: "Treasury Specialist", process: "Treasury", fitment: "Train-to-Fit", productivity: 78, gaps: "Risk Mgmt", cost: 88000, avatar: "https://i.pravatar.cc/40?img=3" },
  { id: "EMP004", name: "Emily Rodriguez", role: "Payroll Coordinator", process: "Payroll", fitment: "Fit", productivity: 91, gaps: "None", cost: 68000, avatar: "https://i.pravatar.cc/40?img=4" },
  { id: "EMP005", name: "James Wilson", role: "SAP Support Lead", process: "SAP Support", fitment: "Unfit", productivity: 55, gaps: "ITIL, Power BI", cost: 102000, avatar: "https://i.pravatar.cc/40?img=5" },
];

const fitmentDistribution = [
  { name: "Unfit", value: 31.6, color: "#ef4444" },
  { name: "Train-to-Fit", value: 36.1, color: "#f59e0b" },
  { name: "Fit", value: 22.1, color: "#10b981" },
  { name: "Overfit", value: 10.2, color: "#8b5cf6" },
];

const scatterData = [
  { fitment: 62, productivity: 50, category: "Exit/Reskill" },
  { fitment: 70, productivity: 60, category: "Misallocated" },
  { fitment: 78, productivity: 72, category: "Hidden Gems" },
  { fitment: 85, productivity: 80, category: "Stars" },
  { fitment: 92, productivity: 88, category: "Stars" },
  { fitment: 55, productivity: 45, category: "Exit/Reskill" },
  { fitment: 94, productivity: 95, category: "Stars" },
];

const processRisk = [
  { process: "Record to Report", unfit: 38, risk: "High", fte: 23, skill: "SAP FICO" },
  { process: "Invoice Processing", unfit: 29, risk: "Medium", fte: 18, skill: "Advanced Excel" },
  { process: "Treasury", unfit: 16, risk: "Low", fte: 8, skill: "Risk Management" },
  { process: "Helpdesk", unfit: 32, risk: "Medium", fte: 15, skill: "ITIL" },
  { process: "Payroll", unfit: 14, risk: "Low", fte: 7, skill: "Payroll Systems" },
  { process: "SAP Support", unfit: 41, risk: "High", fte: 25, skill: "SAP Basis" },
];

const skillGaps = [
  { skill: "SAP FICO", employees: 42, impact: "High", processes: "R2R, Treasury" },
  { skill: "Advanced Excel", employees: 38, impact: "High", processes: "All" },
  { skill: "ITIL", employees: 31, impact: "Medium", processes: "Helpdesk, Support" },
  { skill: "Risk Management", employees: 19, impact: "Medium", processes: "Treasury" },
  { skill: "Power BI", employees: 15, impact: "Low", processes: "Analytics" },
];

const talentWaste = [
  { process: "SAP Support", description: "Overqualified engineers in basic support roles", fte: 12, cost: 1240000 },
  { process: "Record to Report", description: "Experienced analysts in repetitive tasks", fte: 8, cost: 760000 },
  { process: "Invoice Processing", description: "MBA graduates in data entry", fte: 6, cost: 480000 },
];

const aiActions = [
  { title: "Reskill 15 FTE in SAP FICO", fte: 15, cost: -850000, risk: 28 },
  { title: "Reallocate 8 Overfit Employees", fte: 8, cost: -320000, risk: 15 },
  { title: "Hire 12 Specialized Roles", fte: 12, cost: 960000, risk: 35 },
];

export default function FitmentAnalysis() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [processFilter, setProcessFilter] = useState("All Processes");
  const [fitmentFilter, setFitmentFilter] = useState("All Fitment Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [sortBy, setSortBy] = useState("Highest Risk");

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (processFilter === "All Processes" || emp.process === processFilter) &&
    (fitmentFilter === "All Fitment Status" || emp.fitment === fitmentFilter)
  ).sort((a, b) => {
    if (sortBy === "Highest Risk") {
      const riskOrder = { "Unfit": 3, "Train-to-Fit": 2, "Fit": 1, "Overfit": 0 };
      return riskOrder[b.fitment] - riskOrder[a.fitment];
    }
    return 0;
  });

  const getFitmentColor = (fitment) => {
    switch (fitment) {
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

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workforce Fitment Intelligence – Manager Portal</h1>
          <p className="text-gray-600 mt-2">Enterprise-grade workforce optimization insights for strategic decision-making</p>
        </div>

        {/* KPI Strip */}
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

        {/* Employee Fitment Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Employee Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Fitment Explorer</h2>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                <select value={processFilter} onChange={(e) => setProcessFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
                  <option>All Processes</option>
                  <option>Record to Report</option>
                  <option>Invoice Processing</option>
                  <option>Treasury</option>
                  <option>Helpdesk</option>
                  <option>Payroll</option>
                  <option>SAP Support</option>
                </select>
                <select value={fitmentFilter} onChange={(e) => setFitmentFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
                  <option>All Fitment Status</option>
                  <option>Unfit</option>
                  <option>Train-to-Fit</option>
                  <option>Fit</option>
                  <option>Overfit</option>
                </select>
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
                  <option>All Locations</option>
                  <option>New York</option>
                  <option>London</option>
                  <option>Singapore</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
                  <option>Highest Risk</option>
                  <option>Name</option>
                  <option>Productivity</option>
                </select>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fitment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productivity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Gaps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.process}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFitmentColor(emp.fitment)}`}>
                          {emp.fitment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.productivity}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.gaps}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${emp.cost.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select className="px-3 py-1 border rounded-md text-sm">
                          <option>No Action</option>
                          <option>Replace</option>
                          <option>Train</option>
                          <option>Move</option>
                        </select>
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
                  <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
                  <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50" disabled>Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Role Alignment Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Alignment Details</h3>
              {selectedEmployee ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img className="h-16 w-16 rounded-full" src={selectedEmployee.avatar} alt="" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedEmployee.name}</h4>
                      <p className="text-sm text-gray-500">{selectedEmployee.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Process:</span> {selectedEmployee.process}
                    </div>
                    <div>
                      <span className="font-medium">Fitment:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getFitmentColor(selectedEmployee.fitment)}`}>
                        {selectedEmployee.fitment}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Productivity:</span> {selectedEmployee.productivity}%
                    </div>
                    <div>
                      <span className="font-medium">Annual Cost:</span> ${selectedEmployee.cost.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Skill Gaps:</span>
                    <p className="text-sm text-gray-600 mt-1">{selectedEmployee.gaps}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select an employee</h3>
                  <p className="mt-1 text-sm text-gray-500">to view alignment details</p>
                </div>
              )}
            </div>

            {/* Fitment Distribution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Fitment Distribution</h3>
                <select className="px-3 py-1 border rounded-md text-sm">
                  <option>All Functions</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>HR</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={fitmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {fitmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Process Risk Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Process Risk Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processRisk.map((process, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-lg ${getRiskColor(process.risk)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{process.process}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    process.risk === "High" ? "bg-red-100 text-red-800" :
                    process.risk === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {process.risk}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{process.unfit}%</div>
                <p className="text-sm text-gray-600 mb-2">Unfit + Train-to-Fit</p>
                <div className="text-xs text-gray-500">
                  <div>At-risk FTE: {process.fte}</div>
                  <div>Top missing skill: {process.skill}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skill Gap Intelligence</h2>
            <div className="space-y-4">
              {skillGaps.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{skill.skill}</h4>
                    <p className="text-xs text-gray-500">{skill.processes}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(skill.impact)}`}>
                      {skill.impact}
                    </span>
                    <span className="text-sm text-gray-600">{skill.employees} employees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overfit & Talent Waste */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Overfit & Talent Waste</h2>
            <div className="space-y-4 mb-6">
              {talentWaste.map((waste, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{waste.process}</h4>
                  <p className="text-xs text-gray-600 mb-3">{waste.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>FTE wasted: {waste.fte}</span>
                    <span>Cost: ${waste.cost.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Talent Waste</span>
                <span className="text-lg font-bold text-red-600">$2.03M annually</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fitment vs Productivity Matrix */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fitment vs Productivity Matrix</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="fitment" name="Fitment %" domain={[0, 100]} />
              <YAxis type="number" dataKey="productivity" name="Productivity %" domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Employees" dataKey="productivity" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-green-600">Stars</div>
              <div className="text-gray-500">High fitment, high productivity</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-blue-600">Hidden Gems</div>
              <div className="text-gray-500">High productivity, low fitment</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-yellow-600">Misallocated</div>
              <div className="text-gray-500">Low productivity, high fitment</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">Exit/Reskill</div>
              <div className="text-gray-500">Low fitment, low productivity</div>
            </div>
          </div>
        </div>

        {/* AI-Recommended Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI-Recommended Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiActions.map((action, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">{action.title}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>FTE Impact: {action.fte}</div>
                  <div>Cost Impact: {action.cost > 0 ? `+$${action.cost.toLocaleString()}` : `$${action.cost.toLocaleString()}`}</div>
                  <div>Risk Reduction: {action.risk}%</div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  Apply Action
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const KPI = ({title,value,color}) => (
  <div className={`${color} p-4 rounded-xl`}>
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Award,
  ChevronRight,
} from "lucide-react";

// Mock data for Workforce Intelligence
const kpiMetrics = [
  {
    title: "Total Workforce",
    value: "1,247",
    change: "+2.4%",
    changeType: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Avg Performance Score",
    value: "84.2",
    change: "+5.1%",
    changeType: "up",
    icon: Target,
    color: "green",
  },
  {
    title: "AI Insights Generated",
    value: "1,429",
    change: "+12.8%",
    changeType: "up",
    icon: Brain,
    color: "purple",
  },
  {
    title: "Optimization Potential",
    value: "$2.8M",
    change: "+8.3%",
    changeType: "up",
    icon: DollarSign,
    color: "orange",
  },
];

const aiInsights = [
  {
    type: "critical",
    title: "Critical Skills Gap Detected",
    description: "Data Science team needs 8 senior ML engineers within 6 months",
    impact: "High",
    action: "View Hiring Plan",
    icon: AlertTriangle,
  },
  {
    type: "opportunity",
    title: "Automation Ready Processes",
    description: "Invoice processing can save 45 FTE hours weekly",
    impact: "Medium",
    action: "Start Implementation",
    icon: Zap,
  },
  {
    type: "success",
    title: "Performance Optimization",
    description: "Engineering productivity increased 18% after team restructuring",
    impact: "High",
    action: "View Details",
    icon: CheckCircle,
  },
];

const departmentOverview = [
  {
    name: "Engineering",
    headcount: 342,
    performance: 87,
    utilization: 92,
    risk: "Low",
    trend: "up",
  },
  {
    name: "Product",
    headcount: 156,
    performance: 82,
    utilization: 88,
    risk: "Medium",
    trend: "up",
  },
  {
    name: "Sales",
    headcount: 203,
    performance: 91,
    utilization: 95,
    risk: "Low",
    trend: "up",
  },
  {
    name: "Marketing",
    headcount: 98,
    performance: 78,
    utilization: 85,
    risk: "High",
    trend: "down",
  },
  {
    name: "Support",
    headcount: 187,
    performance: 76,
    utilization: 89,
    risk: "High",
    trend: "down",
  },
  {
    name: "Finance",
    headcount: 89,
    performance: 85,
    utilization: 87,
    risk: "Low",
    trend: "stable",
  },
];

const predictiveInsights = [
  {
    title: "Attrition Risk",
    value: "23 employees",
    description: "High probability of leaving in next 3 months",
    color: "red",
  },
  {
    title: "Promotion Ready",
    value: "47 employees",
    description: "Ready for advancement opportunities",
    color: "green",
  },
  {
    title: "Training Needs",
    value: "156 employees",
    description: "Require skill development in next quarter",
    color: "yellow",
  },
  {
    title: "Workload Imbalance",
    value: "12 teams",
    description: "Resource redistribution recommended",
    color: "blue",
  },
];

export default function WorkforceIntelligence() {
  const [selectedInsight, setSelectedInsight] = useState(null);

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "High": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case "critical": return "border-red-200 bg-red-50";
      case "opportunity": return "border-blue-200 bg-blue-50";
      case "success": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getPredictiveColor = (color) => {
    switch (color) {
      case "red": return "bg-red-100 border-red-300";
      case "green": return "bg-green-100 border-green-300";
      case "yellow": return "bg-yellow-100 border-yellow-300";
      case "blue": return "bg-blue-100 border-blue-300";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-['Inter']">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-[#0F172A] mb-2">Workforce Intelligence</h1>
          <p className="text-lg text-[#64748B]">AI-powered workforce analytics and optimization insights</p>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className="p-6 bg-white border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'green' ? 'bg-green-100' :
                  metric.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <metric.icon className={`h-6 w-6 ${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <Badge className={`text-xs font-medium ${
                  metric.changeType === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.changeType === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {metric.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-[#64748B] font-medium mb-1">{metric.title}</p>
                <p className="text-3xl font-bold text-[#0F172A]">{metric.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* AI Insights Section */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-6">AI Workforce Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {aiInsights.map((insight, index) => (
              <Card key={index} className={`p-6 border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                    <insight.icon className={`h-6 w-6 ${
                      insight.type === 'critical' ? 'text-red-600' :
                      insight.type === 'opportunity' ? 'text-blue-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{insight.title}</h3>
                    <p className="text-[#64748B] mb-4">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} Impact
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1D4ED8]">
                        {insight.action}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Department Overview */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-6">Department Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentOverview.map((dept, index) => (
              <Card key={index} className="p-6 bg-white border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0F172A]">{dept.name}</h3>
                  <Badge className={`text-xs font-medium ${getRiskColor(dept.risk)}`}>
                    {dept.risk} Risk
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#64748B]">Headcount</span>
                      <span className="font-medium text-[#0F172A]">{dept.headcount}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#64748B]">Performance</span>
                      <span className="font-medium text-[#0F172A]">{dept.performance}%</span>
                    </div>
                    <Progress value={dept.performance} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#64748B]">Utilization</span>
                      <span className="font-medium text-[#0F172A]">{dept.utilization}%</span>
                    </div>
                    <Progress value={dept.utilization} className="h-2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Predictive Analytics */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-6">Predictive Workforce Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictiveInsights.map((insight, index) => (
              <Card key={index} className={`p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow ${getPredictiveColor(insight.color)}`}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{insight.title}</h3>
                  <p className="text-3xl font-bold text-[#0F172A] mb-2">{insight.value}</p>
                  <p className="text-sm text-[#64748B]">{insight.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <Card className="p-8 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] border-[#E5E7EB] rounded-xl shadow-lg text-white">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">AI Workforce Optimization Center</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Leverage advanced AI algorithms to optimize workforce performance, predict future needs,
              and maximize organizational productivity through data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#2563EB] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                <Brain className="h-5 w-5 mr-2" />
                Generate AI Report
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#2563EB] px-8 py-3 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
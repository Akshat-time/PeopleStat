import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
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
import { useLocation } from "wouter";
import { employees as centralEmployees } from "@/data/mockEmployeeData";

export default function WorkforceIntelligence() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const kpiMetrics = useMemo(() => {
    const avgPerf = centralEmployees.reduce((sum, e) => sum + e.scores.productivity, 0) / centralEmployees.length;
    return [
      {
        title: "Total Workforce",
        value: centralEmployees.length.toLocaleString(),
        change: "+2.4%",
        changeType: "up",
        icon: Users,
        color: "blue",
      },
      {
        title: "Avg Performance Score",
        value: avgPerf.toFixed(1),
        change: "+5.1%",
        changeType: "up",
        icon: Target,
        color: "green",
      },
      {
        title: "Utilization Rate",
        value: `${(centralEmployees.reduce((sum, e) => sum + e.scores.utilization, 0) / centralEmployees.length).toFixed(1)}%`,
        change: "+12.8%",
        changeType: "up",
        icon: Activity,
        color: "purple",
      },
      {
        title: "Salary Asset Value",
        value: `$${(centralEmployees.reduce((sum, e) => sum + e.salary, 0) / 1000000).toFixed(1)}M`,
        change: "+8.3%",
        changeType: "up",
        icon: DollarSign,
        color: "orange",
      },
    ];
  }, []);

  const departmentOverview = useMemo(() => {
    const depts = [...new Set(centralEmployees.map(e => e.department))];
    return depts.map(dept => {
      const emps = centralEmployees.filter(e => e.department === dept);
      const perf = Math.round(emps.reduce((sum, e) => sum + e.scores.productivity, 0) / emps.length);
      const utils = Math.round(emps.reduce((sum, e) => sum + e.scores.utilization, 0) / emps.length);
      const riskCount = emps.filter(e => e.scores.fatigue > 75).length;
      return {
        name: dept,
        headcount: emps.length,
        performance: perf,
        utilization: utils,
        risk: riskCount > 2 ? "High" : riskCount > 0 ? "Medium" : "Low",
      };
    }).sort((a, b) => b.performance - a.performance);
  }, []);

  const predictiveInsights = useMemo(() => {
    const attrRisk = centralEmployees.filter(e => e.scores.fatigue > 85).length;
    const promoReady = centralEmployees.filter(e => e.scores.fitment > 90 && e.scores.productivity > 85).length;
    const trainingNeeds = centralEmployees.filter(e => e.scores.fitment < 70).length;

    return [
      {
        title: "Attrition Risk",
        value: `${attrRisk} employees`,
        description: "High burnout/fatigue levels detected",
        color: "red",
      },
      {
        title: "Promotion Ready",
        value: `${promoReady} employees`,
        description: "High fitment and performance scores",
        color: "green",
      },
      {
        title: "Training Needs",
        value: `${trainingNeeds} employees`,
        description: "Fitment gaps requiring intervention",
        color: "yellow",
      },
      {
        title: "Workload Imbalance",
        value: `${departmentOverview.filter(d => d.utilization > 90).length} departments`,
        description: "Utilization exceeding 90% threshold",
        color: "blue",
      },
    ];
  }, [departmentOverview]);

  const aiInsights = [
    {
      type: "critical",
      title: "Skill Gap Alert",
      description: `Detected ${predictiveInsights[2].value} requiring immediate training in core competencies.`,
      impact: "High",
      action: "View Hiring Plan",
      icon: AlertTriangle,
    },
    {
      type: "opportunity",
      title: "Utilization Optimization",
      description: "Excess capacity found in Finance; redistribution could save 15% in operational costs.",
      impact: "Medium",
      action: "Start Implementation",
      icon: Zap,
    },
    {
      type: "success",
      title: "Productivity Milestone",
      description: `Overall workforce performance is up by 5.1% compared to last quarter.`,
      impact: "High",
      action: "View Details",
      icon: CheckCircle,
    },
  ];

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
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-[#0F172A] mb-2">Workforce Intelligence</h1>
          <p className="text-lg text-[#64748B]">AI-powered workforce analytics and optimization insights</p>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className="p-6 bg-white border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.color === 'blue' ? 'bg-blue-100' :
                  metric.color === 'green' ? 'bg-green-100' :
                    metric.color === 'purple' ? 'bg-purple-100' :
                      'bg-orange-100'
                  }`}>
                  <metric.icon className={`h-6 w-6 ${metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'green' ? 'text-green-600' :
                      metric.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                    }`} />
                </div>
                <Badge className={`text-xs font-medium ${metric.changeType === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                    <insight.icon className={`h-6 w-6 ${insight.type === 'critical' ? 'text-red-600' :
                      insight.type === 'opportunity' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{insight.title}</h3>
                    <p className="text-[#64748B] mb-4 text-sm">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} Impact
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1D4ED8]" onClick={() => {
                        if (insight.action === "View Hiring Plan") navigate("/gap-analysis");
                        else if (insight.action === "Start Implementation") {
                          toast({
                            title: "Implementation Started",
                            description: "Automation process has been initiated.",
                          });
                        } else if (insight.action === "View Details") navigate("/employees");
                      }}>
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
                      <span className="text-[#64748B]">Performance Score</span>
                      <span className="font-medium text-[#0F172A]">{dept.performance}%</span>
                    </div>
                    <Progress value={dept.performance} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#64748B]">Resource Utilization</span>
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
              <Button className="bg-white text-[#2563EB] hover:bg-gray-100 px-8 py-3 text-lg font-semibold" onClick={() => toast({ title: "Generating Report", description: "Advanced AI analysis in progress..." })}>
                <Brain className="h-5 w-5 mr-2" />
                Generate AI Report
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#2563EB] px-8 py-3 text-lg font-semibold" onClick={() => navigate("/")}>
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

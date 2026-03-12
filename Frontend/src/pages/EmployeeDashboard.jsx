import React, { useMemo } from "react";
import { useAuth } from "@/lib/auth";
import {
    Brain,
    Zap,
    AlertTriangle,
    Target,
    BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { employees } from "@/data/mockEmployeeData";
import { useLocation } from "wouter";
import { useState } from "react";
import EmployeeDrawer from "@/components/EmployeeDrawer";

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [, navigate] = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const employeeData = useMemo(() => {
        return employees.find(e => e.employeeId === user?.employeeId) || employees[0];
    }, [user]);

    const go = (path) => navigate(path);

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome back, {employeeData.name}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Your personal performance and growth insights
                    </p>
                </div>
                <Button
                    onClick={() => setIsProfileOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                    View Full Profile
                </Button>
            </div>

            {isProfileOpen && (
                <EmployeeDrawer
                    employee={employeeData}
                    onClose={() => setIsProfileOpen(false)}
                />
            )}

            {/* PERSONAL KPI STRIP */}
            <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                    title="Fitment Score"
                    value={employeeData.scores.fitment + "%"}
                    icon={Target}
                    description="Role alignment index"
                    color="text-blue-600"
                    onClick={() => go("/fitment")}
                />
                <MetricCard
                    title="Utilization"
                    value={employeeData.scores.utilization + "%"}
                    icon={Zap}
                    description="Current workload status"
                    color="text-amber-600"
                    onClick={() => go("/fatigue")}
                />
                <MetricCard
                    title="Fatigue Level"
                    value={employeeData.scores.fatigue + "%"}
                    icon={AlertTriangle}
                    description="Burnout risk indicator"
                    color={employeeData.scores.fatigue > 70 ? "text-destructive" : "text-green-600"}
                    onClick={() => go("/fatigue")}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SKILLS & GROWTH */}
                <Card className="border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-500" />
                            Skills & Growth
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">Technical Proficiency</span>
                                <span className="text-muted-foreground">{employeeData.scores.skill}%</span>
                            </div>
                            <Progress value={employeeData.scores.skill} className="h-2" />
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Top Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {[...employeeData.skills.hard, ...employeeData.skills.soft].map(skill => (
                                    <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 border-none">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-semibold mb-2">Next Recommended Role</h4>
                            <p className="text-lg font-bold text-blue-600">{employeeData.recommendedRole}</p>
                            <p className="text-xs text-muted-foreground mt-1">Based on your current fitment and skill progression</p>
                        </div>
                    </CardContent>
                </Card>

                {/* AI INSIGHTS */}
                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            AI Career Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                            <p className="text-sm font-medium">Strategic Insight</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your high {employeeData.skills.hard[0]} proficiency puts you in the top 15% of candidates for {employeeData.recommendedRole} positions.
                                Focus on {employeeData.skills.soft[1]} to fast-track your next promotion.
                            </p>
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => go("/ai-assistant")}>
                            Chat with AI Career Coach
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, description, color, onClick }) {
    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">{value}</h2>
                    <Badge variant="outline" className="text-[10px] py-0">LIVE</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{description}</p>
            </CardContent>
        </Card>
    );
}

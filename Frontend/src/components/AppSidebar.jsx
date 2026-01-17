import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Upload,
  Settings,
  BookOpen,
  Zap,
  Brain,
  AlertCircle,
  LogOut,
  Target,
  Bot,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../components/ui/sidebar.jsx";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button.jsx";
import { useAuth } from "../lib/auth.jsx";
import { queryClient } from "../lib/queryClient.js";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Employees", url: "/employees", icon: Users },
];

const insightsItems = [
  { title: "Fitment Analysis", url: "/fitment", icon: Target },
  { title: "Softskills", url: "/softskills", icon: Brain },
  { title: "Fatigue Analysis", url: "/fatigue", icon: AlertCircle },
  { title: "Workforce Intelligence", url: "/workforce-intelligence", icon: BarChart3 },
  { title: "Gap Analysis", url: "/gap-analysis", icon: BarChart3 }, // ✅ ADD THIS
];


const adminDataItems = [
  { title: "Upload Data", url: "/upload", icon: Upload },
];

const adminOptimizationItems = [
  { title: "AI Assistant", url: "/ai-assistant", icon: Bot },
  { title: "Optimization", url: "/optimization", icon: Zap },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const systemItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Documentation", url: "/documentation", icon: BookOpen },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role || "employee";

  const handleLogout = () => {
    logout();
    queryClient.clear();
    window.location.href = "/login";
  };
  return (
  <Sidebar>
    <SidebarContent className="py-2">

      {/* HEADER */}
      <div className="px-4 py-2 mb-2">
        <h1 className="text-lg font-bold">AI Workforce Optimization</h1>
        <p className="text-xs text-muted-foreground">Enterprise HR Analytics</p>
      </div>

      {/* MAIN */}
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* INSIGHTS */}
      <SidebarGroup>
        <SidebarGroupLabel>Insights</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {insightsItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                   

                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {role === "admin" && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/six-by-six"}>
                  <Link to="/six-by-six">
                    <BarChart3 className="h-4 w-4" />
                    <span>6×6 Workforce Analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* ADMIN ONLY */}
      {role === "admin" && (
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Data</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminDataItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Optimization</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminOptimizationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      )}

    </SidebarContent>

    <SidebarFooter className="p-2">
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </SidebarFooter>
  </Sidebar>
);
}




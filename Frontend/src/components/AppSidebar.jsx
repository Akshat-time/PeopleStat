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
  ClipboardList,
  Activity,
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
  { title: "My Profile", url: "/settings", icon: Users },
];

const insightsItems = [
  { title: "Fitment Analysis", url: "/fitment", icon: Target },
  { title: "Softskills", url: "/softskills", icon: Brain },
  { title: "Fatigue Analysis", url: "/fatigue", icon: AlertCircle },
  { title: "Workforce Intelligence", url: "/workforce-intelligence", icon: Activity },
  { title: "Gap Analysis", url: "/gap-analysis", icon: BarChart3 },
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
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role || "employee";

  const handleLogout = () => {
    logout();
    queryClient.clear();
    window.location.href = "/login";
  };

  const IconWrapper = ({ icon: Icon }) => Icon ? <Icon className="h-4 w-4" /> : null;

  return (
    <Sidebar>
      <SidebarContent className="py-2">
        {/* HEADER */}
        <div className="px-4 py-2 mb-2">
          <h1 className="text-lg font-bold">AI Workforce Optimization</h1>
          <p className="text-xs text-muted-foreground">Enterprise HR Analytics</p>
        </div>

        {/* MAIN SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.filter(item => {
                if (role === "employee") {
                  return ["Dashboard", "My Profile"].includes(item.title);
                }
                return item.title !== "My Profile";
              }).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link to={item.url}>
                      <IconWrapper icon={item.icon} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PORTAL SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel>{role === "manager" ? "Insights" : "Employee Portal"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {role === "employee" ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/softskills"}>
                      <Link to="/softskills">
                        <Brain className="h-4 w-4" />
                        <span>Skill Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/fatigue"}>
                      <Link to="/fatigue">
                        <AlertCircle className="h-4 w-4" />
                        <span>Fatigue Status</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/employee/data-form"}>
                      <Link to="/employee/data-form">
                        <ClipboardList className="h-4 w-4" />
                        <span>Employee Data Form</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  {insightsItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location === item.url}>
                        <Link to={item.url}>
                          <IconWrapper icon={item.icon} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/six-by-six"}>
                      <Link to="/six-by-six">
                        <BarChart3 className="h-4 w-4" />
                        <span>6×6 Workforce Analysis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ADMIN/MANAGER ONLY SECTION */}
        {role === "manager" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Admin Data</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminDataItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location === item.url}>
                        <Link to={item.url}>
                          <IconWrapper icon={item.icon} />
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
                      <SidebarMenuButton asChild isActive={location === item.url}>
                        <Link to={item.url}>
                          <IconWrapper icon={item.icon} />
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

        {/* SYSTEM SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link to={item.url}>
                      <IconWrapper icon={item.icon} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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

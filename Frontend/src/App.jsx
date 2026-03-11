// App.jsx
import React, { useEffect, useState } from "react";
import GapAnalysis from "./pages/GapAnalysis.jsx";

import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.jsx";
import { AppSidebar } from "./components/AppSidebar.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";

import { Bell, Bot } from "lucide-react";
import { Button } from "./components/ui/button.jsx";
import { Avatar, AvatarFallback } from "./components/ui/avatar.jsx";

import { AuthProvider, useAuth } from "./lib/auth.jsx";
import { WorkforceProvider } from "./contexts/WorkforceContext.jsx";
import { AIProvider } from "./contexts/AIContext.jsx";
import AIChat from "./components/AIChat.jsx";

// Error boundary to prevent AIProvider crash from blanking the whole app
class AIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error("AIProvider crashed:", err); }
  render() {
    if (this.state.hasError) {
      return this.props.children; // render children without AI features
    }
    return (
      <AIProvider>
        {this.props.children}
      </AIProvider>
    );
  }
}

/* ---------------- PAGES ---------------- */
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Employees from "./pages/Employees.jsx";
import FitmentAnalysis from "./pages/FitmentAnalysis.jsx";
import Softskills from "./pages/Softskills.jsx";
import Fatigue from "./pages/Fatigue.jsx";
import WorkforceIntelligence from "./pages/WorkforceIntelligence.jsx";
import SixBySixAnalysis from "./pages/SixBySixAnalysis.jsx";
import Optimization from "./pages/Optimization.jsx";
import Reports from "./pages/Reports.jsx";
import UploadData from "./pages/UploadData.jsx";
import Settings from "./pages/Settings.jsx";
import Documentation from "./pages/Documentation.jsx";
import AiEmployeeAssistant from "./pages/AiEmployeeAssistant.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/not-found.jsx";
import EmployeeDataForm from "./pages/employee/EmployeeDataForm.jsx";
import EmployeeProfile from "./pages/employee/EmployeeProfile.jsx";

/* ---------------- PROTECTED ROUTES ---------------- */

function ProtectedRoute({ component: Component }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  console.log("ProtectedRoute - user:", user, "isLoading:", isLoading);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <Component />;
}

function ManagerRoute({ component: Component }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [isLoading, user]);

  if (isLoading)
    return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) return null;

  if (user.role !== "manager") {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h1 className="text-2xl font-semibold">Access Denied</h1>
          <p className="text-muted-foreground">
            Manager access required
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}

/* ---------------- APP ROUTER ---------------- */

function AppRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/" component={() => (
        <ProtectedRoute component={() => {
          const { user } = useAuth();
          return user.role === "manager" ? <Dashboard /> : <EmployeeDashboard />;
        }} />
      )} />
      <Route path="/employees" component={() => <ManagerRoute component={Employees} />} />
      <Route path="/fitment" component={() => <ProtectedRoute component={FitmentAnalysis} />} />
      <Route path="/softskills" component={() => <ProtectedRoute component={Softskills} />} />
      <Route path="/fatigue" component={() => <ProtectedRoute component={Fatigue} />} />
      <Route path="/employee/skills" component={() => <ProtectedRoute component={Softskills} />} />
      <Route path="/workforce-intelligence" component={() => <ManagerRoute component={WorkforceIntelligence} />} />

      {/* ✅ THIS ONE */}
      <Route
        path="/gap-analysis"
        component={() => <ManagerRoute component={GapAnalysis} />}
      />

      <Route
        path="/ai-assistant"
        component={() => <ProtectedRoute component={AiEmployeeAssistant} />}
      />

      <Route
        path="/six-by-six"
        component={() => <ManagerRoute component={SixBySixAnalysis} />}
      />
      <Route path="/optimization" component={() => <ManagerRoute component={Optimization} />} />
      <Route path="/analytics" component={() => <ManagerRoute component={Analytics} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
      <Route path="/documentation" component={() => <ProtectedRoute component={Documentation} />} />
      <Route path="/employee/data-form" component={() => <ProtectedRoute component={EmployeeDataForm} />} />
      <Route path="/employee/profile" component={() => <ProtectedRoute component={EmployeeProfile} />} />


      <Route component={NotFound} />
    </Switch>
  );
}


/* ---------------- APP LAYOUT ---------------- */

function AppContent() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isAuthPage = location === "/login" || location === "/register";

  if (isAuthPage) {
    return <AppRouter />;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem" }}>
      <div className="flex h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <div className="font-semibold text-sm">
                  AI Workforce Optimization
                </div>
                {user && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {user.role === "manager" ? "Manager Portal" : "Employee Portal"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={isChatOpen ? "bg-accent" : ""}
              >
                <Bot className="h-5 w-5" />
              </Button>

              <ThemeToggle />

              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2">
                  <div className="text-right flex flex-col items-end">
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {user.username}
                    </p>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.1em] mt-0.5">
                      {user.role}
                    </p>
                  </div>
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm overflow-hidden bg-slate-100">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 overflow-auto p-6">
            <AppRouter />
          </main>
        </div>
      </div>

      {/* Floating AI Chat */}
      {!isAuthPage && <AIChat isFloating={true} isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />}
    </SidebarProvider>
  );
}

/* ---------------- ROOT ---------------- */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkforceProvider>
          <AIErrorBoundary>
            <TooltipProvider>
              <AppContent />
              <Toaster />
            </TooltipProvider>
          </AIErrorBoundary>
        </WorkforceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

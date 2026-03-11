// App.jsx
import GapAnalysis from "./pages/GapAnalysis.jsx";

import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.jsx";
import { AppSidebar } from "./components/AppSidebar.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";

import { Bell, Brain } from "lucide-react";
import { Button } from "./components/ui/button.jsx";
import { Avatar, AvatarFallback } from "./components/ui/avatar.jsx";

import { AuthProvider, useAuth } from "./lib/auth.jsx";
import { AIProvider } from "./contexts/AIContext.jsx";
import AIChat from "./components/AIChat.jsx";
import { ProfileDropdown } from "./components/ProfileDropdown.jsx";
import { NotificationPanel } from "./components/NotificationPanel.jsx";

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

/* ---------------- PROTECTED ROUTES ---------------- */

function ProtectedRoute({ component: Component }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  console.log("ProtectedRoute - user:", user, "isLoading:", isLoading);

  useEffect(() => {
    console.log("ProtectedRoute useEffect - isLoading:", isLoading, "user:", user);
    if (!isLoading && !user) {
      console.log("Redirecting to login");
      navigate("/login");
    }
  }, [isLoading, user]);

  if (isLoading) {
    console.log("Showing loading screen");
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F7F8FA" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #E6E6E6", borderTopColor: "#6D8196", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}></div>
          <p style={{ color: "#7A7A7A", fontSize: "14px" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    console.log("No user, returning null");
    return null;
  }

  console.log("Rendering component");
  return <Component />;
}

function ManagerRoute({ component: Component }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [isLoading, user]);

  if (isLoading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F7F8FA" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #E6E6E6", borderTopColor: "#6D8196", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }}></div>
          <p style={{ color: "#7A7A7A", fontSize: "14px" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!user) return null;

  if (user.role !== "manager") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", background: "#F7F8FA" }}>
        <div>
          <div style={{ width: "64px", height: "64px", background: "rgba(109,129,150,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#6D8196" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#4A4A4A", marginBottom: "8px" }}>Access Restricted</h1>
          <p style={{ color: "#7A7A7A", fontSize: "14px" }}>Manager access is required to view this page.</p>
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
      <Route path="/workforce-intelligence" component={() => <ManagerRoute component={WorkforceIntelligence} />} />

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
      <Route path="/upload-data" component={() => <ManagerRoute component={UploadData} />} />

      <Route component={NotFound} />
    </Switch>
  );
}


/* ---------------- APP LAYOUT ---------------- */

function AppContent() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isAuthPage = location === "/login" || location === "/register";

  if (isAuthPage) {
    return <AppRouter />;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "15.5rem" }}>
      <div style={{ display: "flex", height: "100vh", width: "100%", background: "var(--brand-bg, #F2F7FC)" }}>
        <AppSidebar />

        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {/* ── TOP NAV BAR ── */}
          <header
            className="top-nav-bar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              height: "58px",
              flexShrink: 0,
            }}
          >
            {/* Left: trigger + title */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <SidebarTrigger style={{ color: "#6B8299" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px", color: "#1E2D3D" }}>
                  AI Workforce Optimization
                </span>
                {user && (
                  <span className="portal-badge">
                    {user.role === "manager" ? "Manager Portal" : "Employee Portal"}
                  </span>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Notification bell */}
              <NotificationPanel onNavigate={(path) => navigate(path)} />

              {/* AI Chat toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                style={{
                  background: isChatOpen ? "rgba(109,129,150,0.12)" : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  color: isChatOpen ? "#6A89A7" : "#6B8299",
                  transition: "background 0.15s, color 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={e => { if (!isChatOpen) e.currentTarget.style.background = "#F0F7FF"; }}
                onMouseLeave={e => { if (!isChatOpen) e.currentTarget.style.background = "none"; }}
              >
                <Brain size={18} />
              </button>

              <ThemeToggle />

              {/* Divider */}
              <div style={{ width: "1px", height: "24px", background: "#D4E5F7", margin: "0 6px" }} />

              {/* User profile dropdown */}
              {user && <ProfileDropdown user={user} />}
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <main style={{ flex: 1, overflow: "auto", padding: "28px" }}>
            <AppRouter />
          </main>
        </div>
      </div>

      {/* ── FLOATING AI CHAT ── */}
      {!isAuthPage && (
        <AIChat
          isFloating={true}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      )}
    </SidebarProvider>
  );
}

/* ---------------- ROOT ---------------- */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AIProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

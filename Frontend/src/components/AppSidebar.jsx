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
  ChevronRight,
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
  { title: "Upload Data", url: "/upload-data", icon: Upload },
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

/* ── Custom nav item that bypasses SidebarMenuButton's classes ── */
function NavItem({ url, icon: Icon, title, isActive }) {
  return (
    <Link to={url}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 14px",
          borderRadius: "9px",
          cursor: "pointer",
          margin: "1px 4px",
          position: "relative",
          transition: "background 0.18s ease, color 0.18s ease",
          background: isActive
            ? "#6A89A7"
            : "transparent",
          color: isActive ? "#FFFFFF" : "#BDDDFC",
          boxShadow: "none",
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = "rgba(136,189,242,0.13)";
            e.currentTarget.style.color = "#FFFFFF";
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#BDDDFC";
          }
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <span style={{
            position: "absolute",
            left: 0,
            top: "20%",
            height: "60%",
            width: "3px",
            background: "#88BDF2",
            borderRadius: "0 3px 3px 0",
          }} />
        )}

        {/* Icon */}
        <span style={{ opacity: isActive ? 1 : 0.75, display: "flex", flexShrink: 0 }}>
          {Icon && <Icon size={15} />}
        </span>

        {/* Label */}
        <span style={{ fontSize: "13.5px", fontWeight: isActive ? 600 : 400, lineHeight: 1.3 }}>
          {title}
        </span>
      </div>
    </Link>
  );
}

/* ── Group label ── */
function NavLabel({ children }) {
  return (
    <div style={{
      fontSize: "9.5px",
      fontWeight: 700,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      color: "rgba(136,189,242,0.45)",
      padding: "8px 18px 4px 18px",
      marginTop: "4px",
    }}>
      {children}
    </div>
  );
}

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role || "employee";

  const handleLogout = () => {
    logout();
    queryClient.clear();
    window.location.href = "/login";
  };

  return (
    <Sidebar>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#053259",
        overflow: "hidden",
      }}>
        {/* ── BRAND HEADER ── */}
        <div style={{
          padding: "18px 16px 16px",
          borderBottom: "1px solid rgba(136,189,242,0.1)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            {/* Logo pill */}
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "#6A89A7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "none",
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                AI Workforce
              </h1>
              <p style={{ fontSize: "10px", color: "rgba(189,221,252,0.55)", marginTop: "2px", letterSpacing: "0.02em" }}>
                Enterprise Analytics
              </p>
            </div>
          </div>

          {/* User role chip */}
          {user && (
            <div style={{
              marginTop: "14px",
              display: "flex",
              alignItems: "center",
              gap: "9px",
              padding: "7px 10px",
              background: "rgba(136,189,242,0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(136,189,242,0.15)",
            }}>
              <div style={{
                width: "26px",
                height: "26px",
                borderRadius: "7px",
                background: "#053259",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "#BDDDFC",
                flexShrink: 0,
              }}>
                {user.username?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.2 }}>{user.username}</div>
                <div style={{ fontSize: "10px", color: "rgba(189,221,252,0.6)", textTransform: "capitalize" }}>{user.role}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── NAV ITEMS ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>

          {/* MAIN */}
          <NavLabel>Main</NavLabel>
          <div>
            {menuItems.filter(item => {
              if (role === "employee") return ["Dashboard", "My Profile"].includes(item.title);
              return item.title !== "My Profile";
            }).map(item => (
              <NavItem key={item.title} url={item.url} icon={item.icon} title={item.title} isActive={location === item.url} />
            ))}
          </div>

          {/* INSIGHTS / EMPLOYEE PORTAL */}
          <NavLabel>{role === "manager" ? "Insights" : "Employee Portal"}</NavLabel>
          <div>
            {role === "employee" ? (
              <>
                <NavItem url="/softskills" icon={Brain} title="Skill Overview" isActive={location === "/softskills"} />
                <NavItem url="/fatigue" icon={AlertCircle} title="Fatigue Status" isActive={location === "/fatigue"} />
                <NavItem url="/employee/data-form" icon={ClipboardList} title="Employee Data Form" isActive={location === "/employee/data-form"} />
              </>
            ) : (
              <>
                {insightsItems.map(item => (
                  <NavItem key={item.title} url={item.url} icon={item.icon} title={item.title} isActive={location === item.url} />
                ))}
                <NavItem url="/six-by-six" icon={BarChart3} title="6×6 Workforce Analysis" isActive={location === "/six-by-six"} />
              </>
            )}
          </div>

          {/* ADMIN ONLY */}
          {role === "manager" && (
            <>
              <NavLabel>Admin Data</NavLabel>
              <div>
                {adminDataItems.map(item => (
                  <NavItem key={item.title} url={item.url} icon={item.icon} title={item.title} isActive={location === item.url} />
                ))}
              </div>

              <NavLabel>Optimization</NavLabel>
              <div>
                {adminOptimizationItems.map(item => (
                  <NavItem key={item.title} url={item.url} icon={item.icon} title={item.title} isActive={location === item.url} />
                ))}
              </div>
            </>
          )}

          {/* SYSTEM */}
          <NavLabel>System</NavLabel>
          <div>
            {systemItems.map(item => (
              <NavItem key={item.title} url={item.url} icon={item.icon} title={item.title} isActive={location === item.url} />
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: "12px 12px 16px",
          borderTop: "1px solid rgba(136,189,242,0.1)",
          flexShrink: 0,
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 14px",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
              color: "rgba(189,221,252,0.7)",
              background: "rgba(136,189,242,0.07)",
              border: "1px solid rgba(136,189,242,0.13)",
              borderRadius: "9px",
              transition: "background 0.18s, color 0.18s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(136,189,242,0.16)";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(136,189,242,0.07)";
              e.currentTarget.style.color = "rgba(189,221,252,0.7)";
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

import React, { useMemo, useState } from "react";
import {
  Brain,
  Users,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Zap,
  Grid,
  ChevronRight,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { employees as initialEmployees, getOverallRisk } from "@/data/mockEmployeeData";
import { api } from "@/servicess/api";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/* ──────────────────────────────── CONFIG ──────────────────────────────── */

const rows = [
  { key: "Productivity", scoreKey: "productivity" },
  { key: "Utilization",  scoreKey: "utilization"  },
  { key: "Fitment",      scoreKey: "fitment"       },
  { key: "Fatigue",      scoreKey: "fatigue"       },
  { key: "Automation Potential", scoreKey: "automationPotential" },
  { key: "Business Criticality", scoreKey: "_bc" },
];

const cols = ["Critical", "High", "Medium", "Stable", "Strong", "Elite"];

const bucketRanges = [
  { name: "Critical", min: 0,  max: 30  },
  { name: "High",     min: 31, max: 45  },
  { name: "Medium",   min: 46, max: 60  },
  { name: "Stable",   min: 61, max: 75  },
  { name: "Strong",   min: 76, max: 90  },
  { name: "Elite",    min: 91, max: 100 },
];

/* column header badge colors (left→right: bad→good) */
const COL_BADGE = {
  Critical: { bg: "rgba(220,60,60,0.12)",  text: "#C03030", border: "rgba(220,60,60,0.2)"  },
  High:     { bg: "rgba(220,120,30,0.12)", text: "#B05A10", border: "rgba(220,120,30,0.2)" },
  Medium:   { bg: "rgba(136,189,242,0.15)", text: "#4E7FA8", border: "rgba(136,189,242,0.3)" },
  Stable:   { bg: "rgba(106,137,167,0.15)", text: "#3D6585", border: "rgba(106,137,167,0.3)" },
  Strong:   { bg: "rgba(5, 50, 89, 0.12)",    text: "#2A4255", border: "rgba(5, 50, 89, 0.25)"   },
  Elite:    { bg: "linear-gradient(135deg,rgba(136,189,242,0.25),rgba(106,137,167,0.2))", text: "#1E3A55", border: "rgba(136,189,242,0.45)" },
};

/* ──────────────────────────────── HELPERS ──────────────────────────────── */

function bucket(score) {
  return bucketRanges.find(b => score >= b.min && score <= b.max)?.name || "Medium";
}

function getBC(e) {
  const roleBonus = (e.position || "").includes("Lead") || (e.position || "").includes("Senior") ? 85 : 60;
  const apt = e.scores?.aptitude || e.aptitudeScore || 60;
  const prod = e.scores?.productivity || e.productivity || 60;
  const fit = e.scores?.fitment || e.fitmentScore || 60;
  return Math.round(apt * 0.4 + roleBonus * 0.3 + prod * 0.15 + fit * 0.15);
}

function aiRec(e) {
  const fatigue = e.scores?.fatigue || e.fatigue || 0;
  const fitment = e.scores?.fitment || e.fitmentScore || 0;
  const auto = e.scores?.automationPotential || e.automationPotential || 0;
  const apt = e.scores?.aptitude || e.aptitudeScore || 0;

  if (fatigue > 75)             return "Reduce workload and rebalance tasks.";
  if (fitment < 50)             return "Reskill or redeploy to better-fit role.";
  if (auto > 70) return "Target for automation or role redesign.";
  if (apt > 85)            return "Consider for leadership or strategic projects.";
  return "Maintain and monitor performance.";
}

/* ──────────────────────────────── MAIN PAGE ──────────────────────────────── */

export default function SixBySixAnalysis() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(null); // { rowKey, col, list }
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await api.get("/employees");
        if (response.data.success) {
          setEmployees(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        toast({
          title: "Error",
          description: "Could not load six-by-six analysis.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployees();
  }, [toast]);

  const enriched = useMemo(() =>
    employees.map(e => ({ ...e, _bc: getBC(e) })),
  [employees]);

  /* Build matrix */
  const matrix = useMemo(() => {
    const m = {};
    rows.forEach(r => cols.forEach(c => (m[`${r.key}-${c}`] = [])));
    enriched.forEach(e => {
      rows.forEach(r => {
        const val = r.scoreKey === "_bc" ? e._bc : (e.scores?.[r.scoreKey] || e[r.scoreKey] || 0);
        const col = bucket(val);
        m[`${r.key}-${col}`].push(e);
      });
    });
    return m;
  }, [enriched]);

  /* KPIs */
  const kpis = useMemo(() => {
    if (employees.length === 0) return { riskCount: 0, totalCost: "0M", costAtRisk: "$0K", autoPct: "0%" };
    const highRisk   = employees.filter(e => getOverallRisk(e) === "High");
    const totalPay   = employees.reduce((s, e) => s + (e.salary || 0), 0);
    const riskPay    = highRisk.reduce((s, e) => s + (e.salary || 0), 0);
    const avgAuto    = employees.reduce((s, e) => s + (e.scores?.automationPotential || e.automationPotential || 0), 0) / employees.length;
    return {
      riskCount: highRisk.length,
      totalCost: (totalPay / 1_000_000).toFixed(1) + "M",
      costAtRisk: "$" + (riskPay / 1000).toFixed(0) + "K",
      autoPct: Math.round(avgAuto) + "%",
    };
  }, [employees]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── HEADER ── */}
      <div>
        <h1 className="page-title">6×6 Workforce Intelligence Matrix</h1>
        <p style={{ color: "#6B8299", marginTop: "#6B8299", fontSize: "14px" }}>
          AI-driven segmentation of risk, fitment and performance across {employees.length} nodes
        </p>
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        <KPICard title="Workforce at Risk"       value={`${kpis.riskCount} Employees`} icon={AlertTriangle} />
        <KPICard title="Payroll Exposure"         value={`$${kpis.totalCost}`}          icon={DollarSign}    />
        <KPICard title="Cost at Risk"             value={kpis.costAtRisk}               icon={TrendingUp}    />
        <KPICard title="Avg Automation Potential" value={kpis.autoPct}                  icon={Zap}           />
      </div>

      {/* ── MATRIX CARD ── */}
      <div className="chart-analytics-card" style={{ cursor: "default" }}>
        <div className="chart-card-header">
          <span className="chart-card-title">6×6 Workforce Intelligence Matrix</span>
          <Grid size={14} style={{ color: "#88BDF2" }} />
        </div>

        <div style={{ padding: "20px 24px 28px" }}>
          <p style={{ fontSize: "13px", color: "#6B8299", marginBottom: "20px" }}>
            AI-driven segmentation of risk, fitment and performance across {employees.length} nodes
          </p>

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "140px repeat(6, 1fr)",
            gap: "10px",
            marginBottom: "10px",
          }}>
            <div />
            {cols.map(c => {
              const s = COL_BADGE[c];
              return (
                <div key={c} style={{
                  textAlign: "center",
                  padding: "5px 4px",
                  borderRadius: "6px",
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: s.text,
                }}>
                  {c}
                </div>
              );
            })}

            {/* Rows */}
            {rows.map(r => (
              <React.Fragment key={r.key}>
                {/* Row label */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#053259",
                  paddingRight: "8px",
                }}>
                  {r.key}
                </div>

                {/* Cells */}
                {cols.map(c => {
                  const list  = matrix[`${r.key}-${c}`];
                  const count = list.length;
                  const isActive = count > 0;
                  const bColors = COL_BADGE[c];

                  return (
                    <div
                      key={c}
                      onClick={() => isActive && setSelected({ rowKey: r.key, col: c, list })}
                      style={{
                        borderRadius: "10px",
                        padding: "12px 8px",
                        border: isActive ? `1.5px solid ${bColors.border}` : "1.5px solid rgba(212,229,247,0.5)",
                        background: isActive ? bColors.bg : "rgba(242,247,252,0.6)",
                        cursor: isActive ? "pointer" : "default",
                        textAlign: "center",
                        transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                        opacity: isActive ? 1 : 0.45,
                        position: "relative",
                      }}
                      onMouseEnter={e => {
                        if (isActive) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(106,137,167,0.2)";
                          e.currentTarget.style.background = `linear-gradient(135deg, #6A89A7 0%, #4E6E8A 100%)`;
                          e.currentTarget.querySelector(".cell-count").style.color = "#FFFFFF";
                          e.currentTarget.querySelector(".cell-label").style.color = "rgba(255,255,255,0.75)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (isActive) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = bColors.bg;
                          e.currentTarget.querySelector(".cell-count").style.color = bColors.text;
                          e.currentTarget.querySelector(".cell-label").style.color = bColors.text;
                        }
                      }}
                    >
                      <div
                        className="cell-count"
                        style={{
                          fontSize: "22px",
                          fontWeight: 800,
                          lineHeight: 1.1,
                          color: isActive ? bColors.text : "#C5D4E0",
                          transition: "color 0.18s",
                        }}
                      >
                        {count}
                      </div>
                      <div
                        className="cell-label"
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: isActive ? bColors.text : "#C5D4E0",
                          marginTop: "2px",
                          transition: "color 0.18s",
                        }}
                      >
                        {count === 1 ? "Asset" : "Assets"}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── DRILLDOWN MODAL ── */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent style={{
          maxWidth: "680px",
          maxHeight: "85vh",
          overflowY: "auto",
          borderRadius: "16px",
          border: "1px solid #D4E5F7",
          boxShadow: "0 24px 64px rgba(56,73,89,0.18)",
          padding: 0,
        }}>
          {/* Modal header */}
          <div style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #053259 0%, #042949 100%)",
            borderRadius: "16px 16px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <DialogTitle style={{ color: "#FFFFFF", fontSize: "17px", fontWeight: 700, margin: 0 }}>
                {selected?.rowKey} <span style={{ color: "#88BDF2" }}>·</span> {selected?.col}
              </DialogTitle>
              <p style={{ fontSize: "11px", color: "rgba(189,221,252,0.65)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                Drilldown Analysis — {selected?.list.length} {selected?.list.length === 1 ? "record" : "records"} found
              </p>
            </div>
          </div>

          {/* Employee cards */}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {selected?.list.map((e, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #D4E5F7",
                  borderRadius: "12px",
                  padding: "18px",
                  boxShadow: "0 2px 10px rgba(56,73,89,0.06)",
                  transition: "border-color 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={el => {
                  el.currentTarget.style.borderColor = "#88BDF2";
                  el.currentTarget.style.boxShadow = "0 6px 18px rgba(136,189,242,0.15)";
                }}
                onMouseLeave={el => {
                  el.currentTarget.style.borderColor = "#D4E5F7";
                  el.currentTarget.style.boxShadow = "0 2px 10px rgba(56,73,89,0.06)";
                }}
              >
                {/* Employee identity */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #6A89A7 0%, #053259 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#BDDDFC",
                      fontSize: "13px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      {e.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1E2D3D", fontSize: "15px" }}>{e.name}</div>
                      <div style={{ fontSize: "11px", color: "#6A89A7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>
                        {e.position} · {e.department}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: "rgba(136,189,242,0.15)",
                    border: "1px solid rgba(136,189,242,0.35)",
                    borderRadius: "7px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#053259",
                    letterSpacing: "0.04em",
                  }}>
                    BC SCORE: {e._bc}
                  </div>
                </div>

                {/* Score metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "14px" }}>
                  {[
                    { label: "Fitment",    val: e.scores?.fitment || e.fitmentScore || 0,            warn: (e.scores?.fitment || e.fitmentScore || 0) < 50 },
                    { label: "Fatigue",    val: e.scores?.fatigue || e.fatigue || 0,            warn: (e.scores?.fatigue || e.fatigue || 0) > 75 },
                    { label: "Automation", val: e.scores?.automationPotential || e.automationPotential || 0, warn: false },
                    { label: "Aptitude",   val: e.scores?.aptitude || e.aptitudeScore || 0,           warn: false },
                  ].map(({ label, val, warn }) => (
                    <div key={label} style={{
                      background: warn ? "rgba(220,60,60,0.07)" : "#F2F7FC",
                      border: warn ? "1px solid rgba(220,60,60,0.2)" : "1px solid #D4E5F7",
                      borderRadius: "8px",
                      padding: "10px",
                    }}>
                      <div style={{ fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#6B8299", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: warn ? "#C03030" : "#1E2D3D" }}>{val}%</div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendation */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "linear-gradient(135deg, #053259 0%, #042949 100%)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "rgba(136,189,242,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Brain size={14} style={{ color: "#88BDF2" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#88BDF2", textTransform: "uppercase" }}>
                      MAYA Recommendation:{" "}
                    </span>
                    <span style={{ fontSize: "13px", color: "rgba(189,221,252,0.9)" }}>{aiRec(e)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ──────────────────────────────── KPI CARD ──────────────────────────────── */

function KPICard({ title, value, icon: Icon }) {
  return (
    <div className="kpi-analytics-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="kpi-metric-label">{title}</p>
          <p className="kpi-metric-value" style={{ marginTop: "10px" }}>{value}</p>
        </div>
        <div className="kpi-icon-container">
          <Icon size={20} style={{ color: "#053259" }} />
        </div>
      </div>
    </div>
  );
}

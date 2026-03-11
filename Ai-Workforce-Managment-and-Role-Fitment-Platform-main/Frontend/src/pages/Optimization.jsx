import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Zap,
  Users,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { fetchOptimization, startOptimization } from "@/servicess/api";

/* =================== COMPONENT =================== */
export default function Optimization() {
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({ totalSavings: 0, totalEmployees: 0 });
  const [loading, setLoading] = useState(false);
  const [initiating, setInitiating] = useState(false);

  const totalSavings = stats.totalSavings;
  const totalEmployees = stats.totalEmployees;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchOptimization();
        if (res.data) {
          setRecommendations(res.data.recommendations || []);
          setStats(res.data.stats || { totalSavings: 0, totalEmployees: 0 });
        }
      } catch (err) {
        console.error("fetch optimization error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleInitiate = async () => {
    setInitiating(true);
    try {
      const res = await startOptimization();
      if (res.data) {
        setRecommendations(res.data.recommendations || []);
        setStats(res.data.stats || { totalSavings: 0, totalEmployees: 0 });
      }
    } catch (err) {
      console.error("initiate optimization error", err);
    } finally {
      setInitiating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading optimization data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 p-6 font-['Inter']">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Optimization Recommendations
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          AI-driven workforce actions to reduce cost, risk, and inefficiencies based on current employee records
        </p>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Avg Risk Reduction"
          value="30.6%"
          icon={ShieldCheck}
        />
        <SummaryCard
          title="Est. Annual Savings"
          value={`$${(totalSavings / 1000000).toFixed(2)}M`}
          icon={DollarSign}
        />
        <SummaryCard
          title="Automation Potential"
          value="15.5 FTE"
          icon={Zap}
        />
        <SummaryCard
          title="Employees Impacted"
          value={totalEmployees.toString()}
          icon={Users}
        />
      </div>

      {/* OPTIMIZATION CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Priority Optimization Actions
          </h2>
          <Badge variant="secondary">
            {recommendations.length} AI Suggestions
          </Badge>
        </div>

        {/* show standalone button when no suggestions available */}
        {recommendations.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className="text-sm text-muted-foreground mb-4">
              There are currently no AI recommendations. You can initiate an optimization run to generate them.
            </p>
            <button
              onClick={handleInitiate}
              disabled={initiating}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {initiating ? "Running..." : "Initiate Optimization"}
              <ArrowUpRight size={14} className="ml-2" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => (
            <Card key={idx} className="hover:shadow-md transition bg-white border-slate-200">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center border-y py-4">
                  <Metric label="Scope" value={`${rec.impact.employees} EMP`} />
                  <Metric
                    label="Savings"
                    value={rec.impact.savings}
                    highlight
                  />
                  <Metric
                    label="Risk ↓"
                    value={`-${rec.impact.riskReduction}`}
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                    <AlertCircle size={12} />
                    Data Basis:{" "}
                    <span className="text-slate-700">{rec.basis}</span>
                  </p>
                  <ul className="space-y-2">
                    {rec.actions.map((a, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-600 flex gap-2"
                      >
                        <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <button
                onClick={handleInitiate}
                disabled={initiating}
                className="w-full border-t py-3 text-xs font-semibold uppercase tracking-wide text-blue-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {initiating ? "Running..." : "Initiate Optimization"}
                <ArrowUpRight size={14} />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================== SUB COMPONENTS =================== */

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground font-medium">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <Icon className="w-6 h-6 text-blue-600" />
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p
        className={`text-sm font-bold ${highlight ? "text-blue-600" : "text-slate-800"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

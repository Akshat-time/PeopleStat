import Employee from "../models/Employee.js";
import OptimizationRun from "../models/OptimizationRun.js";

// compute recommendations based on employee list
function computeRecommendations(employees) {
  const fatigueRiskEmps = employees.filter(e => e.fatigueScore > 80);
  const skillGapEmps = employees.filter(e => e.fitmentScore < 65);
  const overfitEmps = employees.filter(e => e.fitmentScore > 90 && e.utilization < 75);

  const recommendations = [
    {
      title: "Reallocate High-Fitment Talent",
      description: `${overfitEmps.length} employees are high-fit but under-utilized, indicating potential role misalignment or capacity for higher responsibility.`,
      impact: {
        employees: overfitEmps.length,
        savings: '$' + ((overfitEmps.length * 45000 / 1000).toFixed(0)) + 'K',
        riskReduction: "15%",
      },
      basis: "Fitment vs Utilization Matrix",
      actions: [
        "Evaluate for project leadership roles",
        "Open internal mobility tracks",
        "Review workload distribution",
      ],
    },
    {
      title: "Targeted Reskilling Program",
      description: `Skill gaps detected for ${skillGapEmps.length} employees across core competencies.`,
      impact: {
        employees: skillGapEmps.length,
        savings: '$' + ((skillGapEmps.length * 80000 / 1000000).toFixed(2)) + 'M',
        riskReduction: "32%",
      },
      basis: "Gap Analysis Intelligence",
      actions: [
        "Deploy automated learning paths",
        "Allocate skill development credits",
        "Schedule mentorship workshops",
      ],
    },
    {
      title: "Fatigue Risk Mitigation",
      description: `Critical burnout risk detected for ${fatigueRiskEmps.length} high-performing employees.`,
      impact: {
        employees: fatigueRiskEmps.length,
        savings: '$' + ((fatigueRiskEmps.length * 95000 / 1000).toFixed(0)) + 'K',
        riskReduction: "45%",
      },
      basis: "Fatigue & Stress Exposure Analysis",
      actions: [
        "Mandatory recovery cycle assignment",
        "Redistribute high-complexity tasks",
        "Conduct 1:1 wellbeing pulse checks",
      ],
    },
  ];

  const totalSavings = recommendations.reduce((sum, rec) => {
    const val = rec.impact.savings.replace('$', '').replace('K', '').replace('M', '');
    const multiplier = rec.impact.savings.includes('M') ? 1000000 : 1000;
    return sum + (parseFloat(val) * multiplier);
  }, 0);

  const totalEmployees = recommendations.reduce((sum, rec) => sum + rec.impact.employees, 0);

  return { recommendations, stats: { totalSavings, totalEmployees } };
}

export const getRecommendations = async (req, res) => {
  try {
    const employees = await Employee.find();
    const { recommendations, stats } = computeRecommendations(employees);
    res.json({ success: true, recommendations, stats });
  } catch (error) {
    console.error('optimization fetch error', error);
    res.status(500).json({ error: 'Failed to compute recommendations' });
  }
};

export const initiateOptimization = async (req, res) => {
  try {
    const employees = await Employee.find();
    const { recommendations, stats } = computeRecommendations(employees);

    // persist optionally
    const run = new OptimizationRun({
      runId: `OPT_${Date.now()}`,
      initiatedBy: req.user?.id,
      recommendations,
      stats,
    });
    await run.save();

    res.json({ success: true, recommendations, stats, runId: run.runId });
  } catch (error) {
    console.error('optimization initiate error', error);
    res.status(500).json({ error: 'Failed to initiate optimization' });
  }
};
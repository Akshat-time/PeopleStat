import Employee from '../models/Employee.js';

// @desc    Generate workforce optimization recommendations
// @route   GET /api/optimization/recommendations
// @access  Private (Manager)
export const getRecommendations = async (req, res) => {
  try {
    const employees = await Employee.find({});
    
    // Safety check if database is essentially empty
    if (!employees || employees.length === 0) {
      return res.status(200).json([]);
    }

    const fatigueRiskEmps = employees.filter(e => (e.fatigueScore || 0) > 80);
    const skillGapEmps = employees.filter(e => (e.fitmentScore || 0) < 65);
    const overfitEmps = employees.filter(e => (e.fitmentScore || 0) > 90 && (e.utilization || 0) < 75);

    const recommendations = [
      {
        title: "Reallocate High-Fitment Talent",
        description: `${overfitEmps.length} employees are high-fit but under-utilized, indicating potential role misalignment or capacity for higher responsibility.`,
        impact: {
          employees: overfitEmps.length,
          savings: `$${(overfitEmps.length * 45000 / 1000).toFixed(0)}K`,
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
          savings: `$${(skillGapEmps.length * 80000 / 1000000).toFixed(2)}M`,
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
          savings: `$${(fatigueRiskEmps.length * 95000 / 1000).toFixed(0)}K`,
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

    res.status(200).json({ 
       recommendations,
       totalEmployeesAnalysis: employees.length
    });
  } catch (error) {
    console.error('Optimization Generation Error:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
};

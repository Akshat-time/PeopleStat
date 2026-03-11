const Employee = require('../models/Employee');
const Analytics = require('../models/Analytics');

exports.getWorkforceSummary = async (req, res) => {
  try {
    const employees = await Employee.find();
    
    // Calculate aggregate metrics
    const totalEmployees = employees.length;
    let totalFitment = 0;
    let totalPerformance = 0;
    
    const departmentCounts = {};
    const roleDistribution = {};

    employees.forEach(emp => {
      totalFitment += (emp.fitmentScore || 0);
      totalPerformance += (emp.performanceScore || 0);
      
      departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
      roleDistribution[emp.recommendedRole] = (roleDistribution[emp.recommendedRole] || 0) + 1;
    });

    const averageFitment = totalEmployees > 0 ? totalFitment / totalEmployees : 0;
    const averagePerformance = totalEmployees > 0 ? totalPerformance / totalEmployees : 0;

    res.json({
      success: true,
      data: {
        totalEmployees,
        averageFitment: Math.round(averageFitment),
        averagePerformance: Math.round(averagePerformance),
        departmentCounts,
        roleDistribution
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getSkillGaps = async (req, res) => {
  try {
    const aggregatedGaps = {
      'Cloud Architecture (AWS/Azure)': 15,
      'Machine Learning': 12,
      'Agile Leadership': 8,
      'Advanced React': 5
    };

    res.json({
      success: true,
      data: {
        title: 'Company Wide Skill Gaps',
        gaps: aggregatedGaps,
        recommendation: 'Prioritize hiring or upskilling for Cloud Architecture'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

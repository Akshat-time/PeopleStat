export const mockEmployees = [
  {
    userid: "EMP001",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@company.com",
    salary: 85000,
    joiningDate: "2019-03-15",
    department: "Finance",
    position: "Senior Analyst",
    currentRole: "Financial Analyst",
    recommendedRole: "Senior Financial Analyst",
    fitmentScore: 6.8,
    productivity: 72,
    utilization: 85,
    processes: [
      { name: "Vendor Reconciliation", hours: 90, output: "Monthly reports", repetitiveScore: 85 },
      { name: "Monthly Close", hours: 40, output: "Financial statements", repetitiveScore: 60 },
      { name: "Budget Analysis", hours: 30, output: "Budget reports", repetitiveScore: 45 },
    ],
    skills: {
      soft: ["Communication", "Time Management", "Attention to Detail"],
      hard: ["Excel", "SQL", "SAP", "Financial Modeling"],
    },
    skillScore: 78,
    aptitudeScore: 82,
    consolidated: true,
    consolidatedCount: 120,
    nonConsolidatedCount: 40,
    automationPotential: 78,
    experienceYears: 6.2,
    documents: [
      { name: "Performance Review Q4 2024.pdf", type: "Review", uploadDate: "2024-12-15" },
      { name: "Certification - Advanced Excel.pdf", type: "Certificate", uploadDate: "2024-06-20" },
    ],
    productivityHistory: [
      { month: "Jun", value: 68 },
      { month: "Jul", value: 71 },
      { month: "Aug", value: 73 },
      { month: "Sep", value: 70 },
      { month: "Oct", value: 74 },
      { month: "Nov", value: 72 },
    ],
    fatigueScore: 45,
    tags: ["automation-candidate", "high-potential"],
    notes: [],
  },
  {
    userid: "EMP002",
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    salary: 95000,
    joiningDate: "2017-08-10",
    department: "IT",
    position: "Team Lead",
    currentRole: "Development Team Lead",
    recommendedRole: "Engineering Manager",
    fitmentScore: 8.9,
    productivity: 91,
    utilization: 88,
    processes: [
      { name: "Code Review", hours: 60, output: "Quality gates", repetitiveScore: 40 },
      { name: "Sprint Planning", hours: 20, output: "Sprint backlog", repetitiveScore: 30 },
      { name: "Architecture Design", hours: 80, output: "Technical specs", repetitiveScore: 20 },
    ],
    skills: {
      soft: ["Leadership", "Mentoring", "Conflict Resolution", "Strategic Thinking"],
      hard: ["Python", "React", "AWS", "Docker", "System Design"],
    },
    skillScore: 92,
    aptitudeScore: 88,
    consolidated: true,
    consolidatedCount: 140,
    nonConsolidatedCount: 20,
    automationPotential: 35,
    experienceYears: 8.5,
    documents: [
      { name: "Performance Review Q4 2024.pdf", type: "Review", uploadDate: "2024-12-10" },
      { name: "AWS Solutions Architect Certification.pdf", type: "Certificate", uploadDate: "2023-09-15" },
      { name: "Leadership Training Completion.pdf", type: "Training", uploadDate: "2024-03-22" },
    ],
    productivityHistory: [
      { month: "Jun", value: 89 },
      { month: "Jul", value: 90 },
      { month: "Aug", value: 92 },
      { month: "Sep", value: 91 },
      { month: "Oct", value: 90 },
      { month: "Nov", value: 91 },
    ],
    fatigueScore: 28,
    tags: ["high-performer", "promotion-ready"],
    notes: [],
  },
  {
    userid: "EMP003",
    name: "David Chen",
    email: "david.chen@company.com",
    salary: 72000,
    joiningDate: "2021-01-20",
    department: "Operations",
    position: "Operations Specialist",
    currentRole: "Operations Coordinator",
    recommendedRole: "Operations Analyst",
    fitmentScore: 4.5,
    productivity: 58,
    utilization: 62,
    processes: [
      { name: "Data Entry", hours: 100, output: "Updated records", repetitiveScore: 95 },
      { name: "Inventory Management", hours: 40, output: "Stock reports", repetitiveScore: 80 },
      { name: "Customer Tickets", hours: 20, output: "Ticket resolution", repetitiveScore: 70 },
    ],
    skills: {
      soft: ["Reliability", "Organization"],
      hard: ["MS Office", "Data Entry", "Inventory Software"],
    },
    skillScore: 62,
    aptitudeScore: 58,
    consolidated: false,
    consolidatedCount: 50,
    nonConsolidatedCount: 110,
    automationPotential: 92,
    experienceYears: 3.8,
    documents: [
      { name: "Performance Review Q3 2024.pdf", type: "Review", uploadDate: "2024-09-30" },
    ],
    productivityHistory: [
      { month: "Jun", value: 60 },
      { month: "Jul", value: 57 },
      { month: "Aug", value: 59 },
      { month: "Sep", value: 56 },
      { month: "Oct", value: 58 },
      { month: "Nov", value: 58 },
    ],
    fatigueScore: 68,
    tags: ["at-risk", "automation-candidate", "training-needed"],
    notes: [],
  },
  {
    userid: "EMP004",
    name: "Aisha Patel",
    email: "aisha.patel@company.com",
    salary: 105000,
    joiningDate: "2016-05-12",
    department: "HR",
    position: "HR Manager",
    currentRole: "Talent Acquisition Manager",
    recommendedRole: "Head of Talent",
    fitmentScore: 9.2,
    productivity: 94,
    utilization: 91,
    processes: [
      { name: "Candidate Screening", hours: 70, output: "Shortlisted candidates", repetitiveScore: 55 },
      { name: "Interview Coordination", hours: 30, output: "Interview schedules", repetitiveScore: 65 },
      { name: "Offer Negotiations", hours: 40, output: "Signed offers", repetitiveScore: 25 },
      { name: "Onboarding Programs", hours: 20, output: "New hire integration", repetitiveScore: 50 },
    ],
    skills: {
      soft: ["Negotiation", "Empathy", "Communication", "Relationship Building"],
      hard: ["ATS Systems", "LinkedIn Recruiter", "HR Analytics", "Compensation Planning"],
    },
    skillScore: 95,
    aptitudeScore: 91,
    consolidated: true,
    consolidatedCount: 135,
    nonConsolidatedCount: 25,
    automationPotential: 48,
    experienceYears: 9.6,
    documents: [
      { name: "Performance Review Q4 2024.pdf", type: "Review", uploadDate: "2024-12-05" },
      { name: "SHRM-SCP Certification.pdf", type: "Certificate", uploadDate: "2022-07-18" },
      { name: "Diversity Training.pdf", type: "Training", uploadDate: "2024-02-10" },
    ],
    productivityHistory: [
      { month: "Jun", value: 93 },
      { month: "Jul", value: 94 },
      { month: "Aug", value: 95 },
      { month: "Sep", value: 94 },
      { month: "Oct", value: 93 },
      { month: "Nov", value: 94 },
    ],
    fatigueScore: 22,
    tags: ["high-performer", "overfit"],
    notes: [],
  },
  {
    userid: "EMP005",
    name: "Michael Johnson",
    email: "michael.johnson@company.com",
    salary: 68000,
    joiningDate: "2022-09-01",
    department: "Finance",
    position: "Junior Analyst",
    currentRole: "Accounts Payable Analyst",
    recommendedRole: "Financial Analyst",
    fitmentScore: 5.5,
    productivity: 65,
    utilization: 70,
    processes: [
      { name: "Invoice Processing", hours: 110, output: "Processed invoices", repetitiveScore: 90 },
      { name: "Expense Reports", hours: 30, output: "Approved expenses", repetitiveScore: 85 },
      { name: "Vendor Management", hours: 20, output: "Vendor records", repetitiveScore: 60 },
    ],
    skills: {
      soft: ["Punctuality", "Teamwork"],
      hard: ["Excel", "QuickBooks", "Data Entry"],
    },
    skillScore: 68,
    aptitudeScore: 72,
    consolidated: true,
    consolidatedCount: 90,
    nonConsolidatedCount: 70,
    automationPotential: 88,
    experienceYears: 2.2,
    documents: [
      { name: "Performance Review Q3 2024.pdf", type: "Review", uploadDate: "2024-10-01" },
      { name: "Excel Basics Certificate.pdf", type: "Certificate", uploadDate: "2023-05-15" },
    ],
    productivityHistory: [
      { month: "Jun", value: 63 },
      { month: "Jul", value: 65 },
      { month: "Aug", value: 67 },
      { month: "Sep", value: 64 },
      { month: "Oct", value: 66 },
      { month: "Nov", value: 65 },
    ],
    fatigueScore: 52,
    tags: ["train-to-fit", "automation-candidate"],
    notes: [],
  },
];

// Helper functions
export function searchEmployees(query, employees) {
  if (!query.trim()) return [];
  const searchTerm = query.toLowerCase();
  return employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm) ||
    emp.userid.toLowerCase().includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm)
  );
}

export function filterByDepartment(department, employees) {
  if (department === "all") return employees;
  return employees.filter(emp => emp.department === department);
}

export function filterByRole(role, employees) {
  if (role === "all") return employees;
  return employees.filter(emp => emp.position.toLowerCase().includes(role.toLowerCase()));
}

export function getFitmentClassification(score) {
  if (score >= 9) return "Overfit";
  if (score >= 8) return "Fit";
  if (score >= 5) return "Train to Fit";
  return "Unfit";
}

export function calculateFTEOptimization(employee) {
  const totalHours = employee.processes.reduce((sum, p) => sum + p.hours, 0);
  const expectedHours = 160;
  return totalHours / expectedHours;
}

export function calculateAutomationSavings(employee) {
  return employee.processes
    .filter(p => p.repetitiveScore >= 70)
    .map(p => ({
      processName: p.name,
      fteSavings: (p.hours / 160) * (p.repetitiveScore / 100),
    }))
    .sort((a, b) => b.fteSavings - a.fteSavings);
}

export function filterEmployeeDataByRole(employee, role) {
  const filtered = { ...employee };
  if (role === "Admin") return filtered;
  if (role === "Manager") {
    filtered.salary = 0;
    return filtered;
  }
  filtered.salary = 0;
  filtered.email = "";
  return filtered;
}

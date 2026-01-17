import React, { createContext, useContext, useState, useEffect } from "react";

// AI Context for managing chat state across the app
const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Comprehensive Workforce Data Engine
  const workforceData = {
    "Sarah Johnson": {
      id: "EMP001",
      role: "Senior Developer",
      department: "Engineering",
      fitment: 92,
      fatigue: 78,
      softSkills: { leadership: 68, communication: 85, teamwork: 92 },
      sixBySix: { fatigue: "Critical", productivity: "Strong", engagement: "High" },
      risk: "High",
      recommendations: [
        "Reduce workload by 20%",
        "Move off high-stress project",
        "Enroll in leadership coaching",
        "Schedule weekly 1:1 check-ins"
      ],
      skills: ["React", "Node.js", "Python", "AWS"],
      utilization: 95,
      lastReview: "2024-01-15"
    },
    "Michael Chen": {
      id: "EMP002",
      role: "Product Manager",
      department: "Product",
      fitment: 88,
      fatigue: 45,
      softSkills: { leadership: 92, communication: 88, teamwork: 85 },
      sixBySix: { fatigue: "Low", productivity: "Strong", engagement: "High" },
      risk: "Low",
      recommendations: [
        "Consider for senior leadership role",
        "Mentor junior PMs",
        "Expand technical knowledge"
      ],
      skills: ["Product Strategy", "Agile", "Data Analysis", "SQL"],
      utilization: 82,
      lastReview: "2024-01-10"
    },
    "Emily Rodriguez": {
      id: "EMP003",
      role: "Data Analyst",
      department: "Analytics",
      fitment: 76,
      fatigue: 62,
      softSkills: { leadership: 45, communication: 78, teamwork: 88 },
      sixBySix: { fatigue: "Medium", productivity: "Moderate", engagement: "Medium" },
      risk: "Medium",
      recommendations: [
        "Provide advanced analytics training",
        "Pair with senior data scientist",
        "Focus on communication skills development"
      ],
      skills: ["Python", "SQL", "Tableau", "Statistics"],
      utilization: 68,
      lastReview: "2024-01-08"
    },
    "David Kim": {
      id: "EMP004",
      role: "UX Designer",
      department: "Design",
      fitment: 94,
      fatigue: 38,
      softSkills: { leadership: 72, communication: 95, teamwork: 90 },
      sixBySix: { fatigue: "Low", productivity: "Strong", engagement: "High" },
      risk: "Low",
      recommendations: [
        "Lead design system initiative",
        "Mentor junior designers",
        "Explore motion design specialization"
      ],
      skills: ["Figma", "Sketch", "Prototyping", "User Research"],
      utilization: 88,
      lastReview: "2024-01-12"
    },
    "Lisa Thompson": {
      id: "EMP005",
      role: "Marketing Manager",
      department: "Marketing",
      fitment: 82,
      fatigue: 85,
      softSkills: { leadership: 88, communication: 92, teamwork: 85 },
      sixBySix: { fatigue: "Critical", productivity: "Moderate", engagement: "Medium" },
      risk: "High",
      recommendations: [
        "Reduce campaign load by 30%",
        "Delegate operational tasks",
        "Implement work-life balance measures",
        "Consider sabbatical option"
      ],
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      utilization: 98,
      lastReview: "2024-01-05"
    },
    "James Wilson": {
      id: "EMP006",
      role: "DevOps Engineer",
      department: "Engineering",
      fitment: 89,
      fatigue: 52,
      softSkills: { leadership: 65, communication: 75, teamwork: 88 },
      sixBySix: { fatigue: "Medium", productivity: "Strong", engagement: "High" },
      risk: "Medium",
      recommendations: [
        "Provide leadership training",
        "Consider team lead role",
        "Balance on-call responsibilities"
      ],
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      utilization: 92,
      lastReview: "2024-01-14"
    },
    "Anna Martinez": {
      id: "EMP007",
      role: "HR Specialist",
      department: "HR",
      fitment: 91,
      fatigue: 41,
      softSkills: { leadership: 85, communication: 96, teamwork: 93 },
      sixBySix: { fatigue: "Low", productivity: "Strong", engagement: "High" },
      risk: "Low",
      recommendations: [
        "Expand to HR Manager role",
        "Lead diversity initiatives",
        "Develop HR analytics expertise"
      ],
      skills: ["Employee Relations", "Recruiting", "HR Systems", "Compliance"],
      utilization: 78,
      lastReview: "2024-01-11"
    },
    "Robert Taylor": {
      id: "EMP008",
      role: "Sales Representative",
      department: "Sales",
      fitment: 67,
      fatigue: 73,
      softSkills: { leadership: 52, communication: 89, teamwork: 76 },
      sixBySix: { fatigue: "High", productivity: "Weak", engagement: "Low" },
      risk: "High",
      recommendations: [
        "Reassign to different territory",
        "Provide sales training refresh",
        "Monitor performance closely",
        "Consider role transition"
      ],
      skills: ["CRM", "Negotiation", "Customer Service"],
      utilization: 45,
      lastReview: "2024-01-03"
    }
  };

  // Enhanced AI message processing with employee detection
  const sendMessage = async (message) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    let aiResponse = "";
    let detectedEmployees = [];
    let queryType = "general";

    // Check for employee name mentions
    const employeeNames = Object.keys(workforceData);
    const mentionedEmployees = employeeNames.filter(name =>
      message.toLowerCase().includes(name.toLowerCase())
    );

    if (mentionedEmployees.length > 0) {
      // Employee-specific query
      queryType = "employee_profile";
      detectedEmployees = mentionedEmployees.map(name => ({
        name,
        ...workforceData[name]
      }));
    } else {
      // General workforce queries
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("burnout risk") || lowerMessage.includes("fatigue") || lowerMessage.includes("burnout")) {
        queryType = "burnout_risk";
        detectedEmployees = Object.entries(workforceData)
          .filter(([_, data]) => data.fatigue > 70 || data.risk === "High")
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.fatigue - a.fatigue);
      } else if (lowerMessage.includes("reskill") || lowerMessage.includes("skill gap") || lowerMessage.includes("training")) {
        queryType = "reskilling";
        detectedEmployees = Object.entries(workforceData)
          .filter(([_, data]) => data.fitment < 80 || data.softSkills.leadership < 70)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => a.fitment - b.fitment);
      } else if (lowerMessage.includes("underutilized") || lowerMessage.includes("utilization") || lowerMessage.includes("underutil")) {
        queryType = "underutilized";
        detectedEmployees = Object.entries(workforceData)
          .filter(([_, data]) => data.utilization < 70)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => a.utilization - b.utilization);
      } else if (lowerMessage.includes("high risk") || lowerMessage.includes("risk")) {
        queryType = "high_risk";
        detectedEmployees = Object.entries(workforceData)
          .filter(([_, data]) => data.risk === "High")
          .map(([name, data]) => ({ name, ...data }));
      } else if (lowerMessage.includes("top performer") || lowerMessage.includes("high performer")) {
        queryType = "top_performers";
        detectedEmployees = Object.entries(workforceData)
          .filter(([_, data]) => data.fitment > 85 && data.fatigue < 50)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.fitment - a.fitment);
      }
    }

    // Generate response based on query type
    if (queryType === "employee_profile") {
      if (detectedEmployees.length === 1) {
        aiResponse = `**Employee Profile Found**\n\n• **Employee**: ${detectedEmployees[0].name}\n• **Details**: See the profile card below for comprehensive workforce intelligence`;
      } else {
        aiResponse = `**Multiple Employees Found**\n\n• **Count**: ${detectedEmployees.length} employees identified\n• **Details**: Review the profile cards below for individual workforce intelligence`;
      }
    } else if (queryType === "burnout_risk") {
      aiResponse = `**Burnout Risk Assessment**\n\n• **Priority**: High-risk employees identified\n• **Criteria**: Fatigue >70% or High risk classification\n• **Action**: Review employee cards below for detailed fatigue analysis`;
    } else if (queryType === "reskilling") {
      aiResponse = `**Reskilling Opportunities Identified**\n\n• **Focus**: Employees with fitment <80% or leadership <70%\n• **Priority**: Training and development candidates\n• **Details**: See profile cards for specific skill gap analysis`;
    } else if (queryType === "underutilized") {
      aiResponse = `**Underutilization Analysis**\n\n• **Issue**: Employees with utilization <70%\n• **Impact**: Potential productivity gaps\n• **Recommendation**: Consider workload redistribution`;
    } else if (queryType === "high_risk") {
      aiResponse = `**High-Risk Employee Alert**\n\n• **Risk Level**: Critical attention required\n• **Criteria**: High risk classification\n• **Action**: Immediate intervention recommended`;
    } else if (queryType === "top_performers") {
      aiResponse = `**Top Performer Recognition**\n\n• **Criteria**: Fitment >85% and Fatigue <50%\n• **Status**: High-performing team members\n• **Value**: Key contributors to organizational success`;
    } else {
      aiResponse = `**AI Workforce Assistant Ready**\n\nI can help you with workforce intelligence. Try asking about:\n\n• **Employee Profiles**: Mention a specific employee name\n• **Burnout Risk**: "Who is at burnout risk?"\n• **Reskilling Needs**: "Who should be reskilled?"\n• **Utilization Issues**: "Who is underutilized?"\n• **High-Risk Alerts**: "Show me high-risk employees"\n• **Top Performers**: "Who are our top performers?"\n\n**Example**: "Sarah Johnson" or "burnout risk"`;
    }

    const newMessage = {
      id: Date.now(),
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
      detectedEmployees: detectedEmployees,
      queryType: queryType
    };

    setMessages(prev => [...prev, newMessage]);
    setChatHistory(prev => [...prev, { userMessage: message, aiResponse: newMessage }]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const value = {
    messages,
    setMessages,
    isLoading,
    chatHistory,
    sendMessage,
    clearChat,
    workforceData
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
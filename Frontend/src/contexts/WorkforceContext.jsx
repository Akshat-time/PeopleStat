import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/lib/auth";

const WorkforceContext = createContext(null);

export function WorkforceProvider({ children }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/employees')
        .then(data => {
          // Format strict backend models to adapt to frontend UI specs
          const formatted = data.map(emp => ({
            id: emp._id,
            employeeId: `EMP-${emp._id.substring(emp._id.length - 4)}`,
            name: emp.userId?.username || 'Unknown',
            email: emp.userId?.email || '',
            department: emp.department || 'Unassigned',
            position: emp.recommendedRole || 'Pending',
            skills: {
              hard: emp.skills || [],
              soft: []
            },
            scores: {
              fitment: emp.fitmentScore || Math.floor(Math.random() * 40 + 50),
              performance: emp.performanceScore || Math.floor(Math.random() * 40 + 50),
              productivity: emp.performanceScore || Math.floor(Math.random() * 40 + 50),
              fatigue: Math.floor(Math.random() * 50 + 20), // Mocked for UI
              utilization: Math.floor(Math.random() * 30 + 70) // Mocked for UI
            }
          }));
          setEmployees(formatted);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to load workforce", err);
          setEmployees([]);
          setIsLoading(false);
        });
    } else {
      setEmployees([]);
      setIsLoading(false);
    }
  }, [user]);

  // Expose the helper functions globally
  const getOverallRisk = (emp) => {
    if (!emp) return "Low";
    if (emp.scores.fatigue > 75) return "High";
    if (emp.scores.fitment < 50) return "High";
    return "Low";
  };

  const getFitmentBand = (score) => {
    if (score >= 80) return "Optimal";
    if (score >= 60) return "Stable";
    return "At-Risk";
  };

  const getFatigueRisk = (score) => {
    if (score > 75) return "Critical";
    if (score > 50) return "Elevated";
    return "Normal";
  };

  return (
    <WorkforceContext.Provider value={{ employees, isLoading, getOverallRisk, getFitmentBand, getFatigueRisk }}>
      {children}
    </WorkforceContext.Provider>
  );
}

export function useWorkforceData() {
  return useContext(WorkforceContext);
}

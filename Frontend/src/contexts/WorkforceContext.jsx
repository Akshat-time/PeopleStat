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
        .then(response => {
          // Axios returns response object. Backend returns { success, data: [...] }
          const employeesList = response.data?.data || response.data || [];
          // Format strict backend models to adapt to frontend UI specs
          const formatted = employeesList.map(emp => {
            const wh = emp.workingHours || {};
            const hourKeys = [
              'customerInvoicing','invoicePosting','paymentProcessing','mdmSupport',
              'recordToReport','treasury','taxation','training','meetings','others'
            ];
            const totalHours = hourKeys.reduce((sum, k) => sum + (Number(wh[k]) || 0), 0);
            const utilization = totalHours > 0 ? Math.min(100, Math.round((totalHours / 160) * 100)) : 0;
            const meetings = Number(wh.meetings) || 0;
            const training = Number(wh.training) || 0;
            const overtimeFreq = totalHours > 0 ? ((meetings + training) / totalHours) * 100 : 0;
            const fatigue = totalHours > 0
              ? Math.min(100, Math.round(((totalHours / 160) * 100 * 0.6) + (overtimeFreq * 0.4)))
              : 0;

            return {
              id: emp._id,
              employeeId: emp.employeeMaster?.employeeId || `EMP-${emp._id?.slice(-4)}`,
              name: emp.employeeMaster?.employeeName || emp.userId?.username || 'Unknown',
              email: emp.userId?.email || '',
              department: emp.employeeMaster?.department || emp.department || 'Unassigned',
              position: emp.processCharacteristics?.designation || emp.recommendedRole || 'Pending',
              skills: {
                hard: emp.processCharacteristics?.coreSkills?.split(',').map(s => s.trim()).filter(Boolean) || [],
                soft: []
              },
              scores: {
                fitment: emp.fitmentScore || 0,
                performance: emp.performanceScore || 0,
                productivity: emp.performanceScore || 0,
                fatigue,
                utilization
              }
            };
          });
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

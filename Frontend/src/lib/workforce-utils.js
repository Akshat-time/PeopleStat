import { employees, getOverallRisk, calculateFTE } from "../data/mockEmployeeData";

/**
 * Aggregates workforce-wide KPIs from the mock data.
 */
export function getWorkforceKPIs(liveEmployees) {
    const data = liveEmployees || employees;
    const count = data.length;
    if (count === 0) return {
        totalEmployees: 0,
        avgFitment: 0,
        burnoutRisk: 0,
        automationSavings: "0.0M",
        rawAutomationSavings: 0
    };

    const avgFitment = data.reduce((sum, e) => sum + (e.scores?.fitment || e.fitmentScore || 0), 0) / count;
    const highFatigue = data.filter(e => (e.scores?.fatigue || 0) >= 75).length;
    const highFatiguePct = (highFatigue / count) * 100;

    const totalAutomationSavings = data.reduce((sum, e) => {
        const potential = e.scores?.automationPotential || 0;
        return sum + (potential * (e.salary || 0) / 100);
    }, 0);

    return {
        totalEmployees: count,
        avgFitment: Math.round(avgFitment),
        burnoutRisk: Math.round(highFatiguePct),
        automationSavings: (totalAutomationSavings / 1000000).toFixed(1) + "M",
        rawAutomationSavings: totalAutomationSavings
    };
}

/**
 * Gets department-level distributions for charts.
 */
export function getDepartmentDistributions(liveEmployees) {
    const data = liveEmployees || employees;
    const departments = [...new Set(data.map(e => e.department))];

    return departments.map(dept => {
        const deptEmps = data.filter(e => e.department === dept);
        if (deptEmps.length === 0) return { name: dept, fitment: 0, count: 0, utilization: 0 };
        const avgFitment = deptEmps.reduce((sum, e) => sum + (e.scores?.fitment || e.fitmentScore || 0), 0) / deptEmps.length;
        return {
            name: dept,
            fitment: Math.round(avgFitment),
            count: deptEmps.length,
            utilization: Math.round(deptEmps.reduce((sum, e) => sum + (e.scores?.utilization || e.utilization || 0), 0) / deptEmps.length)
        };
    });
}

/**
 * Generates AI workforce signals based on real data scans.
 */
export function getAISignals(liveEmployees) {
    const data = liveEmployees || employees;
    const signals = [];

    const highFatigue = data.filter(e => (e.scores?.fatigue || 0) >= 75);
    if (highFatigue.length > 0) {
        signals.push({
            type: "fatigue",
            message: `${highFatigue.length} employees in burnout risk cluster`,
            impacted: highFatigue.map(e => e.name),
            path: "/fatigue"
        });
    }

    const lowFitment = data.filter(e => (e.scores?.fitment || e.fitmentScore || 0) < 70);
    if (lowFitment.length > 0) {
        signals.push({
            type: "fitment",
            message: `${lowFitment.length} potential skill misalignments detected`,
            impacted: lowFitment.map(e => e.name),
            path: "/fitment"
        });
    }

    const automationCandidates = data.filter(e => (e.scores?.automationPotential || 0) >= 70);
    if (automationCandidates.length > 0) {
        signals.push({
            type: "automation",
            message: `${automationCandidates.length} roles ready for automation-led optimization`,
            impacted: automationCandidates.map(e => e.name),
            path: "/workforce-intelligence"
        });
    }

    return signals;
}

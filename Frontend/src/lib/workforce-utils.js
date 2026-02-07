import { employees, getOverallRisk, calculateFTE } from "../data/mockEmployeeData";

/**
 * Aggregates workforce-wide KPIs from the mock data.
 */
export function getWorkforceKPIs() {
    const count = employees.length;
    if (count === 0) return {};

    const avgFitment = employees.reduce((sum, e) => sum + e.scores.fitment, 0) / count;
    const highFatigue = employees.filter(e => e.scores.fatigue >= 75).length;
    const highFatiguePct = (highFatigue / count) * 100;

    const totalAutomationSavings = employees.reduce((sum, e) => {
        return sum + (e.scores.automationPotential * e.salary / 100);
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
export function getDepartmentDistributions() {
    const departments = [...new Set(employees.map(e => e.department))];

    return departments.map(dept => {
        const deptEmps = employees.filter(e => e.department === dept);
        const avgFitment = deptEmps.reduce((sum, e) => sum + e.scores.fitment, 0) / deptEmps.length;
        return {
            name: dept,
            fitment: Math.round(avgFitment),
            count: deptEmps.length,
            utilization: Math.round(deptEmps.reduce((sum, e) => sum + e.scores.utilization, 0) / deptEmps.length)
        };
    });
}

/**
 * Generates AI workforce signals based on real data scans.
 */
export function getAISignals() {
    const signals = [];

    const highFatigue = employees.filter(e => e.scores.fatigue >= 75);
    if (highFatigue.length > 0) {
        signals.push({
            type: "fatigue",
            message: `${highFatigue.length} employees in burnout risk cluster`,
            impacted: highFatigue.map(e => e.name),
            path: "/fatigue"
        });
    }

    const lowFitment = employees.filter(e => e.scores.fitment < 70);
    if (lowFitment.length > 0) {
        signals.push({
            type: "fitment",
            message: `${lowFitment.length} potential skill misalignments detected`,
            impacted: lowFitment.map(e => e.name),
            path: "/fitment"
        });
    }

    const automationCandidates = employees.filter(e => e.scores.automationPotential >= 70);
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

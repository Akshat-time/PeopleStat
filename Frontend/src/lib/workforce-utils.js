/**
 * Aggregates workforce-wide KPIs from the dynamic data.
 */
export function getWorkforceKPIs(employees = []) {
    const count = employees.length;
    if (count === 0) return { totalEmployees: 0, avgFitment: 0, burnoutRisk: 0, automationSavings: "0M", rawAutomationSavings: 0 };

    const avgFitment = employees.reduce((sum, e) => sum + (e.scores?.fitment || 0), 0) / count;
    const highFatigue = employees.filter(e => (e.scores?.fatigue || 0) >= 75).length;
    const highFatiguePct = (highFatigue / count) * 100;

    const totalAutomationSavings = employees.reduce((sum, e) => {
        return sum + ((e.scores?.automationPotential || 50) * (e.salary || 80000) / 100);
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
export function getDepartmentDistributions(employees = []) {
    const departments = [...new Set(employees.map(e => e.department))];

    return departments.map(dept => {
        const deptEmps = employees.filter(e => e.department === dept);
        const avgFitment = deptEmps.reduce((sum, e) => sum + (e.scores?.fitment || 0), 0) / deptEmps.length;
        return {
            name: dept,
            fitment: Math.round(avgFitment),
            count: deptEmps.length,
            utilization: Math.round(deptEmps.reduce((sum, e) => sum + (e.scores?.utilization || 0), 0) / deptEmps.length)
        };
    });
}

/**
 * Generates AI workforce signals based on real data scans.
 */
export function getAISignals(employees = []) {
    const signals = [];

    const highFatigue = employees.filter(e => (e.scores?.fatigue || 0) >= 75);
    if (highFatigue.length > 0) {
        signals.push({
            type: "fatigue",
            message: `${highFatigue.length} employees in burnout risk cluster`,
            impacted: highFatigue.map(e => e.name),
            path: "/fatigue"
        });
    }

    const lowFitment = employees.filter(e => (e.scores?.fitment || 0) < 70);
    if (lowFitment.length > 0) {
        signals.push({
            type: "fitment",
            message: `${lowFitment.length} potential skill misalignments detected`,
            impacted: lowFitment.map(e => e.name),
            path: "/fitment"
        });
    }

    const automationCandidates = employees.filter(e => (e.scores?.automationPotential || 0) >= 70);
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

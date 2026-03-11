import Employee from "../models/Employee.js";

export const addEmployee = async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.json({ success: true, data: emp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const data = await Employee.find();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadBulkEmployees = async (req, res) => {
  try {
    const { employees } = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ error: 'No employees provided' });
    }

    const savedEmployees = [];
    for (const emp of employees) {
      try {
        const userid = emp.userid || `EMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const employeeDoc = await Employee.findOneAndUpdate(
          { email: emp.email },
          {
            userid,
            name: emp.name,
            email: emp.email,
            department: emp.department || '',
            position: emp.position || '',
            salary: emp.salary ? parseInt(emp.salary) : 0,
            productivity: emp.productivity ? parseInt(emp.productivity) : 0,
            utilization: emp.utilization ? parseInt(emp.utilization) : 0,
            fitmentScore: emp.fitmentScore ? parseFloat(emp.fitmentScore) : 0,
            updatedAt: new Date(),
          },
          { 
            upsert: true, 
            new: true,
            runValidators: false 
          }
        );
        
        savedEmployees.push(employeeDoc);
      } catch (err) {
        console.error(`Error saving employee ${emp.email}:`, err.message);
      }
    }

    res.json({
      success: true,
      count: savedEmployees.length,
      employees: savedEmployees,
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeStats = async (req, res) => {
  try {
    const employees = await Employee.find();
    
    if (employees.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalEmployees: 0,
          avgFitmentScore: 0,
          avgProductivity: 0,
          avgUtilization: 0,
          highPerformers: 0,
          lowUtilization: 0,
        },
      });
    }

    const totalEmployees = employees.length;
    const avgFitmentScore = employees.reduce((sum, e) => sum + (e.fitmentScore || 0), 0) / totalEmployees;
    const avgProductivity = employees.reduce((sum, e) => sum + (e.productivity || 0), 0) / totalEmployees;
    const avgUtilization = employees.reduce((sum, e) => sum + (e.utilization || 0), 0) / totalEmployees;
    const highPerformers = employees.filter(e => (e.productivity || 0) > 90).length;
    const lowUtilization = employees.filter(e => (e.utilization || 0) < 50).length;

    res.json({
      success: true,
      stats: {
        totalEmployees,
        avgFitmentScore: parseFloat(avgFitmentScore.toFixed(2)),
        avgProductivity: parseFloat(avgProductivity.toFixed(2)),
        avgUtilization: parseFloat(avgUtilization.toFixed(2)),
        highPerformers,
        lowUtilization,
      },
      employees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

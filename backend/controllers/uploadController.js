import multer from 'multer';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import JobDescription from '../models/jobDescriptions.js';
import cvUploads from '../models/cvUploads.js';
import ActivityUpload from '../models/activityUploads.js';
import Employee from '../models/Employee.js';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mock parsing functions (replace with real parsing libraries later)
const parseJD = (buffer, filename) => {
  // Mock JD parsing - in real implementation, use pdf-parse or mammoth
  const mockData = {
    title: "Software Engineer",
    description: "We are looking for a skilled software engineer with experience in JavaScript, React, and Node.js.",
    department: "Engineering",
    requiredSkills: ["JavaScript", "React", "Node.js"],
    preferredSkills: ["TypeScript", "AWS"],
    experienceRequired: 3,
    responsibilities: ["Develop web applications", "Collaborate with team", "Write clean code"],
    location: "Remote"
  };
  return mockData;
};

const parseCV = (buffer, filename) => {
  // Mock CV parsing - in real implementation, use pdf-parse or mammoth
  const mockData = {
    candidateName: "John Doe",
    email: "john.doe@example.com",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    experience: "5 years of software development experience",
    education: "Bachelor's in Computer Science"
  };
  return mockData;
};

const parseActivityCSV = (buffer, filename) => {
  // Mock CSV parsing - in real implementation, use csv-parser
  const mockActivities = [
    {
      user: "john@company.com",
      activityType: "meeting",
      date: new Date("2025-01-15"),
      durationMinutes: 60,
      tower: "Engineering",
      category: "Development"
    },
    {
      user: "jane@company.com",
      activityType: "coding",
      date: new Date("2025-01-15"),
      durationMinutes: 120,
      tower: "Engineering",
      category: "Development"
    }
  ];
  return mockActivities;
};

// Upload JD
export const uploadJD = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const parsedData = parseJD(req.file.buffer, req.file.originalname);

    const jd = new JobDescription({
      jdId: `JD_${Date.now()}`,
      title: parsedData.title,
      department: parsedData.department,
      location: parsedData.location,
      requiredSkills: parsedData.requiredSkills,
      preferredSkills: parsedData.preferredSkills,
      experienceRequired: parsedData.experienceRequired,
      responsibilities: parsedData.responsibilities,
      createdBy: req.user?.id // Assuming auth middleware sets req.user
    });

    await jd.save();

    res.json({
      success: true,
      jobDescription: parsedData
    });
  } catch (error) {
    console.error('JD upload error:', error);
    res.status(500).json({ error: 'Failed to upload job description' });
  }
};

// Upload CV
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const parsedData = parseCV(req.file.buffer, req.file.originalname);

    const cv = new cvUploads({
      candidateName: parsedData.candidateName,
      email: parsedData.email,
      skills: parsedData.skills,
      experience: parsedData.experience,
      education: parsedData.education,
      uploadedAt: new Date(),
      uploadedBy: req.user?.id
    });

    await cv.save();

    res.json({
      success: true,
      cv: parsedData
    });
  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({ error: 'Failed to upload CV' });
  }
};

// Upload Activity Data
export const uploadActivity = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const activities = parseActivityCSV(req.file.buffer, req.file.originalname);

    // Save all activities
    const savedActivities = await ActivityUpload.insertMany(
      activities.map(activity => ({
        ...activity,
        uploadedBy: req.user?.id
      }))
    );

    res.json({
      success: true,
      count: savedActivities.length,
      activities: activities.slice(0, 10) // Return first 10 for preview
    });
  } catch (error) {
    console.error('Activity upload error:', error);
    res.status(500).json({ error: 'Failed to upload activity data' });
  }
};

// Parse employee data from different file formats
const parseEmployeeData = (buffer, filename) => {
  const fileExtension = filename.split('.').pop().toLowerCase();

  if (fileExtension === 'csv') {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      bufferStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  } else if (fileExtension === 'json') {
    const jsonString = buffer.toString('utf8');
    return JSON.parse(jsonString);
  } else {
    throw new Error('Unsupported file format. Please upload CSV, Excel (.xlsx/.xls), or JSON files.');
  }
};

// Upload Employee Data
export const uploadEmployeeData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const rawData = await parseEmployeeData(req.file.buffer, req.file.originalname);

    // Normalize data - handle both array and single object
    const employees = Array.isArray(rawData) ? rawData : [rawData];

    const savedEmployees = [];
    const errors = [];

    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      try {
        // Generate userid if not provided
        const userid = emp.userid || emp.userId || emp.id || `EMP_${Date.now()}_${i}`;

        // Validate required fields
        if (!emp.name && !emp.Name && !emp.email && !emp.Email) {
          errors.push(`Row ${i + 1}: Missing required fields (name and email)`);
          continue;
        }

        const employeeDoc = await Employee.findOneAndUpdate(
          { email: emp.email || emp.Email },
          {
            userid,
            name: emp.name || emp.Name || '',
            email: emp.email || emp.Email,
            department: emp.department || emp.Department || '',
            position: emp.position || emp.Position || emp.role || emp.Role || '',
            salary: emp.salary || emp.Salary ? parseInt(emp.salary || emp.Salary) : 0,
            productivity: emp.productivity || emp.Productivity ? parseInt(emp.productivity || emp.Productivity) : 0,
            utilization: emp.utilization || emp.Utilization ? parseInt(emp.utilization || emp.Utilization) : 0,
            fitmentScore: emp.fitmentScore || emp.FitmentScore || emp.fitment_score ? parseFloat(emp.fitmentScore || emp.FitmentScore || emp.fitment_score) : 0,
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
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    // Get updated stats after upload
    const totalEmployees = await Employee.countDocuments();
    const allEmployees = await Employee.find();
    const avgFitmentScore = allEmployees.length > 0 ? allEmployees.reduce((sum, e) => sum + (e.fitmentScore || 0), 0) / allEmployees.length : 0;
    const avgProductivity = allEmployees.length > 0 ? allEmployees.reduce((sum, e) => sum + (e.productivity || 0), 0) / allEmployees.length : 0;
    const avgUtilization = allEmployees.length > 0 ? allEmployees.reduce((sum, e) => sum + (e.utilization || 0), 0) / allEmployees.length : 0;
    const highPerformers = allEmployees.filter(e => (e.productivity || 0) > 90).length;
    const lowUtilization = allEmployees.filter(e => (e.utilization || 0) < 50).length;

    res.json({
      success: true,
      count: savedEmployees.length,
      totalEmployees,
      employees: savedEmployees.slice(0, 10), // Return first 10 for preview
      analysis: {
        totalEmployees,
        avgFitmentScore: parseFloat(avgFitmentScore.toFixed(2)),
        avgProductivity: parseFloat(avgProductivity.toFixed(2)),
        avgUtilization: parseFloat(avgUtilization.toFixed(2)),
        highPerformers,
        lowUtilization,
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Employee data upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload employee data' });
  }
};

// Get upload stats
export const getUploadStats = async (req, res) => {
  try {
    const jdCount = await JobDescription.countDocuments();
    const cvCount = await cvUploads.countDocuments();
    const activityCount = await ActivityUpload.countDocuments();
    const employeeCount = await Employee.countDocuments();

    const stats = [
      { type: 'jd', count: jdCount },
      { type: 'cv', count: cvCount },
      { type: 'activity', count: activityCount },
      { type: 'employee', count: employeeCount }
    ];

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get upload stats' });
  }
};

// Export multer middleware
export const uploadMiddleware = upload.single('file');

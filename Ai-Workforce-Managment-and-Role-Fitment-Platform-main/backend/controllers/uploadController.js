import multer from 'multer';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import * as pdf from 'pdf-parse';
import { findBestMatch } from 'string-similarity';
import JobDescription from '../models/jobDescriptions.js';
import cvUploads from '../models/cvUploads.js';
import ActivityUpload from '../models/activityUploads.js';
import Employee from '../models/Employee.js';

const pdfParse = pdf.default || pdf;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ===== HELPER FUNCTIONS FOR AUTO-MAPPING =====

/**
 * Extracted field mappings for Employee schema
 */
const EMPLOYEE_SCHEMA_FIELDS = {
  name: 'Full Name / Employee Name',
  email: 'Email Address / Email',
  department: 'Department / Dept / Division / Sector',
  position: 'Position / Job Title / Title / Role',
  salary: 'Salary / Compensation / Annual Salary',
  joiningDate: 'Joining Date / Start Date / DOJ / Date of Joining',
  experience: 'Years of Experience / Experience / Exp / YoE',
  softskills: 'Soft Skills / Communication Skills',
  performance: 'Performance / Performance Rating',
  location: 'Location / Office Location / Work Location',
  productivity: 'Productivity / Productivity Score',
  utilization: 'Utilization / Utilization Rate / Utils',
  fitmentScore: 'Fitment Score / Fitment / Role Fit',
  currentRole: 'Current Role',
  recommendedRole: 'Recommended Role',
};

/**
 * Fuzzy match a column header to Employee schema fields
 * Returns array of suggestions with confidence scores
 */
const detectColumnMappings = (headers) => {
  const mappings = [];
  const mappedFields = new Set();

  headers.forEach((header) => {
    const headerLower = header.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    // Try to find best matching field
    Object.entries(EMPLOYEE_SCHEMA_FIELDS).forEach(([field, description]) => {
      const descriptionVariants = description.split('/').map(s => s.toLowerCase().trim());
      
      // Check exact matches first
      const exactMatch = descriptionVariants.some(variant => variant === headerLower);
      if (exactMatch) {
        bestMatch = field;
        highestScore = 100;
        return;
      }

      // Check partial matches
      descriptionVariants.forEach(variant => {
        const score = getSimilarityScore(headerLower, variant);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = field;
        }
      });
    });

    mappings.push({
      uploadedColumn: header,
      suggestedField: bestMatch || null,
      confidence: highestScore,
      availableFields: Object.keys(EMPLOYEE_SCHEMA_FIELDS),
      description: bestMatch ? EMPLOYEE_SCHEMA_FIELDS[bestMatch] : null
    });
  });

  return mappings;
};

/**
 * Calculate similarity score between two strings (0-100)
 * Uses simple character matching algorithm
 */
const getSimilarityScore = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 100;

  const editDistance = getLevenshteinDistance(longer, shorter);
  return ((longer.length - editDistance) / longer.length) * 100;
};

/**
 * Calculate Levenshtein distance between two strings
 */
const getLevenshteinDistance = (s1, s2) => {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

/**
 * Extract text from PDF buffer
 */
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Validate and normalize employee data
 */
const validateEmployeeData = (data, columnMapping) => {
  const errors = [];
  const normalized = {};

  // Apply column mapping to normalize field names
  Object.entries(columnMapping).forEach(([uploadedCol, targetField]) => {
    if (targetField && data[uploadedCol] !== undefined) {
      normalized[targetField] = data[uploadedCol];
    }
  });

  // Validate required fields
  if (!normalized.name || typeof normalized.name !== 'string') {
    errors.push('Missing or invalid name field');
  }
  if (!normalized.email || typeof normalized.email !== 'string') {
    errors.push('Missing or invalid email field');
  }

  // Validate data types
  if (normalized.salary && isNaN(parseInt(normalized.salary))) {
    errors.push('Salary must be a number');
  }
  if (normalized.productivity && isNaN(parseInt(normalized.productivity))) {
    errors.push('Productivity must be a number');
  }
  if (normalized.utilization && isNaN(parseInt(normalized.utilization))) {
    errors.push('Utilization must be a number');
  }
  if (normalized.fitmentScore && isNaN(parseFloat(normalized.fitmentScore))) {
    errors.push('Fitment score must be a number');
  }

  return { normalized, errors };
};

// ===== MOCK PARSING FUNCTIONS =====
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
const parseEmployeeData = async (buffer, filename) => {
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
  } else if (fileExtension === 'pdf') {
    // For PDF, we extract text but can't automatically extract structured data
    // Return a message indicating manual mapping is needed
    return { isPDF: true, message: 'PDF requires manual data mapping' };
  } else {
    throw new Error('Unsupported file format. Please upload CSV, Excel (.xlsx/.xls), JSON, or PDF files.');
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

/**
 * Get column mapping suggestions for a file without uploading data
 * Used for preview and mapping configuration
 */
export const getSuggestedMappings = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const supportedFormats = ['csv', 'xlsx', 'xls', 'json', 'pdf'];
    
    if (!supportedFormats.includes(fileExtension)) {
      return res.status(400).json({ 
        error: `Unsupported file format: ${fileExtension}. Supported: ${supportedFormats.join(', ')}` 
      });
    }

    let parsedData;
    let headers = [];
    let preview = [];

    try {
      parsedData = await parseEmployeeData(req.file.buffer, req.file.originalname);
    } catch (error) {
      return res.status(400).json({ error: `Failed to parse file: ${error.message}` });
    }

    // Extract headers and preview data
    if (fileExtension === 'pdf') {
      return res.status(400).json({
        error: 'PDF files require manual data extraction. Please convert to CSV, Excel, or JSON format.'
      });
    }

    if (Array.isArray(parsedData) && parsedData.length > 0) {
      headers = Object.keys(parsedData[0]);
      preview = parsedData.slice(0, 5);
    } else if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
      headers = Object.keys(parsedData);
      preview = [parsedData];
    }

    if (headers.length === 0) {
      return res.status(400).json({ error: 'Could not extract headers from file' });
    }

    // Get mapping suggestions
    const mappingSuggestions = detectColumnMappings(headers);

    // Validate preview data
    const validationResults = preview.map((row, index) => {
      const columnMapping = {};
      mappingSuggestions.forEach(mapping => {
        if (mapping.suggestedField) {
          columnMapping[mapping.uploadedColumn] = mapping.suggestedField;
        }
      });
      
      const { normalized, errors } = validateEmployeeData(row, columnMapping);
      return {
        rowIndex: index + 1,
        data: normalized,
        errors: errors.length > 0 ? errors : []
      };
    });

    res.json({
      success: true,
      filename: req.file.originalname,
      fileType: fileExtension,
      headers,
      totalRows: Array.isArray(parsedData) ? parsedData.length : 1,
      mappingSuggestions,
      preview: validationResults,
      schemaFields: EMPLOYEE_SCHEMA_FIELDS
    });
  } catch (error) {
    console.error('Mapping suggestion error:', error);
    res.status(500).json({ error: error.message || 'Failed to get mapping suggestions' });
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

const Employee = require('../models/Employee');
const pdfParse = require('pdf-parse');
const { extractSkillsFromText } = require('../ai-engine/nlpExtractor');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No resume file uploaded' });

    let textContent = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      textContent = data.text;
    } else {
      textContent = req.file.buffer.toString('utf-8');
    }

    const extractedSkills = extractSkillsFromText(textContent);

    let employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

    const newSkills = Array.from(new Set([...employee.skills, ...extractedSkills]));
    employee.skills = newSkills;
    await employee.save();

    res.json({ success: true, data: { message: 'Resume parsed successfully', extractedSkills, employee } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const data = await Employee.find().populate('userId', 'username email role');
    res.json({ success: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

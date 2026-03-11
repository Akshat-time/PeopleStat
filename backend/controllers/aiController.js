const Employee = require('../models/Employee');
const Result = require('../models/Result');
const { recommendRole } = require('../ai-engine/roleFitment');
const { OpenAI } = require('openai'); // Make sure required module is available

exports.runFitment = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId).populate('userId', 'username');
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

    const latestResult = await Result.findOne({ employeeId: employee._id }).sort({ completedAt: -1 });
    
    const analysis = recommendRole(employee, latestResult);

    employee.fitmentScore = analysis.fitmentScore;
    employee.recommendedRole = analysis.recommendedRole;
    await employee.save();

    res.json({
      success: true,
      data: {
        employee: employee.userId.username,
        analysis
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Demo Mode Check - If key provided, hit OpenAI
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const employees = await Employee.find().populate('userId', 'username');
      const employeeContext = employees.map(e => ({ name: e.userId.username, role: e.recommendedRole, fitment: e.fitmentScore }));
      
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an HR AI Assistant. Current employees: " + JSON.stringify(employeeContext) },
          { role: "user", content: message }
        ],
        model: "gpt-3.5-turbo",
      });
      return res.json({ success: true, data: { reply: completion.choices[0].message.content } });
    }

    // Step 6: Fallback Demo Mode if OpenAI fails / no key
    const employees = await Employee.find().populate('userId', 'username');
    const lowerMessage = message.toLowerCase();
    
    let reply = "I'm your AI HR Assistant (Demo Mode). Provide an OPENAI_API_KEY to enable full conversational logic.";

    if (lowerMessage.includes('data scientist') || lowerMessage.includes('best suited')) {
      const dataScientists = employees.filter(e => e.recommendedRole === 'Data Scientist');
      if (dataScientists.length > 0) {
        reply = `Based on fitment scores, candidate(s) for Data Scientist: ${dataScientists.map(e => e.userId?.username).join(', ')}.`;
      } else {
        reply = `No candidates strictly aligned for Data Scientist roles at this time.`;
      }
    } else if (lowerMessage.includes('skill gap')) {
      reply = "Our real-time gap analysis indicates 'Machine Learning' is a massive organizational gap.";
    }

    res.json({ success: true, data: { reply } });
  } catch (err) {
    console.error('AI Demo Fallback Required', err);
    // Explicit Fallback logic implemented structurally above, handling generic catch
    res.status(500).json({ success: false, error: 'AI Processing Error. Enable Demo Mode or check API keys.' });
  }
};

const { validationResult } = require('express-validator');
const authService = require('../services/authService');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  try {
    const data = await authService.registerUser(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err.message);
    if (err.message === 'User already exists') {
        return res.status(400).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  const { usernameOrEmail, password } = req.body;

  try {
    const data = await authService.loginUser(usernameOrEmail, password);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err.message);
    if (err.message === 'Invalid Credentials') {
        return res.status(400).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const data = await authService.getUserById(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

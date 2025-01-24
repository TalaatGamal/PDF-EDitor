const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // استدعاء موديل المستخدم

const router = express.Router();

// **Route 1: Sign Up (تسجيل مستخدم جديد)**
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // تحقق من البيانات
  if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

  // تحقق لو المستخدم موجود
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already exists' });

  // إنشاء مستخدم جديد
  const user = new User({ email, password });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// **Route 2: Login (تسجيل الدخول)**
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // تحقق من الإيميل
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  // تحقق من الباسوورد
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  // إنشاء JWT Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, message: 'Login successful' });
});

module.exports = router;

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

// Admin seed karo agar exist na kare
const seedAdmin = async () => {
  const existing = await Admin.findOne({ email: 'sulemanzaheer09@gmail.com' });
  if (!existing) {
    await Admin.create({
      email: 'sulemanzaheer09@gmail.com',
      password: 'Samual123@',
      name: 'Suleman Zaheer',
    });
    console.log('Admin seeded successfully');
  }
};

// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    await connectDB();
    await seedAdmin();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email aur password daalna zaroori hai' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    const isProd = process.env.NODE_ENV === 'production';
    res.status(500).json({ 
      message: 'Authentication service temporarily unavailable. Please try again.',
      ...(isProd ? {} : { details: error.message })
    });
  }
};

// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    await connectDB();
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getMe };


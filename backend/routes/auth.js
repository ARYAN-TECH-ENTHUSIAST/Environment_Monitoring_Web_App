const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      location: user.location || null
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// USER REGISTER (username, email, location, password)
router.post('/register-user', async (req, res) => {
  try {
    const { username, email, location, password } = req.body;

    if (!username || !email || !location || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      location,
      passwordHash,
      role: 'user'
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (err) {
    console.error('register-user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN REGISTER (email, password)
router.post('/register-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      email,
      passwordHash,
      role: 'admin'
    });

    const token = createToken(admin);

    res.status(201).json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('register-admin error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// USER LOGIN
router.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (err) {
    console.error('login-user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN LOGIN
router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found with this email' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = createToken(admin);

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('login-admin error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

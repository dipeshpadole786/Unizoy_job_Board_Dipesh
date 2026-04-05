const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');

  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const login = async (req, res, next) => {
  try {
    const { name, email, role, resume } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const desiredRole = role || 'user';
    const trimmedResume = typeof resume === 'string' ? resume.trim() : '';

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        role: desiredRole,
        resume: trimmedResume,
      });
    } else {
      user.name = String(name).trim();
      user.role = desiredRole;
      if (trimmedResume) user.resume = trimmedResume;
      await user.save();
    }

    const token = signToken(user);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resume: user.resume || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };


import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/* ======================
   JWT Helper
====================== */
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/* ======================
   REGISTER
====================== */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .isIn(['admin', 'officer', 'citizen'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'User already exists with this email' });
      }

      // ✅ DO NOT HASH HERE
      const user = await User.create({
        name,
        email,
        password, // plain password → model hashes it
        role,
      });

      const token = signToken(user._id);

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {
      console.error('REGISTER ERROR 🔥:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

/* ======================
   LOGIN
====================== */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      console.log('Login attempt for:', email);

      const user = await User.findOne({ email });
      console.log('User found:', user ? 'YES' : 'NO');
      
      if (!user) {
        console.log('User not found in DB');
        return res
          .status(401)
          .json({ message: 'Invalid email or password' });
      }

      const isMatch = await (await import('bcryptjs')).default.compare(
        password,
        user.password
      );
      
      console.log('Password match:', isMatch);

      if (!isMatch) {
         console.log('Password mismatch');
        return res
          .status(401)
          .json({ message: 'Invalid email or password' });
      }

      const token = signToken(user._id);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {
      console.error('LOGIN ERROR 🔥:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

export default router;

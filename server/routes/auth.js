import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'University ID/Email and password are required' });
    }

    // Query user by university_id or email
    const [users] = await pool.execute(
      `SELECT u.*, c.club_name, c.logo_url 
       FROM users u 
       LEFT JOIN clubs c ON u.club_id = c.club_id 
       WHERE u.university_id = ? OR u.email = ?`,
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash).catch(() => false);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Only allow CLUB_LEADER, SU_ADMIN, and STUDENT_LIFE_ADMIN to login
    if (!['CLUB_LEADER', 'SU_ADMIN', 'STUDENT_LIFE_ADMIN'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Only club leaders and admins can access the dashboard.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        club_id: user.club_id,
        email: user.email
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      token,
      user: {
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        club_id: user.club_id,
        club_name: user.club_name,
        logo_url: user.logo_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.user_id, u.fullname, u.email, u.role, u.club_id, c.club_name, c.logo_url 
       FROM users u 
       LEFT JOIN clubs c ON u.club_id = c.club_id 
       WHERE u.user_id = ?`,
      [req.user.user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get club by ID
router.get('/:clubId', authenticateToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;

    // Check if user has access to this club
    if (userRole === 'CLUB_LEADER' && req.user.club_id !== parseInt(clubId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [clubs] = await pool.execute(
      'SELECT * FROM clubs WHERE club_id = ?',
      [clubId]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ error: 'Club not found' });
    }

    res.json(clubs[0]);
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get club dashboard metrics
router.get('/:clubId/metrics', authenticateToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.user_id;
    const userRole = req.user.role;

    // Check if user has access to this club
    if (userRole === 'CLUB_LEADER' && req.user.club_id !== parseInt(clubId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get total members (stored directly in clubs table)
    const [club] = await pool.execute(
      'SELECT total_members FROM clubs WHERE club_id = ?',
      [clubId]
    );
    const total_members = club[0]?.total_members || 0;

    // Get pending requests
    const [requests] = await pool.execute(
      `SELECT COUNT(*) as count FROM requests 
       WHERE club_id = ? AND status = 'PENDING'`,
      [clubId]
    );
    const pending_requests = requests[0].count;

    // Get upcoming events
    const [events] = await pool.execute(
      `SELECT COUNT(*) as count FROM events 
       WHERE club_id = ? AND status = 'Approved' AND event_date >= CURDATE()`,
      [clubId]
    );
    const upcoming_events = events[0].count;

    // Get current budget
    const [budget] = await pool.execute(
      'SELECT budget FROM clubs WHERE club_id = ?',
      [clubId]
    );
    const current_budget = budget[0]?.budget || 0;

    res.json({
      total_members,
      pending_requests,
      upcoming_events,
      current_budget
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all clubs (admin only)
router.get('/', authenticateToken, requireRole('SU_ADMIN', 'STUDENT_LIFE_ADMIN'), async (req, res) => {
  try {
    const [clubs] = await pool.execute('SELECT * FROM clubs ORDER BY club_name');
    res.json(clubs);
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


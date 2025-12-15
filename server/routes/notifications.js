import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [notifications] = await pool.execute(
      `SELECT notification_id, title, message, type, is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.user_id;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?',
      [notificationId, userId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


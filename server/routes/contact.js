const express = require('express');
const { queryAll, runSql } = require('../database');
const { authenticateAdmin } = require('../middleware/auth'); // 👈 Security Guard ko bulaya
const router = express.Router();

// Public route (Form submission)
router.post('/', (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });
        runSql('INSERT INTO contacts (name, phone, email, subject, message) VALUES (?,?,?,?,?)', [name, phone||null, email, subject||null, message]);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) { res.status(500).json({ error: 'Failed to send message' }); }
});

// 🔒 SECURED: Only logged-in admin can read messages
router.get('/', authenticateAdmin, (req, res) => {
    try { res.json(queryAll('SELECT * FROM contacts ORDER BY created_at DESC')); }
    catch (err) { res.status(500).json({ error: 'Failed to fetch contacts' }); }
});

// 🔒 SECURED: Only admin can mark as read
router.put('/:id/read', authenticateAdmin, (req, res) => {
    try { runSql('UPDATE contacts SET is_read = 1 WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

// 🔒 SECURED: Only admin can delete messages
router.delete('/:id', authenticateAdmin, (req, res) => {
    try { runSql('DELETE FROM contacts WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
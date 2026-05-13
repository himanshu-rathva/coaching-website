const express = require('express');
const { queryAll, queryOne, runSql } = require('../database');
const { authenticateAdmin, loginAdmin, logoutAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
        const result = loginAdmin(username, password);
        if (!result) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ success: true, ...result });
    } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

router.post('/logout', (req, res) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (token) logoutAdmin(token);
    res.json({ success: true });
});

router.get('/stats', authenticateAdmin, (req, res) => {
    try {
        res.json({
            totalEnquiries: queryOne('SELECT COUNT(*) as count FROM enquiries').count,
            newEnquiries: queryOne("SELECT COUNT(*) as count FROM enquiries WHERE status = 'new'").count,
            totalContacts: queryOne('SELECT COUNT(*) as count FROM contacts').count,
            unreadContacts: queryOne('SELECT COUNT(*) as count FROM contacts WHERE is_read = 0').count,
            totalResults: queryOne('SELECT COUNT(*) as count FROM results').count,
            totalTestimonials: queryOne('SELECT COUNT(*) as count FROM testimonials').count,
        });
    } catch (err) { res.status(500).json({ error: 'Failed to fetch stats' }); }
});

router.get('/verify', authenticateAdmin, (req, res) => { res.json({ success: true, admin: req.admin }); });

module.exports = router;

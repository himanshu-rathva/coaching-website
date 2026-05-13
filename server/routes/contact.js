const express = require('express');
const { queryAll, runSql } = require('../database');
const router = express.Router();

router.post('/', (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });
        runSql('INSERT INTO contacts (name, phone, email, subject, message) VALUES (?,?,?,?,?)', [name, phone||null, email, subject||null, message]);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) { res.status(500).json({ error: 'Failed to send message' }); }
});

router.get('/', (req, res) => {
    try { res.json(queryAll('SELECT * FROM contacts ORDER BY created_at DESC')); }
    catch (err) { res.status(500).json({ error: 'Failed to fetch contacts' }); }
});

router.put('/:id/read', (req, res) => {
    try { runSql('UPDATE contacts SET is_read = 1 WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

router.delete('/:id', (req, res) => {
    try { runSql('DELETE FROM contacts WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;

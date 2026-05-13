const express = require('express');
const { queryAll, runSql } = require('../database');
const router = express.Router();

router.post('/', (req, res) => {
    try {
        const { student_name, parent_name, phone, email, class: cls, subject, message } = req.body;
        if (!student_name || !phone || !cls) return res.status(400).json({ error: 'Student name, phone and class are required' });
        const result = runSql('INSERT INTO enquiries (student_name, parent_name, phone, email, class, subject, message) VALUES (?,?,?,?,?,?,?)',
            [student_name, parent_name||null, phone, email||null, cls, subject||null, message||null]);
        res.json({ success: true, id: result.lastId, message: 'Enquiry submitted successfully!' });
    } catch (err) { res.status(500).json({ error: 'Failed to submit enquiry' }); }
});

router.get('/', (req, res) => {
    try { res.json(queryAll('SELECT * FROM enquiries ORDER BY created_at DESC')); }
    catch (err) { res.status(500).json({ error: 'Failed to fetch enquiries' }); }
});

router.put('/:id', (req, res) => {
    try { runSql('UPDATE enquiries SET status = ? WHERE id = ?', [req.body.status, req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to update' }); }
});

router.delete('/:id', (req, res) => {
    try { runSql('DELETE FROM enquiries WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;

const express = require('express');
const { queryAll, runSql } = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
    try { res.json(queryAll('SELECT * FROM testimonials ORDER BY created_at DESC')); }
    catch (err) { res.status(500).json({ error: 'Failed to fetch testimonials' }); }
});

router.post('/', (req, res) => {
    try {
        const { name, class: cls, relation, message, rating } = req.body;
        if (!name || !message) return res.status(400).json({ error: 'Name and message required' });
        const result = runSql('INSERT INTO testimonials (name,class,relation,message,rating) VALUES (?,?,?,?,?)',
            [name, cls||null, relation||'student', message, rating||5]);
        res.json({ success: true, id: result.lastId });
    } catch (err) { res.status(500).json({ error: 'Failed to add testimonial' }); }
});

router.delete('/:id', (req, res) => {
    try { runSql('DELETE FROM testimonials WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;

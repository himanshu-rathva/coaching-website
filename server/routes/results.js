const express = require('express');
const { queryAll, runSql } = require('../database');
const { authenticateAdmin } = require('../middleware/auth'); // 👈 Security Guard ko bulaya
const router = express.Router();

// Public: Everyone can see results on frontend
router.get('/', (req, res) => {
    try {
        const { year, class: cls } = req.query;
        let sql = 'SELECT * FROM results';
        const params = [];
        const conds = [];
        if (year) { conds.push('year = ?'); params.push(year); }
        if (cls) { conds.push('class = ?'); params.push(cls); }
        if (conds.length) sql += ' WHERE ' + conds.join(' AND ');
        sql += ' ORDER BY percentage DESC';
        res.json(queryAll(sql, params));
    } catch (err) { res.status(500).json({ error: 'Failed to fetch results' }); }
});

// Public
router.get('/years', (req, res) => {
    try { res.json(queryAll('SELECT DISTINCT year FROM results ORDER BY year DESC').map(y => y.year)); }
    catch (err) { res.status(500).json({ error: 'Failed to fetch years' }); }
});

// 🔒 SECURED: Only admin can post new results
router.post('/', authenticateAdmin, (req, res) => {
    try {
        const { student_name, class: cls, year, percentage, rank, board, subject_highlight } = req.body;
        if (!student_name || !cls || !year || !percentage) return res.status(400).json({ error: 'Required fields missing' });
        const result = runSql('INSERT INTO results (student_name,class,year,percentage,rank,board,subject_highlight) VALUES (?,?,?,?,?,?,?)',
            [student_name, cls, year, percentage, rank||null, board||'CBSE', subject_highlight||null]);
        res.json({ success: true, id: result.lastId });
    } catch (err) { res.status(500).json({ error: 'Failed to add result' }); }
});

// 🔒 SECURED: Only admin can delete results
router.delete('/:id', authenticateAdmin, (req, res) => {
    try { runSql('DELETE FROM results WHERE id = ?', [req.params.id]); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
const bcrypt = require('bcryptjs');
const { queryOne } = require('../database');

const sessions = new Map();

function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
}

function authenticateAdmin(req, res, next) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token || !sessions.has(token)) return res.status(401).json({ error: 'Unauthorized' });
    const session = sessions.get(token);
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) { sessions.delete(token); return res.status(401).json({ error: 'Session expired' }); }
    req.admin = session;
    next();
}

function loginAdmin(username, password) {
    const admin = queryOne('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) return null;
    const token = generateToken();
    sessions.set(token, { id: admin.id, username: admin.username, fullName: admin.full_name, createdAt: Date.now() });
    return { token, username: admin.username, fullName: admin.full_name };
}

function logoutAdmin(token) { sessions.delete(token); }

module.exports = { authenticateAdmin, loginAdmin, logoutAdmin };

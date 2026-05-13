const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Start with async DB init
async function start() {
    await initDatabase();

    // API Routes
    app.use('/api/enquiry', require('./routes/enquiry'));
    app.use('/api/contact', require('./routes/contact'));
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/results', require('./routes/results'));
    app.use('/api/testimonials', require('./routes/testimonials'));

    // Fallback
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════════╗');
        console.log('║   🎓 EduSpark Academy - Website Server           ║');
        console.log(`║   🌐 http://localhost:${PORT}                      ║`);
        console.log('║   👤 Admin: http://localhost:' + PORT + '/admin.html     ║');
        console.log('║   Login: admin / admin123                        ║');
        console.log('╚══════════════════════════════════════════════════╝');
        console.log('');
    });
}

start().catch(err => { console.error('Failed to start:', err); process.exit(1); });

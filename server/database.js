const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database', 'coaching.db');

let db = null;

async function initDatabase() {
    const SQL = await initSqlJs();

    // Load existing database or create new
    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }

    // Create tables
    db.run(`
        CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            parent_name TEXT,
            phone TEXT NOT NULL,
            email TEXT,
            class TEXT NOT NULL,
            subject TEXT,
            message TEXT,
            status TEXT DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            class TEXT NOT NULL,
            year TEXT NOT NULL,
            percentage REAL,
            rank TEXT,
            board TEXT DEFAULT 'CBSE',
            subject_highlight TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            class TEXT,
            relation TEXT DEFAULT 'student',
            message TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Seed admin
    const adminCount = db.exec("SELECT COUNT(*) as count FROM admin_users");
    if (adminCount[0].values[0][0] === 0) {
        const hash = bcrypt.hashSync('admin123', 10);
        db.run("INSERT INTO admin_users (username, password_hash, full_name) VALUES (?, ?, ?)", ['admin', hash, 'Administrator']);
        console.log('✅ Default admin created (admin / admin123)');
    }

    // Seed demo data
    const resultCount = db.exec("SELECT COUNT(*) as count FROM results");
    if (resultCount[0].values[0][0] === 0) {
        seedDemoData();
    }

    saveDatabase();
    console.log('✅ Database initialized');
    return db;
}

function seedDemoData() {
    console.log('🌱 Seeding demo data...');
    const demoResults = [
        ['Aarav Sharma', '12th', '2025', 98.4, 'School Topper', 'CBSE', 'Physics - 100'],
        ['Priya Patel', '12th', '2025', 97.8, '2nd Rank', 'CBSE', 'Mathematics - 99'],
        ['Rohan Gupta', '12th', '2025', 96.5, '3rd Rank', 'CBSE', 'Chemistry - 98'],
        ['Sneha Iyer', '10th', '2025', 99.2, 'District Topper', 'CBSE', 'Science - 100'],
        ['Arjun Reddy', '10th', '2025', 98.0, '2nd Rank', 'CBSE', 'Maths - 100'],
        ['Kavya Singh', '10th', '2025', 97.4, '3rd Rank', 'CBSE', 'English - 99'],
        ['Amit Kumar', '12th', '2024', 97.2, 'School Topper', 'CBSE', 'Maths - 100'],
        ['Divya Nair', '12th', '2024', 96.8, '2nd Rank', 'CBSE', 'Biology - 99'],
        ['Rahul Verma', '10th', '2024', 98.6, 'City Topper', 'CBSE', 'Science - 100'],
        ['Ananya Joshi', '10th', '2024', 97.0, '2nd Rank', 'CBSE', 'SST - 99'],
        ['Vikram Desai', '12th', '2024', 95.8, '3rd Rank', 'CBSE', 'Physics - 98'],
        ['Meera Krishnan', '12th', '2023', 98.0, 'State Rank 12', 'CBSE', 'Chemistry - 100'],
    ];
    demoResults.forEach(r => db.run("INSERT INTO results (student_name, class, year, percentage, rank, board, subject_highlight) VALUES (?,?,?,?,?,?,?)", r));

    const demoTestimonials = [
        ['Rajesh Sharma', '12th', 'parent', 'EduSpark Academy ne mere bete ki life change kar di. 98.4%! Faculty bahut dedicated hai.', 5],
        ['Sneha Iyer', '10th', 'student', 'Teachers itne acche se samjhate hain ki concepts clear ho jaate hain. District topper!', 5],
        ['Sunita Verma', '12th', 'parent', 'Affordable fees mein world-class teaching. JEE result amazing aaya. Recommended!', 5],
    ];
    demoTestimonials.forEach(t => db.run("INSERT INTO testimonials (name, class, relation, message, rating) VALUES (?,?,?,?,?)", t));

    const demoEnquiries = [
        ['Aditya Malhotra', 'Rakesh Malhotra', '9876543210', 'rakesh@email.com', '9th', null, 'Want Science and Maths coaching', 'new'],
        ['Pooja Rathi', 'Suresh Rathi', '9988776655', 'suresh@email.com', '11th', null, 'JEE foundation batch', 'contacted'],
    ];
    demoEnquiries.forEach(e => db.run("INSERT INTO enquiries (student_name, parent_name, phone, email, class, subject, message, status) VALUES (?,?,?,?,?,?,?,?)", e));

    console.log('✅ Demo data seeded');
}

function saveDatabase() {
    if (!db) return;
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

// Helper: run query and return results as array of objects
function queryAll(sql, params = []) {
    const stmt = db.prepare(sql);
    if (params.length) stmt.bind(params);
    const results = [];
    while (stmt.step()) results.push(stmt.getAsObject());
    stmt.free();
    return results;
}

function queryOne(sql, params = []) {
    const results = queryAll(sql, params);
    return results[0] || null;
}

function runSql(sql, params = []) {
    db.run(sql, params);
    saveDatabase();
    return { lastId: db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] };
}

function getDb() { return db; }

module.exports = { initDatabase, getDb, queryAll, queryOne, runSql, saveDatabase };

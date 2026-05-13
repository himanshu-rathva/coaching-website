// ===== Admin Panel =====
const API_BASE = '/api';
let authToken = localStorage.getItem('admin_token');

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        verifyToken();
    } else {
        showLogin();
    }
});

async function verifyToken() {
    try {
        const res = await fetch(`${API_BASE}/admin/verify`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) { showDashboard(); }
        else { showLogin(); }
    } catch { showLogin(); }
}

function showLogin() {
    authToken = null;
    localStorage.removeItem('admin_token');
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUser').value;
        const password = document.getElementById('loginPass').value;
        const btn = e.target.querySelector('button');
        btn.disabled = true; btn.textContent = 'Logging in...';

        try {
            const res = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                authToken = data.token;
                localStorage.setItem('admin_token', authToken);
                showDashboard();
            } else {
                showToast(data.error || 'Login failed', 'error');
            }
        } catch { showToast('Network error', 'error'); }
        btn.disabled = false; btn.textContent = 'Login';
    });
}

async function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'grid';
    loadStats();
    loadEnquiries();

    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const section = item.dataset.section;
            document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
            document.getElementById(`section-${section}`).style.display = 'block';
            if (section === 'enquiries') loadEnquiries();
            if (section === 'contacts') loadContacts();
            if (section === 'results') loadAdminResults();
        });
    });
}

async function loadStats() {
    try {
        const res = await fetch(`${API_BASE}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const stats = await res.json();
        document.getElementById('statEnquiries').textContent = stats.totalEnquiries;
        document.getElementById('statNewEnquiries').textContent = stats.newEnquiries;
        document.getElementById('statContacts').textContent = stats.totalContacts;
        document.getElementById('statUnread').textContent = stats.unreadContacts;
    } catch { console.error('Failed to load stats'); }
}

async function loadEnquiries() {
    try {
        const res = await fetch(`${API_BASE}/enquiry`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const enquiries = await res.json();
        const tbody = document.getElementById('enquiriesBody');
        if (!tbody) return;
        tbody.innerHTML = enquiries.map(e => `
            <tr>
                <td><strong>${e.student_name}</strong><br><small style="color:var(--text-muted)">${e.parent_name || '-'}</small></td>
                <td>${e.phone}</td>
                <td>${e.class}</td>
                <td><span class="badge ${e.status === 'new' ? 'badge-accent' : 'badge-success'}">${e.status}</span></td>
                <td>${new Date(e.created_at).toLocaleDateString()}</td>
                <td>
                    ${e.status === 'new' ? `<button class="admin-btn admin-btn-view" onclick="updateEnquiry(${e.id},'contacted')">✓ Mark</button>` : ''}
                    <button class="admin-btn admin-btn-delete" onclick="deleteEnquiry(${e.id})">✕</button>
                </td>
            </tr>
        `).join('');
    } catch { console.error('Failed to load enquiries'); }
}

async function updateEnquiry(id, status) {
    try {
        await fetch(`${API_BASE}/enquiry/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ status })
        });
        showToast('Enquiry updated', 'success');
        loadEnquiries(); loadStats();
    } catch { showToast('Failed to update', 'error'); }
}

async function deleteEnquiry(id) {
    if (!confirm('Delete this enquiry?')) return;
    try {
        await fetch(`${API_BASE}/enquiry/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` }
        });
        showToast('Enquiry deleted', 'success');
        loadEnquiries(); loadStats();
    } catch { showToast('Failed to delete', 'error'); }
}

async function loadContacts() {
    try {
        const res = await fetch(`${API_BASE}/contact`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const contacts = await res.json();
        const tbody = document.getElementById('contactsBody');
        if (!tbody) return;
        tbody.innerHTML = contacts.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.email}</td>
                <td>${c.subject || '-'}</td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.message}</td>
                <td><span class="badge ${c.is_read ? 'badge-success' : 'badge-accent'}">${c.is_read ? 'Read' : 'New'}</span></td>
                <td>
                    ${!c.is_read ? `<button class="admin-btn admin-btn-view" onclick="markRead(${c.id})">✓</button>` : ''}
                    <button class="admin-btn admin-btn-delete" onclick="deleteContact(${c.id})">✕</button>
                </td>
            </tr>
        `).join('');
    } catch { console.error('Failed to load contacts'); }
}

async function markRead(id) {
    await fetch(`${API_BASE}/contact/${id}/read`, { method: 'PUT', headers: { 'Authorization': `Bearer ${authToken}` } });
    loadContacts(); loadStats();
}

async function deleteContact(id) {
    if (!confirm('Delete this message?')) return;
    await fetch(`${API_BASE}/contact/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
    showToast('Deleted', 'success'); loadContacts(); loadStats();
}

async function loadAdminResults() {
    try {
        const res = await fetch(`${API_BASE}/results`);
        const results = await res.json();
        const tbody = document.getElementById('resultsBody');
        if (!tbody) return;
        tbody.innerHTML = results.map(r => `
            <tr>
                <td><strong>${r.student_name}</strong></td>
                <td>${r.class}</td>
                <td>${r.year}</td>
                <td style="color:var(--accent);font-weight:700">${r.percentage}%</td>
                <td>${r.rank || '-'}</td>
                <td><button class="admin-btn admin-btn-delete" onclick="deleteResult(${r.id})">✕</button></td>
            </tr>
        `).join('');
    } catch { console.error('Failed to load results'); }
}

async function deleteResult(id) {
    if (!confirm('Delete this result?')) return;
    await fetch(`${API_BASE}/results/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
    showToast('Result deleted', 'success'); loadAdminResults();
}

function adminLogout() {
    fetch(`${API_BASE}/admin/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${authToken}` } });
    authToken = null; localStorage.removeItem('admin_token');
    showLogin();
}

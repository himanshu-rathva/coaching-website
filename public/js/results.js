// ===== Results Page =====
document.addEventListener('DOMContentLoaded', () => {
    loadYears();
    loadResults();

    document.getElementById('yearFilter')?.addEventListener('change', loadResults);
    document.getElementById('classFilter')?.addEventListener('change', loadResults);
});

async function loadYears() {
    try {
        const res = await fetch('/api/results/years');
        const years = await res.json();
        const select = document.getElementById('yearFilter');
        if (!select) return;
        years.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y; opt.textContent = y;
            select.appendChild(opt);
        });
    } catch (err) { console.error('Failed to load years'); }
}

async function loadResults() {
    try {
        const year = document.getElementById('yearFilter')?.value || '';
        const cls = document.getElementById('classFilter')?.value || '';
        let url = '/api/results?';
        if (year) url += `year=${year}&`;
        if (cls) url += `class=${cls}&`;

        const res = await fetch(url);
        const results = await res.json();
        renderResults(results);
    } catch (err) { console.error('Failed to load results'); }
}

function renderResults(results) {
    const grid = document.getElementById('resultsGrid');
    if (!grid) return;

    if (results.length === 0) {
        grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:60px"><h3>No results found</h3><p>Try changing the filters above</p></div>';
        return;
    }

    grid.innerHTML = results.map((r, i) => `
        <div class="card result-card fade-up" style="animation-delay:${i * 0.05}s">
            <div class="result-rank">${i + 1}</div>
            <div class="result-info">
                <h3>${r.student_name}</h3>
                <div class="result-meta">Class ${r.class} | ${r.board} | ${r.year}</div>
                ${r.subject_highlight ? `<div class="result-highlight">⭐ ${r.subject_highlight}</div>` : ''}
            </div>
            <div style="text-align:right">
                <div class="result-percent">${r.percentage}%</div>
                ${r.rank ? `<div class="result-highlight">${r.rank}</div>` : ''}
            </div>
        </div>
    `).join('');

    // Trigger animations
    setTimeout(() => grid.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible')), 100);
}

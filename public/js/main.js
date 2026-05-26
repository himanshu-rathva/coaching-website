// ===== Global Scripts =====
document.addEventListener('DOMContentLoaded', () => {
    
    initNavbar();
    initScrollAnimations();
    initActiveNav();
    initPreloader();
});

// Hide preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 600);
    });
    // Fallback: hide after 3s even if load doesn't fire
    setTimeout(() => preloader.classList.add('hidden'), 3000);
}

// Navbar scroll effect & mobile toggle
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle?.addEventListener('click', () => {
        links?.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            links?.classList.remove('active');
            toggle?.classList.remove('active');
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el));
}

// Active nav link based on current page
function initActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Toast notifications
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// Get nav HTML
function getNavHTML(activePage) {
    return `
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">
                <div class="logo-icon">E</div>
                <div class="logo-text">Edu<span>Spark</span></div>
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
                <li><a href="about.html" ${activePage==='about'?'class="active"':''}>About</a></li>
                <li><a href="courses.html" ${activePage==='courses'?'class="active"':''}>Courses</a></li>
                <li><a href="faculty.html" ${activePage==='faculty'?'class="active"':''}>Faculty</a></li>
                <li><a href="results.html" ${activePage==='results'?'class="active"':''}>Results</a></li>
                <li><a href="gallery.html" ${activePage==='gallery'?'class="active"':''}>Gallery</a></li>
                <li><a href="contact.html" ${activePage==='contact'?'class="active"':''}>Contact</a></li>
                <li><a href="contact.html#enquiry" class="nav-cta">Enroll Now</a></li>
            </ul>
            <div class="nav-toggle" id="navToggle" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </div>
        </div>
    </nav>`;
}

// Get footer HTML
function getFooterHTML() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="nav-logo" style="margin-bottom:12px">
                        <div class="logo-icon">E</div>
                        <div class="logo-text">Edu<span>Spark</span></div>
                    </a>
                    <p>Shaping futures since 2010. Premium coaching for Standards 6-12 with proven results and dedicated faculty.</p>
                </div>
                <div>
                    <h4 class="footer-heading">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="courses.html">Courses</a></li>
                        <li><a href="faculty.html">Our Faculty</a></li>
                        <li><a href="results.html">Results</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-heading">Programs</h4>
                    <ul class="footer-links">
                        <li><a href="courses.html">Std 6-8 Foundation</a></li>
                        <li><a href="courses.html">Std 9-10 Board Prep</a></li>
                        <li><a href="courses.html">Std 11-12 Science</a></li>
                        <li><a href="courses.html">JEE/NEET Foundation</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-heading">Contact</h4>
                    <ul class="footer-links">
                        <li>📍 123, Education Lane, City</li>
                        <li>📞 +91 98765 43210</li>
                        <li>✉️ info@eduspark.com</li>
                        <li>🕐 Mon-Sat: 7AM - 9PM</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 EduSpark Academy. All rights reserved.</p>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook">📘</a>
                    <a href="#" aria-label="Instagram">📸</a>
                    <a href="#" aria-label="YouTube">🎬</a>
                    <a href="#" aria-label="WhatsApp">💬</a>
                </div>
            </div>
        </div>
    </footer>
    <a href="https://wa.me/919876543210" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.608-1.467A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.16 0-4.16-.68-5.803-1.836l-.416-.264-2.735.87.87-2.654-.287-.442A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
    </a>`;
}


// Theme Toggle Logic
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', currentTheme);
    toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', () => {
        const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    });
}
document.addEventListener('DOMContentLoaded', () => { initThemeToggle(); });

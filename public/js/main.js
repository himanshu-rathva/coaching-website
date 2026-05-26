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



// ===============================================
// SCROLL REVEAL ENGINE (IntersectionObserver)
// ===============================================
function initScrollReveal() {
    document.querySelectorAll('.fade-up').forEach(function(el) { el.classList.add('reveal'); });
    document.querySelectorAll('.fade-left').forEach(function(el) { el.classList.add('reveal-left'); });
    document.querySelectorAll('.fade-right').forEach(function(el) { el.classList.add('reveal-right'); });

    document.querySelectorAll('.card, .section-header, .contact-info-card, .hero-text, .hero-image').forEach(function(el) {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal');
        }
    });

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
        revealObserver.observe(el);
    });
}

// ===============================================
// MAGNETIC BUTTON EFFECT
// ===============================================
function initMagneticButtons() {
    var buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');
    
    buttons.forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            var moveX = x * 0.15;
            var moveY = y * 0.15;
            btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===============================================
// FLOATING THEME TOGGLE (Dark / Light Mode)
// ===============================================
function initFloatingThemeToggle() {
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'floating-theme-toggle';
    toggleBtn.className = 'floating-theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
    document.body.appendChild(toggleBtn);

    var root = document.documentElement;
    var savedTheme = localStorage.getItem('eduspark-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    setToggleIcon(toggleBtn, savedTheme);

    toggleBtn.addEventListener('click', function() {
        var current = root.getAttribute('data-theme');
        var next = (current === 'dark') ? 'light' : 'dark';
        document.body.style.transition = 'background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        root.setAttribute('data-theme', next);
        localStorage.setItem('eduspark-theme', next);
        setToggleIcon(toggleBtn, next);
    });
}

function setToggleIcon(btn, theme) {
    if (theme === 'dark') {
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    } else {
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
    btn.style.color = 'var(--text-primary)';
}

// ===============================================
// BOOT ALL SYSTEMS
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initMagneticButtons();
    initFloatingThemeToggle();
});

// ===== Homepage Scripts =====
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initTestimonialSlider();
});

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.floor(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Testimonial slider
function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    if (!track || dots.length === 0) return;

    let current = 0;
    const total = dots.length;

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto slide
    setInterval(() => {
        goTo((current + 1) % total);
    }, 5000);
}

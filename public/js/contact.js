// ===== Contact & Enquiry Form Handler =====
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const enquiryForm = document.getElementById('enquiryForm');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '⏳ Sending...';
        try {
            const data = Object.fromEntries(new FormData(contactForm));
            console.log('Sending contact:', data);
            const res = await fetch('/api/contact', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            console.log('Contact response:', result);
            if (result.success) {
                showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showToast(result.error || 'Failed to send message', 'error');
            }
        } catch (err) {
            console.error('Contact error:', err);
            showToast('Network error. Make sure server is running.', 'error');
        }
        btn.disabled = false; btn.innerHTML = originalText;
    });

    enquiryForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = enquiryForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = '⏳ Submitting...';
        try {
            const data = Object.fromEntries(new FormData(enquiryForm));
            console.log('Sending enquiry:', data);
            const res = await fetch('/api/enquiry', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            console.log('Enquiry response:', result);
            if (result.success) {
                showToast('🎉 Enquiry submitted! We\'ll contact you shortly for a free demo class.', 'success');
                enquiryForm.reset();
            } else {
                showToast(result.error || 'Failed to submit enquiry', 'error');
            }
        } catch (err) {
            console.error('Enquiry error:', err);
            showToast('Network error. Make sure server is running on localhost:3000', 'error');
        }
        btn.disabled = false; btn.innerHTML = originalText;
    });
});

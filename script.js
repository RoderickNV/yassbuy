// ============================================
// YASSbuy Landing Page — Interactions & Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const nav = document.getElementById('nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // --- Scroll reveal animations ---
    const revealElements = document.querySelectorAll(
        '.feature-card, .step, .showcase-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // --- Counter animation ---
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // --- Waitlist form ---
    const WAITLIST_API = 'https://yassbuy-api.vercel.app/api/waitlist';
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('emailInput');
    const formSuccess = document.getElementById('formSuccess');
    const formBtn = form.querySelector('.form-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !email.includes('@')) return;

        // Disable while submitting
        emailInput.disabled = true;
        formBtn.disabled = true;
        formBtn.textContent = 'Joining...';

        try {
            const res = await fetch(WAITLIST_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            emailInput.value = '';
            formBtn.style.display = 'none';

            if (data.duplicate) {
                formSuccess.textContent = "You're already on the list! We'll be in touch.";
            } else {
                formSuccess.textContent = "You're on the list! Check your email for confirmation.";
            }
            formSuccess.classList.add('show');
        } catch (err) {
            formSuccess.textContent = 'Something went wrong. Please try again.';
            formSuccess.style.color = '#F87171';
            formSuccess.classList.add('show');
        } finally {
            // Re-enable after 5 seconds
            setTimeout(() => {
                emailInput.disabled = false;
                formBtn.disabled = false;
                formBtn.innerHTML = 'Join Waitlist <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                formBtn.style.display = '';
                formSuccess.classList.remove('show');
                formSuccess.style.color = '';
            }, 5000);
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = nav.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});

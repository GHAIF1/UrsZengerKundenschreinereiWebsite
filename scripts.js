/* ============================================
   Urs Zenger Kundenschreinerei – Scripts
   ============================================ */

(function () {
    'use strict';

    /* --- Header scroll state --- */
    const header = document.getElementById('siteHeader');
    const setHeaderState = () => {
        if (!header) return;
        if (window.scrollY > 12) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    /* --- Mobile navigation --- */
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('primaryNav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
        });

        // Close nav when a link is clicked
        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Menü öffnen');
            });
        });

        // Close nav on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    }

    /* --- Active link highlighting based on scroll position --- */
    const sections = document.querySelectorAll('main section[id], section[id]');
    const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
    const updateActiveLink = () => {
        const scrollPos = window.scrollY + 120;
        let currentId = '';
        sections.forEach((section) => {
            if (scrollPos >= section.offsetTop) {
                currentId = section.id;
            }
        });
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === '#' + currentId) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* --- Fade-in on scroll --- */
    const fadeElements = document.querySelectorAll('.section, .hero-grid > *');
    fadeElements.forEach((el) => el.classList.add('fade-in'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        fadeElements.forEach((el) => observer.observe(el));
    } else {
        fadeElements.forEach((el) => el.classList.add('is-visible'));
    }

    /* --- Contact form: validation & submit feedback --- */
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

    const setFieldValidity = (field, valid) => {
        field.classList.toggle('is-invalid', !valid);
        if (!valid) {
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.removeAttribute('aria-invalid');
        }
    };

    const clearInvalidOnInput = (formEl) => {
        formEl.querySelectorAll('input, textarea').forEach((field) => {
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid')) {
                    field.classList.remove('is-invalid');
                    field.removeAttribute('aria-invalid');
                }
            });
        });
    };

    if (form) {
        clearInvalidOnInput(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.elements['name'];
            const email = form.elements['email'];
            const message = form.elements['message'];
            let valid = true;

            [name, email, message].forEach((f) => setFieldValidity(f, f.value.trim().length > 0));
            if (!name.value.trim()) valid = false;
            if (!email.value.trim() || !validateEmail(email.value)) valid = false;
            if (!message.value.trim()) valid = false;

            if (!valid) {
                if (note) {
                    note.textContent = 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
                    note.className = 'form-note is-error';
                }
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Simulated submission (no backend). In production, replace with fetch().
            if (note) {
                note.textContent = 'Vielen Dank! Ihre Anfrage wurde versendet. Wir melden uns in Kürze.';
                note.className = 'form-note is-success';
            }
            form.reset();
        });
    }

    /* --- Footer year --- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/**
 * Seth Rininger Portfolio — Interactive Effects
 *
 * Three features that award-winning portfolios share:
 * 1. Custom cursor with smooth interpolation
 * 2. Magnetic effect on CTA buttons
 * 3. 3D tilt on hoverable cards
 *
 * All vanilla JS. No dependencies. ~4KB unminified.
 * Only activates on devices with a fine pointer (desktop).
 */

(function () {
    'use strict';

    // Only run on devices with a mouse (not touch)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    // ─── 1. CUSTOM CURSOR ───────────────────────────────────

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.id = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    // Inject cursor styles
    const style = document.createElement('style');
    style.textContent = `
        #custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 36px;
            height: 36px;
            border: 1.5px solid rgba(59, 130, 246, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transition: width 0.25s ease, height 0.25s ease,
                        border-color 0.25s ease, background-color 0.25s ease,
                        opacity 0.2s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
            opacity: 0;
        }

        #custom-cursor.visible {
            opacity: 1;
        }

        #custom-cursor.hovering {
            width: 56px;
            height: 56px;
            border-color: rgba(59, 130, 246, 0.8);
            background-color: rgba(59, 130, 246, 0.08);
        }

        #custom-cursor.clicking {
            width: 28px;
            height: 28px;
            border-color: rgba(245, 158, 11, 0.9);
        }

        #cursor-dot {
            position: fixed;
            top: 0;
            left: 0;
            width: 5px;
            height: 5px;
            background-color: #3b82f6;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100000;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        #cursor-dot.visible {
            opacity: 1;
        }

        /* Hide default cursor on interactive elements */
        body.custom-cursor-active,
        body.custom-cursor-active a,
        body.custom-cursor-active button,
        body.custom-cursor-active input,
        body.custom-cursor-active [data-magnetic],
        body.custom-cursor-active [data-tilt] {
            cursor: none !important;
        }
    `;
    document.head.appendChild(style);

    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let isHovering = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Show cursor once mouse moves
        if (!cursor.classList.contains('visible')) {
            cursor.classList.add('visible');
            cursorDot.classList.add('visible');
            document.body.classList.add('custom-cursor-active');
        }
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
        cursorDot.classList.remove('visible');
    });
    document.addEventListener('mouseenter', () => {
        cursor.classList.add('visible');
        cursorDot.classList.add('visible');
    });

    // Detect hoverable elements
    const hoverTargets = 'a, button, [data-magnetic], .service-card, .process-step, .client-card, .strength-card, .testimonial-card, .gallery-item, .credibility-logo, .nav-links a, input, textarea';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.add('hovering');
            isHovering = true;
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.remove('hovering');
            isHovering = false;
        }
    });

    // Smooth cursor follow with lerp
    function animateCursor() {
        const speed = isHovering ? 0.15 : 0.18;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Dot follows exactly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();


    // ─── 2. MAGNETIC BUTTONS ────────────────────────────────

    function initMagnetic() {
        // Auto-detect CTA buttons and nav links
        const magneticEls = document.querySelectorAll('.cta-button, .cta-btn, .btn, [data-magnetic], nav a, .nav-links a');

        magneticEls.forEach(el => {
            el.setAttribute('data-magnetic', '');

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;

                // Magnetic pull strength (pixels of movement)
                const strength = 0.3;
                const moveX = deltaX * strength;
                const moveY = deltaY * strength;

                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                el.style.transition = 'transform 0.2s ease-out';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
                el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }


    // ─── 3. 3D CARD TILT ────────────────────────────────────

    function initTilt() {
        const tiltCards = document.querySelectorAll(
            '.service-card, .process-step, .client-card, .strength-card, ' +
            '.testimonial-card, .gallery-item, .timeline-card, .grid-item, ' +
            '.stat-card, [data-tilt]'
        );

        // Inject tilt styles
        const tiltStyle = document.createElement('style');
        tiltStyle.textContent = `
            .tilt-active {
                transform-style: preserve-3d;
                will-change: transform;
            }
            .tilt-active > * {
                transform: translateZ(20px);
            }
        `;
        document.head.appendChild(tiltStyle);

        tiltCards.forEach(card => {
            card.classList.add('tilt-active');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Tilt intensity (degrees)
                const maxTilt = 8;
                const rotateX = ((y - centerY) / centerY) * -maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease-out';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }


    // ─── 4. BONUS: SMOOTH SCROLL-LINKED NAV INDICATOR ───────

    function initScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'scroll-indicator';
        const indicatorStyle = document.createElement('style');
        indicatorStyle.textContent = `
            #scroll-indicator {
                position: fixed;
                top: 0;
                left: 0;
                height: 2px;
                background: linear-gradient(90deg, #3b82f6, #f59e0b);
                z-index: 100001;
                transition: width 0.1s linear;
                pointer-events: none;
            }
        `;
        document.head.appendChild(indicatorStyle);
        document.body.appendChild(indicator);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            indicator.style.width = scrollPercent + '%';
        }, { passive: true });
    }


    // ─── 5. PAGE PRELOADER ────────────────────────────────

    function initPreloader() {
        // Create preloader
        const preloader = document.createElement('div');
        preloader.id = 'page-preloader';

        const name = 'Seth Rininger';
        const nameEl = document.createElement('div');
        nameEl.className = 'preloader-name';

        // Split name into individually animated characters
        name.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = (i * 0.04) + 's';
            // Color gradient: blue to amber across the name
            const progress = i / (name.length - 1);
            const r = Math.round(59 + (245 - 59) * progress);
            const g = Math.round(130 + (158 - 130) * progress);
            const b = Math.round(246 + (11 - 246) * progress);
            span.style.color = `rgb(${r}, ${g}, ${b})`;
            nameEl.appendChild(span);
        });

        const line = document.createElement('div');
        line.className = 'preloader-line';

        preloader.appendChild(nameEl);
        preloader.appendChild(line);
        document.body.prepend(preloader);

        // Dismiss after content is ready
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                // Remove from DOM after fade out
                setTimeout(() => preloader.remove(), 600);
            }, 1000);
        });
    }


    // ─── 6. STAGGERED TEXT REVEAL ON HEADINGS ───────────────

    function initTextReveal() {
        // Target all major headings
        const headings = document.querySelectorAll('h1, h2');

        headings.forEach(heading => {
            // Skip if already processed or if it's inside the preloader
            if (heading.closest('#page-preloader')) return;
            if (heading.dataset.textReveal === 'done') return;
            heading.dataset.textReveal = 'done';

            const text = heading.textContent.trim();
            const words = text.split(/\s+/);

            // Clear and rebuild with word wrappers
            heading.innerHTML = '';
            words.forEach((word, i) => {
                const wrapper = document.createElement('span');
                wrapper.className = 'text-reveal-word';
                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.textContent = word;
                inner.style.transitionDelay = (i * 0.06) + 's';
                wrapper.appendChild(inner);
                heading.appendChild(wrapper);
            });
        });

        // Observe headings for reveal
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.text-reveal-word');
                    words.forEach(w => w.classList.add('revealed'));
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

        headings.forEach(h => revealObserver.observe(h));
    }


    // ─── 7. SKIP-TO-CONTENT LINK ────────────────────────────

    function initSkipLink() {
        // Find the main content area
        const main = document.querySelector('main') || document.querySelector('section');
        if (!main) return;

        if (!main.id) main.id = 'main-content';

        const skipLink = document.createElement('a');
        skipLink.className = 'skip-to-content';
        skipLink.href = '#' + main.id;
        skipLink.textContent = 'Skip to content';
        document.body.prepend(skipLink);
    }


    // ─── INIT ───────────────────────────────────────────────

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initSkipLink();

        if (!prefersReducedMotion) {
            initPreloader();
            initTextReveal();
            initMagnetic();
            initTilt();
            initScrollIndicator();
        }
    }

})();

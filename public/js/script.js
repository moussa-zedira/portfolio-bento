// ==========================================================================
// ACTIVE THEORY INSPIRED PORTFOLIO — Scripts V3
// GSAP + ScrollTrigger + Lenis + All Effects
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Guards ---
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Register GSAP plugins ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================================================
    // 1. FILM GRAIN (Canvas ~12fps)
    // ==========================================================================
    const grainCanvas = document.getElementById('grain');
    if (grainCanvas && !prefersReduced) {
        const ctx = grainCanvas.getContext('2d');

        function resizeGrain() {
            grainCanvas.width = window.innerWidth / 2; // half-res for perf
            grainCanvas.height = window.innerHeight / 2;
        }
        resizeGrain();
        window.addEventListener('resize', resizeGrain);

        setInterval(() => {
            const w = grainCanvas.width;
            const h = grainCanvas.height;
            if (w === 0 || h === 0) return;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 255;
            }
            ctx.putImageData(imageData, 0, 0);
        }, 80);
    }

    // ==========================================================================
    // 2. LENIS SMOOTH SCROLL
    // ==========================================================================
    let lenis;

    if (!prefersReduced && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.8,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // ==========================================================================
    // 3. LOADER WITH PROGRESS BAR
    // ==========================================================================
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderPercent = document.getElementById('loaderPercent');

    if (loader) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            const remaining = 100 - progress;
            progress = Math.min(100, progress + Math.max(0.5, remaining * 0.08));

            if (loaderBar) loaderBar.style.width = progress + '%';
            if (loaderPercent) loaderPercent.textContent = Math.round(progress) + '%';

            if (progress >= 99.5) {
                clearInterval(progressInterval);
                if (loaderBar) loaderBar.style.width = '100%';
                if (loaderPercent) loaderPercent.textContent = '100%';

                setTimeout(() => {
                    const loaderTl = gsap.timeline({
                        onComplete: () => {
                            loader.style.display = 'none';
                            initHeroAnimation();
                        }
                    });

                    loaderTl
                        .to('.loader__bar, .loader__percent', { opacity: 0, duration: 0.3 })
                        .to('.loader__text', { scale: 1.3, duration: 0.5, ease: 'power2.inOut' })
                        .to('.loader__text', { scale: 50, opacity: 0, duration: 0.9, ease: 'power3.in' })
                        .to(loader, { opacity: 0, duration: 0.3 }, '-=0.3');
                }, 300);
            }
        }, 30);
    }

    // ==========================================================================
    // 4. BACKGROUND COLOR SHIFT PER PROJECT
    // ==========================================================================
    const bgShift = document.getElementById('bgShift');

    if (bgShift && !prefersReduced) {
        document.querySelectorAll('.section--project').forEach(section => {
            const color = section.dataset.color;
            if (!color) return;

            ScrollTrigger.create({
                trigger: section,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => {
                    bgShift.style.background = `radial-gradient(ellipse at 50% 50%, ${color}15, transparent 70%)`;
                    bgShift.style.opacity = '1';
                },
                onLeave: () => { bgShift.style.opacity = '0'; },
                onEnterBack: () => {
                    bgShift.style.background = `radial-gradient(ellipse at 50% 50%, ${color}15, transparent 70%)`;
                    bgShift.style.opacity = '1';
                },
                onLeaveBack: () => { bgShift.style.opacity = '0'; }
            });
        });
    }

    // ==========================================================================
    // 5. CUSTOM CURSOR + MAGNETIC BUTTONS
    // ==========================================================================
    if (!isMobile) {
        const cursor = document.querySelector('.cursor');
        const dot = document.querySelector('.cursor__dot');
        const ring = document.querySelector('.cursor__ring');
        const label = document.querySelector('.cursor__label');

        if (cursor && dot && ring) {
            let mouseX = 0, mouseY = 0;
            let ringX = 0, ringY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            });

            function updateRing() {
                ringX += (mouseX - ringX) * 0.12;
                ringY += (mouseY - ringY) * 0.12;
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
                if (label) {
                    label.style.left = ringX + 'px';
                    label.style.top = ringY + 'px';
                }
                requestAnimationFrame(updateRing);
            }
            updateRing();

            // Hover states
            document.querySelectorAll('a, button, .btn, .skills__stack-item, .contact__social, .section-nav__dot').forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
            });

            document.querySelectorAll('[data-cursor="view"]').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('cursor--view');
                    if (label) label.textContent = 'Voir';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('cursor--view');
                });
            });

            // === MAGNETIC BUTTONS ===
            document.querySelectorAll('.btn, .contact__social, .nav__toggle, .nav__logo').forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    gsap.to(el, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });

                el.addEventListener('mouseleave', () => {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)'
                    });
                });
            });
        }
    }

    // ==========================================================================
    // 6. NAVIGATION
    // ==========================================================================
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const overlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (toggle && overlay) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });

        menuLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                toggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';

                if (target) {
                    if (lenis) {
                        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Nav auto-hide
    if (nav && lenis) {
        let lastScrollY = 0;
        lenis.on('scroll', ({ scroll }) => {
            if (scroll > 120) {
                nav.classList.toggle('nav--hidden', scroll > lastScrollY);
            } else {
                nav.classList.remove('nav--hidden');
            }
            lastScrollY = scroll;
        });
    }

    // Menu stagger
    if (overlay) {
        const observer = new MutationObserver(() => {
            const isActive = overlay.classList.contains('active');
            menuLinks.forEach((link, i) => {
                link.style.transitionDelay = isActive ? `${0.1 + i * 0.05}s` : '0s';
            });
        });
        observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    }

    // ==========================================================================
    // 7. SECTION NAV DOTS
    // ==========================================================================
    const sectionNav = document.getElementById('sectionNav');
    const navDots = document.querySelectorAll('.section-nav__dot');

    if (sectionNav && navDots.length) {
        // Click to scroll
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = document.querySelector(dot.dataset.target);
                if (target) {
                    if (lenis) {
                        lenis.scrollTo(target, { duration: 1.5 });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Update active dot on scroll
        const sections = Array.from(navDots).map(dot => document.querySelector(dot.dataset.target)).filter(Boolean);
        sections.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActiveDot(i),
                onEnterBack: () => setActiveDot(i),
            });
        });

        const sectionCounter = document.getElementById('sectionCounter');
        const totalSections = navDots.length;

        function setActiveDot(index) {
            navDots.forEach(d => d.classList.remove('active'));
            if (navDots[index]) navDots[index].classList.add('active');
            if (sectionCounter) {
                const num = String(index + 1).padStart(2, '0');
                const total = String(totalSections).padStart(2, '0');
                sectionCounter.textContent = `${num} / ${total}`;
            }
        }
    }

    // ==========================================================================
    // 8. PAGE TRANSITIONS (GSAP wipe)
    // ==========================================================================
    const pageTransition = document.getElementById('pageTransition');
    const wipe = pageTransition ? pageTransition.querySelector('.page-transition__wipe') : null;

    if (wipe && !prefersReduced) {
        document.querySelectorAll('[data-transition]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                gsap.to(wipe, {
                    scaleY: 1,
                    transformOrigin: 'bottom',
                    duration: 0.6,
                    ease: 'power3.inOut',
                    onComplete: () => { window.location.href = href; }
                });
            });
        });

        // Page enter animation
        if (document.referrer && document.referrer.includes(window.location.hostname)) {
            gsap.set(wipe, { scaleY: 1, transformOrigin: 'top' });
            gsap.to(wipe, { scaleY: 0, duration: 0.6, ease: 'power3.inOut', delay: 0.1 });
        }
    }

    // ==========================================================================
    // 9. HERO ANIMATION (bigger, letter-by-letter)
    // ==========================================================================

    // Wrap hero line text in inner spans
    document.querySelectorAll('.hero__line').forEach(line => {
        const text = line.textContent;
        line.innerHTML = `<span class="hero__line-inner">${text}</span>`;
    });

    function initHeroAnimation() {
        if (prefersReduced) {
            gsap.set(['.hero__label', '.hero__title', '.hero__tag', '.hero__cta', '.hero__scroll'], { opacity: 1 });
            gsap.set('.hero__line-inner', { y: '0%' });
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl
            // Label fades in slowly
            .fromTo('.hero__label',
                { y: 40, opacity: 0, filter: 'blur(10px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1 }
            )
            // Name slides up + slight horizontal offset for cinema feel
            .fromTo('.hero__line-inner',
                { y: '120%', rotateX: 40 },
                { y: '0%', rotateX: 0, duration: 1.6, stagger: 0.25 },
                '-=0.5'
            )
            // Title blurs in
            .fromTo('.hero__title',
                { y: 40, opacity: 0, filter: 'blur(8px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1 },
                '-=0.8'
            )
            // Tags stagger with scale
            .fromTo('.hero__tag',
                { y: 20, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.07 },
                '-=0.5'
            )
            // CTA slides up with blur
            .fromTo('.hero__cta',
                { y: 30, opacity: 0, filter: 'blur(5px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
                '-=0.3'
            )
            // Scroll indicator
            .fromTo('.hero__scroll',
                { opacity: 0 },
                { opacity: 1, duration: 1 },
                '-=0.2'
            )
            // Nav fades in
            .fromTo('.nav',
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.6'
            )
            // Section nav dots appear
            .fromTo('.section-nav',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.6 },
                '-=0.4'
            );
    }

    // ==========================================================================
    // 10. TEXT SCRAMBLE EFFECT ON HOVER [data-scramble]
    // ==========================================================================
    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    document.querySelectorAll('[data-scramble]').forEach(el => {
        const originalText = el.textContent;
        let scrambleInterval;

        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            clearInterval(scrambleInterval);

            scrambleInterval = setInterval(() => {
                el.textContent = originalText
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' ';
                        if (i < iteration) return originalText[i];
                        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    })
                    .join('');

                iteration += 1 / 2;

                if (iteration >= originalText.length) {
                    clearInterval(scrambleInterval);
                    el.textContent = originalText;
                }
            }, 30);
        });

        el.addEventListener('mouseleave', () => {
            clearInterval(scrambleInterval);
            el.textContent = originalText;
        });
    });

    // ==========================================================================
    // 11. CLIP-PATH REVEAL [data-reveal]
    // ==========================================================================
    if (!prefersReduced) {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => el.classList.add('revealed')
            });
        });
    } else {
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    }

    // ==========================================================================
    // 12. PARALLAX MULTI-LAYER [data-speed]
    // ==========================================================================
    if (!isMobile && !prefersReduced) {
        document.querySelectorAll('[data-speed]').forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 1;
            const diff = (1 - speed) * 200;

            gsap.to(el, {
                y: diff,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('.section') || el.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ==========================================================================
    // 13. SCROLL SPINE LINE
    // ==========================================================================
    const spineFill = document.getElementById('spineFill');
    const spineDot = document.getElementById('spineDot');

    if (spineFill && !isMobile && !prefersReduced) {
        if (spineDot) spineDot.classList.add('visible');

        if (lenis) {
            lenis.on('scroll', ({ progress }) => {
                const pct = Math.min(100, progress * 100);
                spineFill.style.height = pct + '%';
            });
        } else {
            window.addEventListener('scroll', () => {
                const scrollTop = document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                spineFill.style.height = pct + '%';
            });
        }
    }

    // ==========================================================================
    // 13b. PROJECT COUNTER (01/03 animé)
    // ==========================================================================
    const projectCounterEl = document.getElementById('projectCounter');
    const projectCounterCurrent = document.getElementById('projectCounterCurrent');

    if (projectCounterEl && projectCounterCurrent && !isMobile) {
        let currentProjectIndex = 0;
        const projectSections = document.querySelectorAll('.section--project');

        // Show only when in project sections
        projectCounterEl.style.opacity = '0';
        projectCounterEl.style.transition = 'opacity 0.5s var(--ease)';

        projectSections.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => updateProjectCounter(i),
                onEnterBack: () => updateProjectCounter(i),
                onLeave: () => { if (i === projectSections.length - 1) projectCounterEl.style.opacity = '0'; },
                onLeaveBack: () => { if (i === 0) projectCounterEl.style.opacity = '0'; }
            });
        });

        function updateProjectCounter(index) {
            projectCounterEl.style.opacity = '1';
            if (index !== currentProjectIndex) {
                projectCounterEl.classList.add('changing');
                setTimeout(() => {
                    projectCounterCurrent.textContent = String(index + 1).padStart(2, '0');
                    projectCounterEl.classList.remove('changing');
                }, 250);
                currentProjectIndex = index;
            }
        }
    }

    // ==========================================================================
    // 14. SEPARATOR LINE ANIMATION
    // ==========================================================================
    document.querySelectorAll('.separator__line').forEach(line => {
        ScrollTrigger.create({
            trigger: line,
            start: 'top 90%',
            once: true,
            onEnter: () => line.classList.add('expanded')
        });
    });

    // ==========================================================================
    // 15. ABOUT — Word-by-word reveal
    // ==========================================================================
    const aboutText = document.querySelector('[data-split-words]');
    if (aboutText) {
        const text = aboutText.textContent.trim();
        aboutText.innerHTML = text.split(/\s+/).map(word =>
            `<span class="word">${word}</span>`
        ).join(' ');

        const words = aboutText.querySelectorAll('.word');

        if (!prefersReduced) {
            ScrollTrigger.create({
                trigger: aboutText,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    words.forEach((word, i) => {
                        const wordProgress = i / words.length;
                        const opacity = Math.min(1, Math.max(0.15, (progress - wordProgress) * words.length * 0.5));
                        word.style.opacity = opacity;
                    });
                }
            });
        } else {
            words.forEach(w => w.style.opacity = 1);
        }
    }

    // About bullet points stagger
    const aboutPoints = document.querySelectorAll('.about__point');
    if (aboutPoints.length && !prefersReduced) {
        gsap.from(aboutPoints, {
            opacity: 0,
            x: -20,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: aboutPoints[0],
                start: 'top 85%',
                once: true
            }
        });
    }

    // About stats counter
    document.querySelectorAll('.about__stat-number').forEach(el => {
        const target = parseInt(el.dataset.count);
        if (isNaN(target)) return;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    textContent: target,
                    duration: 1.2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); }
                });
            }
        });
    });

    // ==========================================================================
    // 16. PROJECT SECTIONS — Pin + Slide + Animations
    // ==========================================================================
    if (!isMobile && !prefersReduced) {
        document.querySelectorAll('.section--project').forEach(section => {
            const slide = section.querySelector('.project__slide');
            const visual = section.querySelector('.project__visual');
            const number = section.querySelector('.project__number');
            const title = section.querySelector('.project__title');
            const desc = section.querySelector('.project__desc');
            const techPills = section.querySelectorAll('.project__tech-pill');
            const link = section.querySelector('.project__link');

            // Pin + slide
            if (slide) {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: '+=60%',
                    pin: true,
                    onUpdate: (self) => {
                        slide.style.transform = `translateX(${100 - self.progress * 100}%)`;
                    }
                });
            }

            // Entrance
            const projectTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            });

            if (number) projectTl.fromTo(number, { x: -80, opacity: 0 }, { x: 0, opacity: 0.3, duration: 1, ease: 'power3.out' });
            if (title) projectTl.fromTo(title, { clipPath: 'inset(0 0 100% 0)', opacity: 0 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6');
            if (desc) projectTl.fromTo(desc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
            if (techPills.length) projectTl.fromTo(techPills, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, '-=0.3');
            if (link) projectTl.fromTo(link, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
            if (visual) {
                projectTl.fromTo(visual, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.7');
                // Mask wipe reveal
                const wipe = visual.querySelector('.project__visual-wipe');
                if (wipe) {
                    projectTl.add(() => wipe.classList.add('revealed'), '-=0.5');
                }
            }
        });
    } else {
        // Mobile fallback
        document.querySelectorAll('.section--project').forEach(section => {
            const elements = section.querySelectorAll('.project__number, .project__title, .project__desc, .project__tech, .project__link, .project__visual');
            elements.forEach(el => {
                gsap.fromTo(el, { y: 30, opacity: 0 }, {
                    y: 0, opacity: 1, duration: 0.6,
                    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
                });
            });
            const slide = section.querySelector('.project__slide');
            if (slide) slide.style.transform = 'none';
        });
    }

    // ==========================================================================
    // 16b. 3D TILT ON PROJECT VISUALS
    // ==========================================================================
    if (!isMobile) {
        document.querySelectorAll('.project__visual').forEach(visual => {
            visual.addEventListener('mousemove', (e) => {
                const rect = visual.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(visual, {
                    rotateY: x * 12,
                    rotateX: -y * 12,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            visual.addEventListener('mouseleave', () => {
                gsap.to(visual, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            });
        });
    }

    // ==========================================================================
    // 17. SKILLS SECTION
    // ==========================================================================
    document.querySelectorAll('.skill-domain').forEach((domain, i) => {
        gsap.fromTo(domain,
            { y: 30, opacity: 0, scale: 0.95 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 0.6, delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: domain,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Stagger reveals
    document.querySelectorAll('.timeline__item, .certif-item, .lang-item, .about__tag, .skills__stack-item').forEach(el => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.5,
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
    });

    // ==========================================================================
    // 18. CONTACT SECTION
    // ==========================================================================
    const contactHeading = document.querySelector('.contact__heading');
    if (contactHeading && !prefersReduced) {
        gsap.fromTo(contactHeading, { y: 60, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: contactHeading, start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const data = Object.fromEntries(new FormData(contactForm));

            btn.textContent = 'Envoi...';
            btn.disabled = true;

            try {
                const res = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    btn.textContent = 'Envoyé !';
                    btn.style.background = '#34d399';
                    contactForm.reset();
                } else { throw new Error(); }
            } catch {
                btn.textContent = 'Erreur';
                btn.style.background = '#ef4444';
            }

            setTimeout(() => {
                btn.textContent = 'Envoyer';
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        });
    }

    // ==========================================================================
    // 19. PHOTO REVEAL MASK
    // ==========================================================================
    const photoMask = document.querySelector('.about__photo-mask');
    if (photoMask && !prefersReduced) {
        ScrollTrigger.create({
            trigger: '.about__photo-wrap',
            start: 'top 75%',
            once: true,
            onEnter: () => {
                gsap.to(photoMask, {
                    scaleY: 0,
                    duration: 1.2,
                    ease: 'power3.inOut'
                });
            }
        });
    } else if (photoMask) {
        photoMask.style.transform = 'scaleY(0)';
    }

    // ==========================================================================
    // 20. QUOTE SECTION — Word reveal + line + cite
    // ==========================================================================
    const quoteText = document.querySelector('[data-split-words-quote]');
    if (quoteText) {
        const text = quoteText.textContent.trim();
        quoteText.innerHTML = text.split(/\s+/).map(word =>
            `<span class="word">${word}</span>`
        ).join(' ');

        const words = quoteText.querySelectorAll('.word');
        const quoteLine = document.querySelector('.quote__line');
        const quoteCite = document.querySelector('.quote__cite');

        if (!prefersReduced) {
            ScrollTrigger.create({
                trigger: quoteText,
                start: 'top 75%',
                end: 'bottom 40%',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    words.forEach((word, i) => {
                        const wordProgress = i / words.length;
                        const opacity = Math.min(1, Math.max(0.1, (progress - wordProgress) * words.length * 0.6));
                        word.style.opacity = opacity;
                    });
                }
            });

            if (quoteLine) {
                ScrollTrigger.create({
                    trigger: quoteLine,
                    start: 'top 80%',
                    once: true,
                    onEnter: () => quoteLine.classList.add('expanded')
                });
            }

            if (quoteCite) {
                ScrollTrigger.create({
                    trigger: quoteCite,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => quoteCite.classList.add('visible')
                });
            }
        } else {
            words.forEach(w => w.style.opacity = 1);
            if (quoteLine) quoteLine.classList.add('expanded');
            if (quoteCite) quoteCite.classList.add('visible');
        }
    }


    // ==========================================================================
    // 22. SECTION LABEL UNDERLINE ON SCROLL
    // ==========================================================================
    document.querySelectorAll('.section-label').forEach(label => {
        ScrollTrigger.create({
            trigger: label,
            start: 'top 88%',
            once: true,
            onEnter: () => label.classList.add('underlined')
        });
    });

    // ==========================================================================
    // 23. ABOUT STATS — Bigger counter animation
    // ==========================================================================
    // (already handled in section 15, but let's add a scale punch effect)
    document.querySelectorAll('.about__stat-number').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.fromTo(el, { scale: 0.5, opacity: 0 }, {
                    scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)',
                    delay: 0.3
                });
            }
        });
    });

    // ==========================================================================
    // 25. HERO NAME PARALLAX (different speeds per line)
    // ==========================================================================
    if (!isMobile && !prefersReduced) {
        const heroLines = document.querySelectorAll('.hero__line');
        heroLines.forEach((line, i) => {
            const speed = i === 0 ? 0.3 : 0.6;
            gsap.to(line, {
                y: () => speed * -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.section--hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ==========================================================================
    // 26. MENU LINK MAGNETIC EFFECT
    // ==========================================================================
    if (!isMobile) {
        document.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(link, {
                    x: x * 0.2,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    // ==========================================================================
    // 27. FOOTER "Merci." LETTER-BY-LETTER REVEAL
    // ==========================================================================
    const footerBigText = document.querySelector('.footer__big-text');
    if (footerBigText) {
        const text = footerBigText.textContent.trim();
        footerBigText.innerHTML = text.split('').map(char =>
            char === ' ' ? ' ' : `<span class="footer-letter">${char}</span>`
        ).join('');

        const letters = footerBigText.querySelectorAll('.footer-letter');

        if (!prefersReduced) {
            ScrollTrigger.create({
                trigger: footerBigText,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    letters.forEach((letter, i) => {
                        setTimeout(() => {
                            letter.classList.add('visible');
                        }, i * 120);
                    });
                }
            });
        } else {
            letters.forEach(l => l.classList.add('visible'));
        }
    }

    // ==========================================================================
    // 28. BUTTON TEXT SLIDE SETUP
    // ==========================================================================
    document.querySelectorAll('.btn').forEach(btn => {
        // Skip buttons that already have btn__text or contain complex inner markup (svgs, forms)
        if (btn.querySelector('.btn__text') || btn.querySelector('svg') || btn.closest('form')) return;
        const text = btn.textContent.trim();
        if (!text) return;
        btn.innerHTML = `<span class="btn__text"><span>${text}</span><span>${text}</span></span>`;
    });

    // ==========================================================================
    // 29. CONTACT SOCIAL ICONS STAGGER REVEAL
    // ==========================================================================
    const contactSocials = document.querySelectorAll('.contact__social');
    if (contactSocials.length && !prefersReduced) {
        contactSocials.forEach((social, i) => {
            gsap.fromTo(social,
                { y: 30, opacity: 0, scale: 0.8 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.6, delay: i * 0.1,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: social.parentElement,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // ==========================================================================
    // 30. FOOTER LINKS HOVER ANIMATION
    // ==========================================================================
    if (!isMobile) {
        document.querySelectorAll('.footer__links a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, { y: -2, duration: 0.3, ease: 'power2.out' });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { y: 0, duration: 0.4, ease: 'power2.out' });
            });
        });
    }

    // ==========================================================================
    // 24. SMOOTH SCROLL for anchor links
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]:not(.menu-link)').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                if (lenis) { lenis.scrollTo(target, { duration: 1.5 }); }
                else { target.scrollIntoView({ behavior: 'smooth' }); }
            }
        });
    });

});

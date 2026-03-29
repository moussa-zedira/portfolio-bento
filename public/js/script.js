// ============================================
// ZEDIRA MOUSSA — Portfolio Scripts V2
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Loader ----
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1200);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => loader.classList.add('hidden'), 1200);
    }

    // ---- Floating Particles ----
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.4';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 235 : 270;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(235, 60%, 60%, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ---- Card Reveal on Scroll ----
    const cards = document.querySelectorAll('.bento-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(card => revealObserver.observe(card));

    // ---- Card Mouse Glow Effect ----
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ---- Magnetic Hover on Buttons ----
    document.querySelectorAll('.btn, .social-link, .stack-item').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // ---- Animated Counters (handled below with particle burst) ----

    // ---- Skill Bars Animation ----
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.width = `${entry.target.dataset.width}%`;
                }, i * 150);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(fill => skillObserver.observe(fill));

    // ---- Mobile Nav Toggle ----
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Contact Form (POST to /contact API) ----
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn');
            const originalText = btn.textContent;
            btn.textContent = 'Envoi...';
            btn.disabled = true;

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                const res = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    btn.textContent = 'Envoye !';
                    btn.style.background = '#22c55e';
                    form.reset();
                } else {
                    btn.textContent = 'Erreur';
                    btn.style.background = '#ef4444';
                }
            } catch {
                btn.textContent = 'Erreur';
                btn.style.background = '#ef4444';
            }

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        });
    }

    // ---- Navbar: Hide on scroll down, show on scroll up + glass effect ----
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class for glass effect
        navbar.classList.toggle('scrolled', currentScroll > 50);

        // Hide / show
        if (currentScroll > lastScroll && currentScroll > 120) {
            navbar.style.transform = 'translateX(-50%) translateY(calc(-100% - 20px))';
            navbar.style.opacity = '0';
        } else {
            navbar.style.transform = 'translateX(-50%) translateY(0)';
            navbar.style.opacity = '1';
        }
        navbar.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease';
        lastScroll = currentScroll;
    });

    // ---- Typing Effect for Hero Title ----
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent)';
        heroTitle.style.display = 'inline-block';
        let i = 0;
        const typeInterval = setInterval(() => {
            heroTitle.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
                // Blinking cursor then fade
                let blinks = 0;
                const blinkInterval = setInterval(() => {
                    heroTitle.style.borderRightColor = blinks % 2 === 0 ? 'transparent' : 'var(--accent)';
                    blinks++;
                    if (blinks > 6) {
                        clearInterval(blinkInterval);
                        heroTitle.style.borderRight = 'none';
                    }
                }, 400);
            }
        }, 45);
    }

    // ---- Tilt Effect on Hero Card ----
    const heroCard = document.querySelector('.card-hero');
    if (heroCard) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroCard.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
        });
        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.transform = '';
            heroCard.style.transition = 'transform 0.5s ease';
        });
    }

    // ---- Enhanced 3D Tilt on Project Cards ----
    document.querySelectorAll('.card-project').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });


    // ---- Scroll Progress Bar ----
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

    // ---- Scroll to Top Button ----
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Text Reveal Word by Word ----
    document.querySelectorAll('.about-text, .quote-text').forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.classList.add('word-reveal');
        el.innerHTML = words.map((word, i) =>
            `<span class="word" style="transition-delay: ${i * 0.03}s">${word}</span>`
        ).join(' ');
    });

    // Observe word-reveal elements
    const wordObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                wordObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.word-reveal').forEach(el => wordObserver.observe(el));

    // ---- Counter Particles Burst ----
    function burstParticles(el) {
        const rect = el.getBoundingClientRect();
        const parent = el.closest('.stat');
        if (!parent) return;
        const colors = ['#818cf8', '#c084fc', '#38bdf8', '#34d399'];
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'counter-particle';
            const angle = (Math.PI * 2 * i) / 12;
            const dist = 30 + Math.random() * 30;
            p.style.left = '50%';
            p.style.top = '30%';
            p.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--py', `${Math.sin(angle) * dist}px`);
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.boxShadow = `0 0 6px ${p.style.background}`;
            parent.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    }

    // Override counter animation to add particles at end
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const origObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    const duration = 1200;
                    const start = performance.now();
                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        entry.target.textContent = Math.round(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            burstParticles(entry.target);
                        }
                    }
                    requestAnimationFrame(update);
                    origObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        origObserver.observe(el);
    });

});

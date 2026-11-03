/**
 * Comportements du portfolio. Volontairement court : la page fonctionne sans
 * ce script (menu ouvert, contenu visible), il ne fait qu'ameliorer.
 *
 *   0. logo qui se trace a l'arrivee
 *   1. texte qui s'allume mot a mot au defilement
 *   2. section courante marquee dans le dock
 *   3. apparitions legeres au defilement
 *   4. boutons « Copier » (telephone, e-mail)
 *   5. envoi du formulaire de contact
 */
(() => {
    'use strict';

    // Signale au CSS que le script tourne : sans lui, rien n'est masque.
    document.documentElement.classList.add('js');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ------------------------------------------------- 0. logo qui se trace
    // La goutte verte dessine le M puis le Z, une fois, a l'arrivee.
    // Les animations SVG du logo demarrent ensemble ; sans script, il reste fixe.
    if (!reduce) {
        document.querySelectorAll('.mono-mark__logo animate, .mono-mark__logo set, .mono-mark__logo animateMotion')
            .forEach((a) => typeof a.beginElement === 'function' && a.beginElement());
    }

    // ------------------------------------------------- 1. texte qui s'allume
    // Chaque mot s'allume quand il passe sous le milieu de l'ecran. Sans script
    // ou en mouvement reduit, le texte est simplement allume d'emblee (CSS).
    const fills = [...document.querySelectorAll('.fill[data-fill]')];
    if (fills.length && !reduce) {
        const words = fills.flatMap((f) => [...f.querySelectorAll('.fill__w')]);
        let ticking = false;
        const paint = () => {
            ticking = false;
            const line = window.innerHeight * 0.62;
            words.forEach((w) => w.classList.toggle('is-lit', w.getBoundingClientRect().top < line));
        };
        const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        paint();
    } else {
        fills.forEach((f) => f.querySelectorAll('.fill__w').forEach((w) => w.classList.add('is-lit')));
    }

    // ------------------------------------------ 2. section courante dans le dock
    const navLinks = [...document.querySelectorAll('.dock a[data-section]')];
    const sections = navLinks.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
        const visible = new Map();
        const mark = () => {
            // La section la plus haute encore visible gagne.
            let current = null;
            for (const s of sections) if (visible.get(s.id)) { current = s.id; break; }
            navLinks.forEach((a) => {
                if (a.dataset.section === current) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        };
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((en) => visible.set(en.target.id, en.isIntersecting));
            mark();
        }, { rootMargin: '-35% 0px -55% 0px' });
        sections.forEach((s) => spy.observe(s));
    }

    // ------------------------------------------------------------ 3. apparitions
    const reveals = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach((el) => el.classList.add('is-in'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        reveals.forEach((el) => io.observe(el));
    }

    // --------------------------------------------------------- 4. boutons Copier
    document.querySelectorAll('.copy[data-copy]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const label = btn.textContent;
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                btn.textContent = 'Copié';
                btn.dataset.state = 'done';
            } catch {
                // Presse-papiers refuse : on selectionne le texte pour une copie manuelle.
                const target = btn.previousElementSibling;
                if (target) {
                    const range = document.createRange();
                    range.selectNodeContents(target);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                btn.textContent = 'Sélectionné';
            }
            setTimeout(() => { btn.textContent = label; delete btn.dataset.state; }, 1800);
        });
    });

    // ------------------------------------------------------ 5. formulaire contact
    const form = document.getElementById('contactForm');
    if (form) {
        const status = document.getElementById('formStatus');
        const btn = form.querySelector('button[type="submit"]');
        const say = (text, state) => { status.textContent = text; status.dataset.state = state || ''; };

        // Le message d'erreur dit quoi corriger, au lieu d'un simple « Erreur ».
        // form.elements et non form.name : form.name designe l'attribut name du formulaire lui-meme.
        const { name, email, message } = form.elements;
        const check = () => {
            const fields = [
                [name, name.value.trim().length > 0, 'Indiquez votre nom.'],
                [email, email.validity.valid && email.value.trim() !== '', 'Indiquez une adresse e-mail valide.'],
                [message, message.value.trim().length >= 10, 'Le message doit faire au moins 10 caractères.']
            ];
            for (const [el] of fields) el.removeAttribute('aria-invalid');
            const bad = fields.find(([, ok]) => !ok);
            if (bad) { bad[0].setAttribute('aria-invalid', 'true'); bad[0].focus(); say(bad[2], 'error'); return false; }
            return true;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!check()) return;
            const label = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Envoi en cours…';
            say('', '');
            try {
                const res = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(Object.fromEntries(new FormData(form)))
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || data.success === false) throw new Error(data.message || 'Envoi impossible pour le moment.');
                form.reset();
                say('Message envoyé. Je vous réponds rapidement.', 'success');
            } catch (err) {
                say(`${err.message} Vous pouvez aussi appeler ou écrire directement.`, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = label;
            }
        });
    }
})();

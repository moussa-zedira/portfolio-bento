const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Rate limit strict pour le formulaire de contact (anti-spam)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // max 3 messages par IP par heure
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Trop de messages envoyés. Réessayez dans une heure.' }
});

// Sanitizer basique (anti header-injection pour email)
const sanitize = (str) => String(str || '')
    .replace(/[\r\n]/g, ' ')
    .replace(/[<>]/g, '')
    .trim();

// Escape HTML pour les emails
const escapeHtml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Transporteur Nodemailer (Gmail SMTP) — initialisé à la demande
let mailTransporter = null;
const getMailer = () => {
    if (mailTransporter) return mailTransporter;
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        return null; // env vars manquantes, fallback log-only
    }
    mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
    return mailTransporter;
};

// Portfolio data
const portfolio = {
    name: 'Moussa Zedira',
    title: 'Technicien Support IT & Automatisation',
    subtitle: 'Support IT • IA & Automatisation • Réseaux • Python',
    seeking: 'Recherche alternance Support IT / Helpdesk — IA & Automatisation — Île-de-France',
    aboutHook: `Technicien support IT en formation — et je code mes propres outils pour résoudre les problèmes plus vite.`,
    aboutPoints: [
        `Le support IT, c'est le contact humain : un utilisateur bloqué, un diagnostic à poser, un problème résolu.`,
        `Ce qui me différencie : j'utilise l'IA et Python pour automatiser le tri de tickets, scripter les tâches répétitives, générer de la documentation.`,
        `Objectif : une alternance en Île-de-France où je peux apprendre en équipe et apporter cette valeur ajoutée.`
    ],
    tags: ['Support IT', 'IA & Automatisation', 'Python', 'Cybersécurité', 'Réseaux', 'SQL'],
    location: 'Argenteuil, Île-de-France',
    stats: {
        certifications: 5,
        projects: 4
    },
    formation: [
        {
            year: '2025 - 2026',
            title: 'Titre Professionnel — Technicien d\'Assistance Informatique',
            school: 'Doranco, Bagnolet',
            detail: 'Support, réseaux, systèmes, sécurité'
        },
        {
            year: '2025',
            title: 'Parcours Baccalauréat Général',
            detail: 'Spécialités : Mathématiques, NSI, Sciences de l\'ingénieur',
            school: 'Argenteuil'
        }
    ],
    certifications: [
        'Cisco — Cybersecurity Essentials',
        'Cisco — Networking Essentials',
        'Cisco — Python Essentials',
        'Cisco — Linux Unhatched',
        'Anthropic — IA Générative & Prompt Engineering'
    ],
    skills: [
        {
            category: 'Support IT',
            items: ['Diagnostic & dépannage', 'GLPI (ticketing)', 'Active Directory', 'Assistance utilisateurs', 'Documentation technique']
        },
        {
            category: 'Systèmes',
            items: ['Windows 10/11 & Server', 'Linux (Ubuntu, Debian)', 'PowerShell', 'Bash', 'Virtualisation (VirtualBox, ESXi, vCenter, Hyper-V)', 'Conteneurisation (Docker)', 'Supervision (monitoring)']
        },
        {
            category: 'Réseaux',
            items: ['TCP/IP, DNS, DHCP', 'Cisco IOS (Packet Tracer)', 'Switchs & routeurs', 'Wi-Fi & VPN', 'Reverse proxy (Nginx)', 'Wireshark']
        },
        {
            category: 'IA & Automatisation',
            items: ['Claude / ChatGPT (prompting avancé)', 'Scripts Python (automatisation)', 'Workflows automatisés (n8n)', 'Traitement de données', 'Génération de documentation', 'Triage automatique']
        },
        {
            category: 'Développement',
            items: ['Python', 'SQL (PostgreSQL)', 'JavaScript / React', 'Git & GitHub', 'API REST']
        },
        {
            category: 'Cybersécurité',
            items: ['Analyse de logs', 'SIEM & SOAR (concepts)', 'Détection de menaces', 'Sécurité réseau', 'Durcissement (fail2ban, SSH)', 'Sauvegardes', 'Veille CVE']
        }
    ],
    stack: [
        { name: 'Python', icon: 'python' },
        { name: 'SQL', icon: 'sql' },
        { name: 'Linux', icon: 'linux' },
        { name: 'Docker', icon: 'docker' },
        { name: 'Windows', icon: 'windows' },
        { name: 'Cisco', icon: 'cisco' },
        { name: 'Git', icon: 'git' },
        { name: 'GLPI', icon: 'glpi' },
        { name: 'Claude IA', icon: 'ai' }
    ],
    experiences: [
        {
            period: '2025 - 2026',
            title: 'Gérant — Entreprise de nettoyage',
            company: 'Gestion complète : clients, planning, facturation, coordination d\'équipe'
        },
        {
            period: '2025',
            title: 'Opérateur logistique',
            company: 'Amazon (Delivery Service Partner) — process, outils numériques et reporting'
        }
    ],
    projects: [
        {
            id: '01',
            slug: 'cyberdef',
            title: 'CyberDef',
            desc: 'Plateforme de cybersécurité tout-en-un : SIEM, détection, réponse automatisée, threat intel et pentest.',
            tech: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'Celery'],
            color: '#ef4444',
            detail: {
                subtitle: 'Plateforme de cybersécurité tout-en-un',
                overview: `Au lieu d'avoir 5-6 outils différents (un SIEM pour surveiller, un scanner pour tester,
                    un C2 pour le Red Team, un outil pour répondre aux incidents...), CyberDef réunit tout dans une seule
                    application web. C'est comme fusionner Splunk + Burp Suite + Sliver C2 + GoPhish + BloodHound +
                    un assistant IA multi-provider (Claude/OpenAI/Ollama) dans un seul dashboard.`,
                features: [
                    {
                        icon: '01',
                        title: 'SIEM — Surveillance',
                        desc: 'Réception et analyse automatique de logs de sécurité (firewall, serveurs, endpoints). Pipeline de parsing, enrichissement (géolocalisation IP, réputation, assets), scoring de menace, détection de règles, corrélation multi-étapes.',
                        highlight: 'Langage de recherche CQL intégré, similaire à Splunk SPL'
                    },
                    {
                        icon: '02',
                        title: 'Detection Engine',
                        desc: 'Règles SIGMA (standard ouvert), corrélation multi-étapes pour détecter les attaques complexes (ex: brute force + login success + lateral movement = compromission).',
                        highlight: 'Scoring 0-100 basé sur la Threat Intel, la sévérité et la criticité'
                    },
                    {
                        icon: '03',
                        title: 'Red Team — Sliver C2, GoPhish, BloodHound',
                        desc: 'Opérations offensives intégrées : Operator Console Sliver (sessions, terminal, beacon graph), campagnes phishing GoPhish (tracking, kill-switch, RoE), analyse chemins d\'attaque AD via BloodHound.',
                        highlight: 'Engagement tracking, MITRE ATT&CK mapping automatique, audit trail complet'
                    },
                    {
                        icon: '04',
                        title: 'Threat Intelligence',
                        desc: 'Base d\'indicateurs malveillants (IPs, domaines, hash, URLs). Feeds automatiques AbuseIPDB, AlienVault OTX, abuse.ch, PhishTank. IOC Manager avec TTL et scoring de confiance.',
                        highlight: 'Compatibilité STIX/TAXII avec serveur intégré'
                    },
                    {
                        icon: '05',
                        title: 'Assistant IA + RAG',
                        desc: 'Assistant contextuel multi-provider (Claude, OpenAI, Ollama local). Triage automatique des events/incidents, génération de règles Sigma, RAG sémantique sur 11 000+ docs indexés (MITRE ATT&CK, NVD CVE, SigmaHQ).',
                        highlight: 'Embeddings FAISS 384 dim, contexte engagement injecté (scope, RoE, sessions actives)'
                    },
                    {
                        icon: '06',
                        title: 'Pentest Web',
                        desc: 'Moteurs dédiés : SQLi (5 techniques, détection DBMS), XSS (6 contextes, payloads adaptés), brute force (SSH/FTP/HTTP), recon multi-sources (DNS, CT logs, wordlists), crawler et netscan.',
                        highlight: 'Pipeline d\'enchaînement automatique de scans + rapports MITRE/CVSS'
                    }
                ],
                architecture: {
                    frontend: 'Next.js 15 / React 18 — 30 routes (App Router)',
                    backend: 'FastAPI (Python 3.11) — 1046 endpoints, 135 routers',
                    database: 'PostgreSQL 16 — 23 migrations Alembic',
                    cache: 'Redis 7 (cache, pub/sub, sessions, rate limit)',
                    queue: 'Celery (worker + beat scheduler)'
                },
                stats: [
                    { label: 'Endpoints API', value: '1046' },
                    { label: 'Routers FastAPI', value: '135' },
                    { label: 'Pages Frontend', value: '30' },
                    { label: 'Docs RAG indexés', value: '11k+' },
                    { label: 'Services Docker', value: '7' },
                    { label: 'Lignes de code', value: '~214k' }
                ]
            }
        },
        {
            id: '02',
            slug: 'chapitres',
            title: 'Chapitres',
            desc: 'Plateforme éducative gratuite pour lycéens : 1400+ utilisateurs actifs, 504+ chapitres, quiz interactifs, annales du Bac.',
            tech: ['Next.js', 'React', 'Vercel', 'KaTeX', 'OAuth'],
            color: '#818cf8',
            link: 'https://meschapitres.fr',
            detail: {
                subtitle: 'Plateforme de révision gratuite pour le Baccalauréat',
                overview: `Chapitres est une plateforme éducative 100% gratuite destinée aux lycéens
                    qui préparent le Baccalauréat. Elle couvre l'intégralité du programme officiel
                    (Bulletin Officiel 2025-2026) de la Seconde à la Terminale, avec des fiches de
                    révision structurées, des quiz interactifs chronométrés et les annales du Bac.
                    Créé pour les lycéens, par les lycéens — plus de 1400 utilisateurs actifs.`,
                features: [
                    {
                        icon: '01',
                        title: 'Programme complet — 504+ chapitres',
                        desc: 'Couverture intégrale du programme officiel : Seconde (112 chapitres), Première (185 chapitres), Terminale (207 chapitres). 16 matières en Terminale, du tronc commun aux spécialités (Maths, NSI, Physique, SVT, SES, HGGSP...).',
                        highlight: 'Aligné sur le Bulletin Officiel 2025-2026'
                    },
                    {
                        icon: '02',
                        title: 'Fiches de révision',
                        desc: 'Fiches structurées et synthétiques pour chaque chapitre. Concepts essentiels résumés en une page, avec rendu mathématique KaTeX pour les formules.',
                        highlight: 'Comprends. Révise. Réussis.'
                    },
                    {
                        icon: '03',
                        title: 'Quiz interactifs',
                        desc: 'QCM chronométrés avec choix de durée (30s, 60s ou 90s par question). Score détaillé et corrections complètes à la fin de chaque quiz.',
                        highlight: 'Suivi de progression par matière'
                    },
                    {
                        icon: '04',
                        title: 'Annales du Bac 2021-2024',
                        desc: 'Sujets d\'examen classés par matière, année et session géographique (Métropole, Polynésie, Amérique du Nord, Asie, Liban...). Durées et coefficients indiqués.',
                        highlight: '8 sessions géographiques disponibles'
                    },
                    {
                        icon: '05',
                        title: 'Hub Bac 2026',
                        desc: 'Page dédiée avec le calendrier complet des épreuves, les coefficients, la répartition des notes (60% examen final / 40% contrôle continu) et les ressources de révision.',
                        highlight: 'Calendrier, coefficients et planning de révision'
                    },
                    {
                        icon: '06',
                        title: 'Blog & Méthodologie',
                        desc: '10 articles de conseils : méthode de dissertation en philo, formules essentielles en maths, erreurs courantes en physique, préparation du Grand Oral, planning de révision...',
                        highlight: 'Articles de 6 à 10 min de lecture'
                    }
                ],
                architecture: {
                    frontend: 'Next.js / React — App Router',
                    hosting: 'Vercel',
                    auth: 'Google OAuth + Email/Password',
                    math: 'KaTeX (rendu formules)',
                    pwa: 'Progressive Web App installable',
                    seo: 'Schema.org, Open Graph dynamique'
                },
                stats: [
                    { label: 'Utilisateurs actifs', value: '1400+' },
                    { label: 'Chapitres', value: '504+' },
                    { label: 'Matières', value: '16' },
                    { label: 'Niveaux', value: '3' },
                    { label: 'Sessions Annales', value: '8' },
                    { label: 'Articles Blog', value: '10' },
                    { label: 'Prix', value: 'Gratuit' }
                ]
            }
        },
        {
            id: '03',
            slug: 'gdchess',
            title: 'GDChess',
            desc: 'Jeu d\'échecs complet avec IA multi-niveaux (Minimax alpha-beta), 3 thèmes visuels, développé en Godot 4.',
            tech: ['Godot 4', 'GDScript', 'Minimax', 'Alpha-Beta'],
            color: '#34d399',
            detail: {
                subtitle: 'Jeu d\'échecs 2D avec IA multi-niveaux, développé en Godot 4.6',
                overview: `Jeu d'échecs 2D développé de zéro en Godot 4.6 avec GDScript. Le projet
                    implémente l'intégralité des règles officielles FIDE, une IA à 3 niveaux de
                    difficulté basée sur l'algorithme Minimax avec élagage alpha-beta, un système
                    de timer configurable, et 3 thèmes visuels complets (Médiéval, Moderne, Bois Classique).`,
                features: [
                    {
                        icon: '01',
                        title: 'Règles complètes FIDE',
                        desc: 'Tous les mouvements, captures, roque (petit et grand), prise en passant, promotion, détection d\'échec, échec et mat, pat. Historique en notation algébrique scrollable (e4, Cf3, Fxc6+, Rh7#).',
                        highlight: '100% des règles officielles implémentées'
                    },
                    {
                        icon: '02',
                        title: 'IA 3 niveaux — Minimax Alpha-Beta',
                        desc: 'Débutant (profondeur 1, coups aléatoires), Intermédiaire (profondeur 3, évaluation positionnelle), Expert (profondeur 4, structure de pions, mobilité). Tri des coups par MVV-LVA.',
                        highlight: 'Tables d\'évaluation positionnelle 8x8 par pièce + table endgame'
                    },
                    {
                        icon: '03',
                        title: 'Modes de jeu & Timers',
                        desc: 'Solo contre l\'IA ou 2 joueurs en local. Timers configurables : aucun, 3min, 5min, 10min, 15min par joueur. Panneau latéral avec pièces capturées triées par valeur.',
                        highlight: '5 options de timer + mode libre'
                    },
                    {
                        icon: '04',
                        title: '3 thèmes visuels complets',
                        desc: 'Médiéval, Moderne et Bois Classique. Chaque thème modifie les couleurs, décorations et l\'UI complète. Système de thèmes modulaire via game_settings.gd.',
                        highlight: 'Palettes de couleurs, décorations et UI par thème'
                    },
                    {
                        icon: '05',
                        title: 'Évaluation avancée (Expert)',
                        desc: 'Bonus de mobilité, pénalités pions doublés et isolés, détection de phase de fin de partie, transition vers table endgame pour le roi. Simulation de plateau immuable pour l\'IA sans effets de bord.',
                        highlight: 'Évaluation positionnelle + structurelle + mobilité'
                    },
                    {
                        icon: '06',
                        title: 'Architecture signal-based',
                        desc: 'Communication découplée entre composants via les signaux Godot. Gestion d\'état complexe : tours, timers, animations, IA asynchrone. Annulation de coups IA via game_id pour la concurrence.',
                        highlight: '8 scripts modulaires, architecture propre'
                    }
                ],
                architecture: {
                    moteur: 'Godot 4.6 / GDScript',
                    ia: 'Minimax + élagage alpha-beta (profondeur 4)',
                    validation: 'move_validator.gd — coups légaux, échec/mat/pat',
                    rendu: 'board.gd — plateau 2D, animations, panneau latéral',
                    config: 'game_settings.gd — thèmes, paramètres globaux',
                    scripts: '8 fichiers GDScript modulaires'
                },
                stats: [
                    { label: 'Niveaux IA', value: '3' },
                    { label: 'Profondeur max', value: '4' },
                    { label: 'Thèmes visuels', value: '3' },
                    { label: 'Options timer', value: '5' },
                    { label: 'Scripts', value: '8' },
                    { label: 'Moteur', value: 'Godot 4.6' }
                ]
            }
        }
        ,
        {
            id: '04',
            slug: 'homelab',
            title: 'HomeLab',
            desc: 'Serveur Linux auto-hébergé : une douzaine de services Docker (cloud, médias, Git, DNS, supervision), accès distant chiffré sans exposition sur Internet.',
            tech: ['Debian', 'Docker', 'Linux', 'Tailscale', 'Nginx', 'Bash'],
            color: '#38bdf8',
            wip: true,
            startedAt: 'Mai 2026',
            detail: {
                subtitle: 'Serveur Linux auto-hébergé & conteneurs Docker',
                overview: `Un serveur monté et administré chez moi pour pratiquer l'administration système Linux en conditions réelles. Une distribution Debian sur mini-PC, le stockage géré en LVM, et une douzaine de services applicatifs conteneurisés avec Docker : cloud personnel, médiathèque, dépôts Git, DNS local, supervision et tableau de bord. L'accès distant se fait via un réseau privé chiffré, sans ouvrir le moindre port sur Internet. L'objectif : maîtriser l'orchestration de services, le réseau, la supervision et le durcissement d'un serveur de bout en bout.`,
                features: [
                    {
                        icon: '01',
                        title: 'Serveur Linux & stockage',
                        desc: 'Installation et administration d\'un serveur Debian sur mini-PC : partitionnement LVM, gestion du stockage de masse, services systemd, maintenance et mises à jour.',
                        highlight: 'Administration système de bout en bout'
                    },
                    {
                        icon: '02',
                        title: 'Conteneurisation Docker',
                        desc: 'Une douzaine de services isolés en conteneurs, chacun avec son fichier docker-compose dédié. Gestion des volumes, des réseaux Docker et des journaux, administration via interface web.',
                        highlight: 'Architecture micro-services reproductible'
                    },
                    {
                        icon: '03',
                        title: 'Services auto-hébergés',
                        desc: 'Cloud personnel (fichiers, photos), médiathèque, dépôts Git self-hosted, DNS local avec filtrage, orchestration de workflows automatisés et tableau de bord centralisé.',
                        highlight: 'Indépendance vis-à-vis des services tiers'
                    },
                    {
                        icon: '04',
                        title: 'Accès distant sécurisé',
                        desc: 'Connexion à distance via un réseau privé maillé et chiffré, sans aucun port exposé sur Internet. Résolution de noms interne et accès homogène depuis tous les appareils.',
                        highlight: 'Zéro service exposé publiquement'
                    },
                    {
                        icon: '05',
                        title: 'Supervision & monitoring',
                        desc: 'Surveillance de la disponibilité des services et des métriques système en temps réel, avec historique et notifications push en cas d\'incident.',
                        highlight: 'Disponibilité suivie en continu'
                    },
                    {
                        icon: '06',
                        title: 'Sécurité & sauvegardes',
                        desc: 'Reverse proxy, protection anti-brute-force, durcissement de l\'accès SSH et sauvegardes régulières des bases de données.',
                        highlight: 'Bonnes pratiques de durcissement'
                    }
                ],
                architecture: {
                    serveur: 'Debian (mini-PC, stockage LVM)',
                    conteneurs: 'Docker + docker-compose',
                    reseau: 'Réseau privé chiffré, 0 port exposé',
                    proxy: 'Reverse proxy + DNS local',
                    supervision: 'Monitoring disponibilité + métriques',
                    securite: 'fail2ban, durcissement SSH, sauvegardes'
                },
                stats: [
                    { label: 'Services Docker', value: '12' },
                    { label: 'Ports exposés sur Internet', value: '0' },
                    { label: 'Stockage', value: '4 To' },
                    { label: 'OS', value: 'Debian' },
                    { label: 'Accès distant', value: 'VPN maillé' },
                    { label: 'Supervision', value: '24/7' }
                ]
            }
        }
    ],
    languages: ['Français (natif)', 'Anglais (intermédiaire)', 'Arabe (bilingue)', 'Espagnol (conversationnel)'],
    socials: {
        github: 'https://github.com/moussa-zedira',
        linkedin: 'https://www.linkedin.com/in/moussa-zedira-15abba3b8',
        email: 'moussazedira@gmail.com',
        phone: ''
    }
};

// Home page
router.get('/', (req, res) => {
    res.render('index', { portfolio });
});

// Project detail page
router.get('/projet/:slug', (req, res) => {
    const project = portfolio.projects.find(p => p.slug === req.params.slug);
    if (!project || !project.detail) {
        return res.status(404).render('404', { portfolio });
    }
    res.render('project', { portfolio, project });
});

// Contact form handler — rate limit + validation + honeypot
router.post('/contact',
    contactLimiter,
    [
        body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nom invalide (2-100 caractères)'),
        body('email').trim().isEmail().normalizeEmail().withMessage('Email invalide'),
        body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message invalide (10-5000 caractères)'),
        body('website').optional({ checkFalsy: true }).isEmpty().withMessage('spam') // honeypot
    ],
    async (req, res) => {
        // Honeypot rempli = bot
        if (req.body.website) {
            return res.json({ success: true, message: 'Message envoyé avec succès !' }); // réponse factice
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const name = sanitize(req.body.name);
        const email = sanitize(req.body.email);
        const message = String(req.body.message || '').trim().slice(0, 5000);

        // Log serveur (backup)
        console.log('[Contact]', new Date().toISOString(), '-', name, '<' + email + '>');

        // Envoi email via Nodemailer
        const mailer = getMailer();
        if (!mailer) {
            console.warn('[Contact] Nodemailer non configuré (env vars manquantes) — message logué seulement');
            return res.json({ success: true, message: 'Message envoyé avec succès !' });
        }

        try {
            await mailer.sendMail({
                from: `"Portfolio — ${name}" <${process.env.GMAIL_USER}>`,
                to: process.env.CONTACT_TO || process.env.GMAIL_USER,
                replyTo: email,
                subject: `[Portfolio] Nouveau message de ${name}`,
                text: `De: ${name} <${email}>\n\n${message}\n\n---\nIP: ${req.ip}\nDate: ${new Date().toISOString()}`,
                html: `
                    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #6366f1, #f59e0b); padding: 24px; border-radius: 12px 12px 0 0;">
                            <h2 style="color: white; margin: 0; font-size: 20px;">Nouveau message portfolio</h2>
                        </div>
                        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
                            <p style="margin: 0 0 8px 0;"><strong>De :</strong> ${escapeHtml(name)}</p>
                            <p style="margin: 0 0 8px 0;"><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #1f2937;">${escapeHtml(message)}</p>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                            <p style="margin: 0; font-size: 12px; color: #6b7280;">IP : ${req.ip} — ${new Date().toLocaleString('fr-FR')}</p>
                        </div>
                    </div>
                `
            });
            res.json({ success: true, message: 'Message envoyé avec succès !' });
        } catch (err) {
            console.error('[Contact] Erreur envoi email:', err.message);
            // On retourne succès au client (pour ne pas lui révéler le backend)
            res.json({ success: true, message: 'Message envoyé avec succès !' });
        }
    }
);

// API: Get portfolio data (sans données sensibles)
router.get('/api/portfolio', (req, res) => {
    // Pas de CORS ouvert — seul le portfolio lui-même peut consommer l'API
    res.set('Access-Control-Allow-Origin', req.get('origin') && req.get('host') && req.get('origin').includes(req.get('host')) ? req.get('origin') : 'null');
    const publicData = { ...portfolio };
    delete publicData.socials?.phone; // au cas où
    res.json(publicData);
});

// 404 handler (toute route non matchée)
router.use((req, res) => {
    res.status(404).render('404', { portfolio });
});

module.exports = router;

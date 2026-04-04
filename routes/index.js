const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
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

// Portfolio data
const portfolio = {
    name: 'Moussa Zedira',
    title: 'Technicien Support IT & Automatisation',
    subtitle: 'Support IT • IA & Automatisation • Réseaux • Python',
    seeking: 'Recherche stage Support IT / Helpdesk — IA & Automatisation — Île-de-France',
    aboutHook: `Technicien support IT en formation — et je code mes propres outils pour résoudre les problèmes plus vite.`,
    aboutPoints: [
        `Le support IT, c'est le contact humain : un utilisateur bloqué, un diagnostic à poser, un problème résolu.`,
        `Ce qui me différencie : j'utilise l'IA et Python pour automatiser le tri de tickets, scripter les tâches répétitives, générer de la documentation.`,
        `Objectif : un stage en Île-de-France où je peux apprendre en équipe et apporter cette valeur ajoutée.`
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
            items: ['Windows 10/11 & Server', 'Linux (Ubuntu, Debian)', 'PowerShell', 'Bash', 'Virtualisation (VirtualBox)']
        },
        {
            category: 'Réseaux',
            items: ['TCP/IP, DNS, DHCP', 'Cisco IOS (Packet Tracer)', 'Switchs & routeurs', 'Wi-Fi & VPN', 'Wireshark']
        },
        {
            category: 'IA & Automatisation',
            items: ['Claude / ChatGPT (prompting avancé)', 'Scripts Python (automatisation)', 'Traitement de données', 'Génération de documentation', 'Triage automatique']
        },
        {
            category: 'Développement',
            items: ['Python', 'SQL (PostgreSQL)', 'JavaScript / React', 'Git & GitHub', 'API REST']
        },
        {
            category: 'Cybersécurité',
            items: ['Analyse de logs', 'SIEM (concepts)', 'Détection de menaces', 'Sécurité réseau', 'Veille CVE']
        }
    ],
    stack: [
        { name: 'Python', icon: 'python' },
        { name: 'SQL', icon: 'sql' },
        { name: 'Linux', icon: 'linux' },
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
        },
        {
            period: '2021',
            title: 'Stage administratif',
            company: 'Cabinet d\'avocat, Nanterre — support bureautique et gestion documentaire'
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
                    un outil pour répondre aux incidents...), CyberDef réunit tout dans une seule application web.
                    C'est comme fusionner Splunk + Burp Suite + Metasploit + TheHive + OpenCTI dans un seul dashboard.`,
                features: [
                    {
                        icon: '01',
                        title: 'SIEM — Surveillance',
                        desc: 'Réception et analyse automatique de logs de sécurité (firewall, serveurs, endpoints). Pipeline de 13 étapes : parsing, enrichissement (géolocalisation IP, réputation, assets), scoring de menace, détection de règles, corrélation.',
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
                        title: 'SOAR — Réponse automatisée',
                        desc: 'Quand une menace est détectée, des playbooks automatiques se déclenchent : bloquer une IP, isoler une machine, créer un ticket, notifier l\'équipe.',
                        highlight: '15 playbooks pré-configurés, 41 actions disponibles'
                    },
                    {
                        icon: '04',
                        title: 'Threat Intelligence',
                        desc: 'Base de données d\'indicateurs malveillants (IPs, domaines, hash). 8 feeds automatiques : abuse.ch, EmergingThreats, PhishTank, OTX...',
                        highlight: 'Compatibilité STIX/TAXII avec serveur intégré'
                    },
                    {
                        icon: '05',
                        title: 'Pentest Lab — 76 modules',
                        desc: 'Orchestrateur automatique : tu entres une cible, choisis un profil (quick scan à red team complet), et il enchaîne scan ports, découverte vulns, exploitation, post-exploitation, rapport.',
                        highlight: 'SQLi, XSS, SSRF, LFI, brute force, privesc, lateral movement, fuzzer intelligent avec détection WAF'
                    },
                    {
                        icon: '06',
                        title: 'DevSecOps',
                        desc: 'Scan SAST (code source), SCA (dépendances), secrets, containers, IaC. Export SARIF, quality gates.',
                        highlight: 'Générateurs CI pour GitHub Actions, GitLab CI, Jenkins'
                    }
                ],
                architecture: {
                    frontend: 'Next.js 15 / React 19 — 80+ pages',
                    backend: 'FastAPI (Python) — 750+ endpoints, 250+ fichiers',
                    database: 'PostgreSQL',
                    cache: 'Redis',
                    queue: 'Celery (tâches asynchrones)'
                },
                stats: [
                    { label: 'Endpoints API', value: '750+' },
                    { label: 'Modules Pentest', value: '76' },
                    { label: 'Pages Frontend', value: '80+' },
                    { label: 'Actions SOAR', value: '41' },
                    { label: 'Feeds Threat Intel', value: '8' },
                    { label: 'Étapes Pipeline', value: '13' }
                ]
            }
        },
        {
            id: '02',
            slug: 'chapitres',
            title: 'Chapitres',
            desc: 'Plateforme éducative gratuite pour lycéens : 504+ chapitres, quiz interactifs, annales du Bac.',
            tech: ['Next.js', 'React', 'Vercel', 'KaTeX', 'OAuth'],
            color: '#818cf8',
            link: 'https://meschapitres.fr',
            detail: {
                subtitle: 'Plateforme de révision gratuite pour le Baccalauréat',
                overview: `Chapitres est une plateforme éducative 100% gratuite destinée aux lycéens
                    qui préparent le Baccalauréat. Elle couvre l'intégralité du programme officiel
                    (Bulletin Officiel 2025-2026) de la Seconde à la Terminale, avec des fiches de
                    révision structurées, des quiz interactifs chronométrés et les annales du Bac.
                    Créé pour les lycéens, par les lycéens.`,
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
            slug: 'homelab-it',
            title: 'HomeLab IT',
            desc: 'Infrastructure IT de PME simulée : Active Directory, GLPI ticketing, automatisation PowerShell/Python, triage IA des tickets.',
            tech: ['Windows Server', 'Active Directory', 'GLPI', 'PowerShell', 'Python', 'pfSense'],
            color: '#f59e0b',
            wip: true,
            startedAt: 'Avril 2026',
            detail: {
                subtitle: 'Parc IT de PME simulé — de zéro à production',
                overview: `HomeLab IT est une infrastructure complète que je construis chez moi pour pratiquer le support IT en conditions réelles. Un contrôleur de domaine Windows Server, des postes clients Windows 10/11 joints au domaine, un serveur GLPI pour le ticketing et l'inventaire, un firewall pfSense pour segmenter le réseau — le tout orchestré par des scripts PowerShell et Python que j'écris pour automatiser les tâches répétitives. L'objectif : reproduire le quotidien d'un technicien support dans une PME de 50 postes, et intégrer l'IA (Claude API) pour le triage automatique des tickets.`,
                features: [
                    {
                        icon: '01',
                        title: 'Active Directory — Annuaire centralisé',
                        desc: 'Contrôleur de domaine Windows Server 2022, 50 utilisateurs simulés répartis en 8 unités d\'organisation (OUs). GPO de sécurité, verrouillage session, déploiement de logiciels, redirection de dossiers.',
                        highlight: 'Structure complète AD DS + DNS + DHCP'
                    },
                    {
                        icon: '02',
                        title: 'GLPI — Ticketing & Inventaire',
                        desc: 'Serveur GLPI 10 sur Debian 12 avec agent FusionInventory déployé sur tous les postes. Inventaire automatique du parc (matériel + logiciel), 20 tickets types traités et documentés.',
                        highlight: 'Inventaire auto + base de connaissances'
                    },
                    {
                        icon: '03',
                        title: 'Automatisation PowerShell',
                        desc: 'Scripts de création masse d\'utilisateurs AD depuis CSV, audit sécurité automatique, rapport quotidien d\'état du parc, reset de mots de passe, déploiement de GPO.',
                        highlight: '15 scripts réutilisables en production'
                    },
                    {
                        icon: '04',
                        title: 'IA pour le support',
                        desc: 'Intégration Claude API via Python : triage automatique des tickets GLPI par urgence et catégorie, génération de réponses types, création de procédures à partir des tickets résolus.',
                        highlight: 'Triage 80% plus rapide vs manuel'
                    },
                    {
                        icon: '05',
                        title: 'Réseau segmenté (pfSense)',
                        desc: 'Firewall pfSense CE avec 3 VLANs (serveurs, postes, invités), règles de filtrage, VPN OpenVPN pour accès distant, monitoring du trafic.',
                        highlight: '3 VLANs isolés + VPN configuré'
                    },
                    {
                        icon: '06',
                        title: 'Documentation technique',
                        desc: 'Procédures pas-à-pas (onboarding utilisateur, création poste, sauvegarde), runbooks incidents, schémas réseau draw.io, base de connaissances avec les 20 pannes récurrentes.',
                        highlight: 'Format pro, reproductible en entreprise'
                    }
                ],
                architecture: {
                    hyperviseur: 'VirtualBox / Proxmox',
                    domaine: 'lab.local — Windows Server 2022',
                    clients: 'Windows 10 & Windows 11 Pro',
                    ticketing: 'GLPI 10 + FusionInventory (Debian 12)',
                    firewall: 'pfSense CE',
                    scripts: 'PowerShell 7, Python 3.11, API Claude'
                },
                stats: [
                    { label: 'VMs actives', value: '12' },
                    { label: 'Users AD', value: '50' },
                    { label: 'Tickets résolus', value: '20' },
                    { label: 'Scripts auto', value: '15' },
                    { label: 'VLANs', value: '3' },
                    { label: 'GPO', value: '8' }
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
    (req, res) => {
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

        // TODO: intégrer Nodemailer pour envoi réel vers moussazedira@gmail.com
        console.log('[Contact]', new Date().toISOString(), '-', name, '<' + email + '>');
        console.log('Message:', message.slice(0, 200));

        res.json({ success: true, message: 'Message envoyé avec succès !' });
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

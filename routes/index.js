const express = require('express');
const router = express.Router();

// Portfolio data
const portfolio = {
    name: 'Zedira Moussa',
    title: 'Technicien Support Informatique',
    subtitle: 'Support IT • Réseaux • Python & SQL • IA Générative',
    seeking: 'Recherche stage Support IT / Helpdesk en Île-de-France',
    about: `Étudiant en formation Technicien d'Assistance Informatique (TIP) à Doranco,
            je recherche un stage en support IT / helpdesk pour mettre en pratique mes
            compétences : assistance utilisateurs, dépannage, configuration réseau,
            gestion de tickets (GLPI) et automatisation. Certifié Cisco Networking
            Academy, je suis aussi à l'aise avec Python, SQL et les outils d'IA.`,
    tags: ['Support IT', 'Cybersécurité', 'Python', 'SQL', 'IA', 'Réseaux'],
    location: 'Argenteuil, Île-de-France',
    stats: {
        experience: 2,
        projects: 5
    },
    formation: [
        {
            year: '2026',
            title: 'Technicien d\'Assistance Informatique (TIP)',
            school: 'Doranco, Bagnolet'
        },
        {
            year: '2025',
            title: 'Niveau Baccalauréat Général',
            detail: 'Mathématiques, NSI, Sciences de l\'ingénieur',
            school: 'Argenteuil'
        },
        {
            year: '2023',
            title: 'CQPPGSE - Certificat de Qualification Professionnelle',
            school: 'Courbevoie'
        }
    ],
    certifications: [
        'Cisco Networking Academy - Cybersecurity, Networking Essentials',
        'Python Essentials, Linux Unhatched',
        'IA Générative Anthropic (Claude) - Prompt Engineering'
    ],
    skills: [
        { name: 'Support IT & Dépannage', level: 85 },
        { name: 'Réseaux (TCP/IP, Cisco)', level: 75 },
        { name: 'Python & SQL', level: 80 },
        { name: 'Cybersécurité', level: 70 },
        { name: 'IA & Automatisation', level: 75 },
        { name: 'Systèmes (Windows, Linux)', level: 80 }
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
            title: 'Gérant / Indépendant',
            company: 'Prestations de services'
        },
        {
            period: '2025',
            title: 'Formation interne',
            company: 'Amazon (Delivery Service Partner)'
        },
        {
            period: '2021',
            title: 'Stage',
            company: 'Cabinet d\'avocat, Nanterre'
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
    ],
    languages: ['Français (natif)', 'Anglais (intermédiaire)', 'Arabe (bilingue)', 'Espagnol (conversationnel)'],
    socials: {
        github: 'https://github.com/moussa-zedira',
        linkedin: 'https://www.linkedin.com/in/moussa-zedira-15abba3b8',
        email: 'moussazedira@gmail.com',
        phone: '06 27 80 74 30'
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

// Contact form handler
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('New message from:', name, email);
    console.log('Message:', message);
    res.json({ success: true, message: 'Message envoyé avec succès !' });
});

// API: Get portfolio data
router.get('/api/portfolio', (req, res) => {
    res.json(portfolio);
});

module.exports = router;

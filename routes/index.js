const express = require('express');
const router = express.Router();

// Portfolio data
const portfolio = {
    name: 'Zedira Moussa',
    title: 'Technicien Support Informatique',
    subtitle: 'Support IT • Reseaux • Python & SQL • IA Generative',
    seeking: 'Recherche stage Support IT / Helpdesk en Ile-de-France',
    about: `Etudiant en formation Technicien d'Assistance Informatique (TIP) a Doranco,
            je recherche un stage en support IT / helpdesk pour mettre en pratique mes
            competences : assistance utilisateurs, depannage, configuration reseau,
            gestion de tickets (GLPI) et automatisation. Certifie Cisco Networking
            Academy, je suis aussi a l'aise avec Python, SQL et les outils d'IA.`,
    tags: ['Support IT', 'Cybersecurite', 'Python', 'SQL', 'IA', 'Reseaux'],
    location: 'Argenteuil, Ile-de-France',
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
            title: 'Niveau Baccalaureat General',
            detail: 'Mathematiques, NSI, Sciences de l\'ingenieur',
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
        'IA Generative Anthropic (Claude) - Prompt Engineering'
    ],
    skills: [
        { name: 'Support IT & Depannage', level: 85 },
        { name: 'Reseaux (TCP/IP, Cisco)', level: 75 },
        { name: 'Python & SQL', level: 80 },
        { name: 'Cybersecurite', level: 70 },
        { name: 'IA & Automatisation', level: 75 },
        { name: 'Systemes (Windows, Linux)', level: 80 }
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
            title: 'Gerant / Independant',
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
            desc: 'Plateforme de cybersecurite tout-en-un : SIEM, detection, reponse automatisee, threat intel et pentest.',
            tech: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Redis', 'Celery'],
            color: '#ef4444',
            detail: {
                subtitle: 'Plateforme de cybersecurite tout-en-un',
                overview: `Au lieu d'avoir 5-6 outils differents (un SIEM pour surveiller, un scanner pour tester,
                    un outil pour repondre aux incidents...), CyberDef reunit tout dans une seule application web.
                    C'est comme fusionner Splunk + Burp Suite + Metasploit + TheHive + OpenCTI dans un seul dashboard.`,
                features: [
                    {
                        icon: '01',
                        title: 'SIEM — Surveillance',
                        desc: 'Reception et analyse automatique de logs de securite (firewall, serveurs, endpoints). Pipeline de 13 etapes : parsing, enrichissement (geolocalisation IP, reputation, assets), scoring de menace, detection de regles, correlation.',
                        highlight: 'Langage de recherche CQL integre, similaire a Splunk SPL'
                    },
                    {
                        icon: '02',
                        title: 'Detection Engine',
                        desc: 'Regles SIGMA (standard ouvert), correlation multi-etapes pour detecter les attaques complexes (ex: brute force + login success + lateral movement = compromission).',
                        highlight: 'Scoring 0-100 base sur la Threat Intel, la severite et la criticite'
                    },
                    {
                        icon: '03',
                        title: 'SOAR — Reponse automatisee',
                        desc: 'Quand une menace est detectee, des playbooks automatiques se declenchent : bloquer une IP, isoler une machine, creer un ticket, notifier l\'equipe.',
                        highlight: '15 playbooks pre-configures, 41 actions disponibles'
                    },
                    {
                        icon: '04',
                        title: 'Threat Intelligence',
                        desc: 'Base de donnees d\'indicateurs malveillants (IPs, domaines, hash). 8 feeds automatiques : abuse.ch, EmergingThreats, PhishTank, OTX...',
                        highlight: 'Compatibilite STIX/TAXII avec serveur integre'
                    },
                    {
                        icon: '05',
                        title: 'Pentest Lab — 76 modules',
                        desc: 'Orchestrateur automatique : tu entres une cible, choisis un profil (quick scan a red team complet), et il enchaine scan ports, decouverte vulns, exploitation, post-exploitation, rapport.',
                        highlight: 'SQLi, XSS, SSRF, LFI, brute force, privesc, lateral movement, fuzzer intelligent avec detection WAF'
                    },
                    {
                        icon: '06',
                        title: 'DevSecOps',
                        desc: 'Scan SAST (code source), SCA (dependances), secrets, containers, IaC. Export SARIF, quality gates.',
                        highlight: 'Generateurs CI pour GitHub Actions, GitLab CI, Jenkins'
                    }
                ],
                architecture: {
                    frontend: 'Next.js 15 / React 19 — 80+ pages',
                    backend: 'FastAPI (Python) — 750+ endpoints, 250+ fichiers',
                    database: 'PostgreSQL',
                    cache: 'Redis',
                    queue: 'Celery (taches asynchrones)'
                },
                stats: [
                    { label: 'Endpoints API', value: '750+' },
                    { label: 'Modules Pentest', value: '76' },
                    { label: 'Pages Frontend', value: '80+' },
                    { label: 'Actions SOAR', value: '41' },
                    { label: 'Feeds Threat Intel', value: '8' },
                    { label: 'Etapes Pipeline', value: '13' }
                ]
            }
        },
        {
            id: '02',
            slug: 'chapitres',
            title: 'Chapitres',
            desc: 'Application web de revision. Gestion de contenu et interface utilisateur.',
            tech: ['Python', 'SQL', 'Web'],
            color: '#818cf8',
            detail: null
        },
        {
            id: '03',
            slug: 'jeu-echecs',
            title: 'Jeu d\'echecs',
            desc: 'Application de logique algorithmique. Regles du jeu et logique decisionnelle.',
            tech: ['Python', 'Algorithmes'],
            color: '#34d399',
            detail: null
        }
    ],
    languages: ['Francais (natif)', 'Anglais (intermediaire)', 'Arabe (bilingue)', 'Espagnol (conversationnel)'],
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
    res.json({ success: true, message: 'Message envoye avec succes !' });
});

// API: Get portfolio data
router.get('/api/portfolio', (req, res) => {
    res.json(portfolio);
});

module.exports = router;

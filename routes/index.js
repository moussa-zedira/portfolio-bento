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
            title: 'Analyse SOC',
            desc: 'Interface web d\'analyse reseau. Analyse de logs et detection d\'anomalies.',
            tech: ['Python', 'SQL', 'Securite']
        },
        {
            id: '02',
            title: 'Chapitres',
            desc: 'Application web de revision. Gestion de contenu et interface utilisateur.',
            tech: ['Python', 'SQL', 'Web']
        },
        {
            id: '03',
            title: 'Jeu d\'echecs',
            desc: 'Application de logique algorithmique. Regles du jeu et logique decisionnelle.',
            tech: ['Python', 'Algorithmes']
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

// Contact form handler
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('New message from:', name, email);
    console.log('Message:', message);
    // TODO: Add email sending (nodemailer) or database storage
    res.json({ success: true, message: 'Message envoye avec succes !' });
});

// API: Get portfolio data
router.get('/api/portfolio', (req, res) => {
    res.json(portfolio);
});

module.exports = router;

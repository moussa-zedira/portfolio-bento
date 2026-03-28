const express = require('express');
const router = express.Router();

// Portfolio data
const portfolio = {
    name: 'Zedira Moussa',
    title: 'Technicien Informatique de Proximite',
    subtitle: 'Dev Web • Intelligence Artificielle • Support IT',
    about: `Technicien informatique de proximite passionne par le developpement web
            et l'intelligence artificielle. Je combine expertise technique terrain
            et creativite numerique pour creer des solutions innovantes.`,
    tags: ['Support IT', 'Dev Web', 'IA', 'Reseau'],
    stats: {
        experience: 3,
        projects: 20
    },
    skills: [
        { name: 'Dev Frontend', level: 90 },
        { name: 'Dev Backend', level: 75 },
        { name: 'Intelligence Artificielle', level: 80 },
        { name: 'Support & Reseau', level: 85 }
    ],
    stack: [
        { name: 'HTML5', icon: 'html5' },
        { name: 'CSS3', icon: 'css3' },
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'Python', icon: 'python' },
        { name: 'React', icon: 'react' },
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'IA / ChatGPT', icon: 'ai' },
        { name: 'Git', icon: 'git' }
    ],
    projects: [
        {
            id: '01',
            title: 'Site E-commerce',
            desc: 'Boutique en ligne responsive avec panier et paiement integre.',
            tech: ['HTML/CSS', 'JavaScript', 'Node.js']
        },
        {
            id: '02',
            title: 'Chatbot IA',
            desc: 'Assistant intelligent utilisant le traitement du langage naturel.',
            tech: ['Python', 'OpenAI', 'Flask']
        },
        {
            id: '03',
            title: 'Dashboard IT',
            desc: 'Tableau de bord pour monitoring reseau et gestion des tickets.',
            tech: ['React', 'API REST', 'Chart.js']
        }
    ],
    socials: {
        github: '#',
        linkedin: '#',
        email: 'contact@zediramoussa.dev'
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

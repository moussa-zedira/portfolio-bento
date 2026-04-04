const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (Vercel, Railway, etc. set X-Forwarded-For)
app.set('trust proxy', 1);

// ============================================
// SECURITY HEADERS (Helmet)
// ============================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // nécessaire pour les scripts inline (loader, etc.)
                'https://cdn.jsdelivr.net',
                'https://unpkg.com'
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // nécessaire pour les styles inline
                'https://fonts.googleapis.com'
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false, // autorise les fonts Google
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// ============================================
// RATE LIMIT GLOBAL (anti-DoS basique)
// ============================================
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requêtes par IP / 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de requêtes. Réessayez plus tard.' }
});
app.use(globalLimiter);

// ============================================
// VIEW ENGINE
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// STATIC FILES
// ============================================
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d' // cache statique 7 jours
}));

// ============================================
// BODY PARSERS (avec limite de taille)
// ============================================
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

// ============================================
// ROUTES
// ============================================
app.use('/', routes);

// ============================================
// ERROR HANDLER GLOBAL — aucune fuite de stack trace en prod
// ============================================
app.use((err, req, res, next) => {
    // Log complet côté serveur (pour debug)
    console.error('[Error]', new Date().toISOString(), err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Statut HTTP : celui de l'erreur ou 500 par défaut
    const status = err.status || err.statusCode || 500;

    // Message générique côté client (pas de stack)
    const isJsonRequest = req.headers.accept?.includes('json') || req.path.startsWith('/api') || req.path === '/contact';
    if (isJsonRequest) {
        return res.status(status).json({
            success: false,
            message: status === 400 ? 'Requête invalide' :
                     status === 413 ? 'Payload trop volumineux' :
                     status === 429 ? 'Trop de requêtes' :
                     'Erreur serveur'
        });
    }

    // Sinon page d'erreur HTML
    res.status(status).render('404', {
        portfolio: { name: 'Moussa Zedira', title: 'Technicien Support IT', socials: {} }
    });
});

// ============================================
// LISTEN (seulement en local, pas sur Vercel)
// ============================================
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Portfolio running at http://localhost:${PORT}`);
    });
}

module.exports = app;

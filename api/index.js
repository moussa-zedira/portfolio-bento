/**
 * Point d'entree serverless pour Vercel.
 *
 * Vercel invoque ce fichier comme une fonction : il reexporte simplement
 * l'app Express, qui ne demarre pas de serveur HTTP quand `process.env.VERCEL`
 * est defini (voir la fin de server.js).
 */
module.exports = require('../server.js');

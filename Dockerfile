# Image de production du portfolio (Express + EJS, rendu serveur).
# Build : docker build -t portfolio .
# Run   : docker run -p 3000:3000 --env-file .env portfolio
FROM node:20-alpine

# Desactive l'installation des devDependencies et active le mode prod d'Express
ENV NODE_ENV=production

WORKDIR /app

# Etape dependances isolee : tant que package*.json ne change pas,
# Docker reutilise le cache de cette couche.
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

# Le process ne tourne pas en root (l'utilisateur "node" existe dans l'image officielle)
USER node

EXPOSE 3000

CMD ["node", "server.js"]

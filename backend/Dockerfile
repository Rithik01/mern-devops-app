# Backend image: Express API.
# Small official Node image (alpine = tiny Linux).
FROM node:22-alpine

# NODE_ENV=production makes Express and many libraries run in optimized mode.
ENV NODE_ENV=production

WORKDIR /app

# Copy ONLY the dependency files first. Docker caches each step ("layer"),
# so as long as package*.json doesn't change, "npm ci" is not re-run
# when you edit your source code. This makes rebuilds much faster.
COPY package.json package-lock.json ./

# "npm ci" = clean, reproducible install from package-lock.json.
# --omit=dev skips dev tools (eslint, prettier, nodemon) in the image.
RUN npm ci --omit=dev

# Now copy the application source code.
COPY src ./src

# Don't run as root: the official node image ships with a "node" user.
USER node

# Documentation only: the app listens on this port (see PORT env var).
EXPOSE 5000

# Used by Docker (and later AWS) to know whether the container is healthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-5000}/api/health" || exit 1

CMD ["node", "src/server.js"]

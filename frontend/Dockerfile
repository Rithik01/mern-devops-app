# Frontend image, built in two stages.
#
# Why two stages? A React app is just static files (HTML/JS/CSS) once built.
# We need Node only to BUILD them, but not to SERVE them. So:
#   Stage 1 (build): Node + npm -> produces the /app/dist folder
#   Stage 2 (serve): tiny nginx image that only contains the built files
# The final image stays small and has no source code or dev tools.

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# IMPORTANT: Vite reads VITE_* variables at BUILD time and writes them into
# the JavaScript files. The browser can't read container env vars at runtime.
# So the API URL is passed in as a build argument (see docker-compose.yml).
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Stage 2: serve ----------
# "nginx-unprivileged" runs as a non-root user and listens on port 8080.
FROM nginxinc/nginx-unprivileged:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

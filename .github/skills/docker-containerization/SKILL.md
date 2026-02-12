# Docker Containerization

Best-Practices für Docker-Container, Dockerfiles, Docker-Compose und Container-Orchestrierung für Web-Entwicklung.

## Verwendung

Docker nutzen für:
- **Konsistente Entwicklungsumgebungen** (gleiche Node/DB-Versionen im Team)
- **Lokale Microservices** (Frontend + Backend + DB gleichzeitig)
- **CI/CD Pipelines** (Tests in isolierten Containern)
- **Production Deployments** (Container-Orchestrierung mit Kubernetes/ECS)

---

## 1. Dockerfile Best-Practices

### Basic Dockerfile für Node.js/Vite-App

```dockerfile
# Multi-Stage Build für kleinere Images
FROM node:18-alpine AS builder

# Metadata
LABEL maintainer="team@example.com"
LABEL description="Production build for web app"

# Working Directory setzen
WORKDIR /app

# Package-Files zuerst (für besseres Caching)
COPY package.json pnpm-lock.yaml ./

# Dependencies installieren (cached wenn sich package.json nicht ändert)
RUN npm install -g pnpm@8 && \
    pnpm install --frozen-lockfile

# Source-Code kopieren
COPY . .

# Build ausführen
RUN pnpm build

# -----------------------------------------------------------
# Production Stage - Nur was wir brauchen
FROM nginx:alpine

# Build-Artifacts von Builder-Stage kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx Config (für SPA-Routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Non-root User verwenden (Security!)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

USER nginx

# Port exposieren
EXPOSE 80

# Health-Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Command
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile für Node.js Backend

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Source
COPY . .

# Build TypeScript
RUN npm run build

# -----------------------------------------------------------
# Production
FROM node:18-alpine

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only needed files
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node healthcheck.js || exit 1

CMD ["node", "dist/server.js"]
```

---

## 2. .dockerignore (Performance!)

```dockerignore
# Dependencies
node_modules
npm-debug.log
pnpm-lock.yaml
yarn.lock

# Build-Outputs
dist
build
.next
.vite
.turbo

# Development
.git
.gitignore
.env*.local
.vscode
.idea

# Testing
coverage
.nyc_output
*.test.ts
*.spec.ts
__tests__
__mocks__

# Documentation
README.md
docs
*.md

# CI/CD
.github
.gitlab-ci.yml
.circleci

# Logs
logs
*.log

# OS
.DS_Store
Thumbs.db
```

**Warum wichtig?** Reduziert Build-Context-Größe drastisch (von 500MB auf 50MB)!

---

## 3. Docker-Compose für Development

### Frontend + Backend + Database

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: dev-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: devuser
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: devdb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devuser -d devdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: dev-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://devuser:devpass@db:5432/devdb
      JWT_SECRET: dev-secret-change-in-production
      REDIS_URL: redis://redis:6379
    volumes:
      - ./backend:/app
      - /app/node_modules  # Named volume prevents overwriting
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: dev-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: dev-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"  # Vite default
    environment:
      VITE_API_URL: http://localhost:3000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    command: npm run dev -- --host

  # Nginx Reverse Proxy (optional)
  nginx:
    image: nginx:alpine
    container_name: dev-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend

volumes:
  postgres-data:
  redis-data:

networks:
  default:
    name: dev-network
```

### Quick Start Commands

```bash
# Alles starten
docker-compose up -d

# Logs verfolgen
docker-compose logs -f backend

# Bestimmten Service neu bauen
docker-compose up -d --build frontend

# In Container reingehen
docker-compose exec backend sh

# Alles stoppen & entfernen
docker-compose down

# Mit Volumes entfernen (Fresh Start)
docker-compose down -v
```

---

## 4. Development vs Production Dockerfiles

### Dockerfile.dev (für docker-compose)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source (wird durch volume überschrieben in compose)
COPY . .

EXPOSE 3000

# Hot-Reload Development Server
CMD ["npm", "run", "dev"]
```

### Dockerfile (für Production)

```dockerfile
# Siehe oben: Multi-Stage Build mit Optimization
```

---

## 5. nginx.conf für SPA-Routing

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache-Control für Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA-Routing: Alle Requests zu index.html (außer statische Files)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API-Proxy (falls Backend auf selber Server)
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health-Check Endpoint
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }

    # Deny .env, .git, etc.
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 6. Docker-Optimization-Tipps

### ✅ Layer-Caching nutzen

```dockerfile
# ❌ Bad: Bei jeder Source-Änderung werden Dependencies neu installiert
COPY . .
RUN npm install

# ✅ Good: Dependencies nur neu installieren wenn package.json ändert
COPY package*.json ./
RUN npm install
COPY . .
```

### ✅ Multi-Stage Builds

```dockerfile
# ✅ Reduziert Image-Size von ~1GB auf ~50MB
FROM node:18 AS builder  # 900MB
# ... build ...

FROM nginx:alpine  # 40MB
COPY --from=builder /app/dist /usr/share/nginx/html
```

### ✅ Alpine Images verwenden

```dockerfile
# ❌ node:18 = 900MB
FROM node:18

# ✅ node:18-alpine = 170MB
FROM node:18-alpine
```

### ✅ Dependencies cleanup

```dockerfile
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*
```

### ✅ .dockerignore pflegen

Siehe oben - reduziert Build-Context drastisch!

---

## 7. Security Best-Practices

### ✅ Non-Root User

```dockerfile
# User erstellen
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

# Zu User wechseln
USER appuser
```

### ✅ Keine Secrets im Image

```dockerfile
# ❌ NIEMALS!
ENV JWT_SECRET=my-secret-key

# ✅ Zur Laufzeit injizieren
# docker run -e JWT_SECRET=xyz ...
# Oder docker-compose environment
```

### ✅ Image-Scanning

```bash
# Mit Docker Scout
docker scout cves myapp:latest

# Mit Trivy
trivy image myapp:latest

# Mit Snyk
snyk container test myapp:latest
```

### ✅ Minimal Base-Images

```dockerfile
# ✅ Distroless für Production (ultra-minimal, nur Runtime)
FROM gcr.io/distroless/nodejs18-debian11

# Oder Alpine
FROM node:18-alpine
```

---

## 8. Docker-Compose Production

```yaml
version: '3.9'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password  # Secrets!
    secrets:
      - db_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G

  backend:
    image: myapp-backend:latest
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
      - jwt_secret
    depends_on:
      - db
    deploy:
      replicas: 3  # 3 Instances für Load-Balancing
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  frontend:
    image: myapp-frontend:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend

secrets:
  db_password:
    file: ./secrets/db_password.txt
  database_url:
    file: ./secrets/database_url.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

volumes:
  postgres-data:
```

---

## 9. Debugging in Containern

### Logs anschauen

```bash
# Alle Logs
docker-compose logs

# Nur Service
docker-compose logs backend

# Follow Mode
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### In Container reingehen

```bash
# Interactive Shell
docker-compose exec backend sh

# Oder bash wenn verfügbar
docker-compose exec backend bash

# Als root (für Troubleshooting)
docker-compose exec -u root backend sh
```

### Port-Forwarding testen

```bash
# Von außen testen
curl http://localhost:3000/health

# Von anderem Container aus
docker-compose exec frontend wget -O- http://backend:3000/health
```

### Network inspizieren

```bash
# Container-IPs sehen
docker network inspect dev-network

# DNS-Resolution testen
docker-compose exec backend ping db
```

---

## 10. CI/CD mit Docker

### GitHub Actions Example

```yaml
name: Build & Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myorg/myapp:latest,myorg/myapp:${{ github.sha }}
          cache-from: type=registry,ref=myorg/myapp:buildcache
          cache-to: type=registry,ref=myorg/myapp:buildcache,mode=max
```

---

## 11. Health-Checks

### Dockerfile Health-Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
```

### healthcheck.js

```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();
```

---

## 12. Docker Commands Cheat-Sheet

```bash
# Images
docker images                           # Liste aller Images
docker build -t myapp:latest .         # Build Image
docker rmi myapp:latest                # Remove Image
docker image prune -a                  # Alle ungenutzten Images löschen

# Container
docker ps                              # Laufende Container
docker ps -a                           # Alle Container
docker stop <container-id>             # Container stoppen
docker rm <container-id>               # Container löschen
docker logs -f <container-id>          # Logs folgen
docker exec -it <container-id> sh      # In Container reingehen

# System-Cleanup
docker system prune                    # Alles Ungenutzte löschen
docker system prune -a --volumes       # ALLES löschen (Vorsicht!)

# Compose
docker-compose up -d                   # Starten (detached)
docker-compose down                    # Stoppen & entfernen
docker-compose down -v                 # Mit Volumes
docker-compose logs -f                 # Logs
docker-compose ps                      # Status
docker-compose restart backend         # Service neu starten
docker-compose exec backend sh         # In Container

# Network
docker network ls                      # Alle Networks
docker network inspect <network>       # Details

# Volumes
docker volume ls                       # Alle Volumes
docker volume rm <volume>              # Volume löschen
docker volume prune                    # Ungenutzte Volumes löschen
```

---

## 13. Production Checklist

- [ ] Multi-Stage Builds verwenden
- [ ] Alpine/Distroless Base-Images
- [ ] Non-Root User
- [ ] .dockerignore vollständig
- [ ] Health-Checks implementiert
- [ ] Secrets via Environment-Variables, nicht im Image
- [ ] Resource-Limits gesetzt (CPU, Memory)
- [ ] Image-Security-Scanning (Trivy, Snyk)
- [ ] Logging zu stdout/stderr (nicht in Files)
- [ ] Graceful-Shutdown implementiert
- [ ] Restart-Policy: `always` oder `unless-stopped`
- [ ] Monitoring & Alerting eingerichtet

---

**Remember**: Docker ist für **Konsistenz** und **Isolation**. Nutze es smart, aber nicht over-engineer! 🐳

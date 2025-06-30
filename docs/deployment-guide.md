# Deployment Guide

## Prerequisites

### System Requirements
- **Docker**: 20.10.0 or higher
- **Docker Compose**: 2.0.0 or higher
- **Node.js**: 18.0.0 or higher (for local development)
- **Git**: 2.30.0 or higher

### Environment Setup
- Linux, macOS, or Windows with WSL2
- Minimum 4GB RAM
- 10GB available disk space

## Local Development Deployment

### 1. Clone Repository
```bash
git clone https://github.com/karthik-rameshkumar/GitHub-value-model.git
cd GitHub-value-model
```

### 2. Environment Configuration
Copy environment templates and configure:

```bash
# Backend environment
cp .env.backend.example backend/.env
# Edit backend/.env with your configuration

# Frontend environment
cp .env.frontend.example frontend/.env
# Edit frontend/.env with your configuration
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Verify Deployment
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

### 5. Stop Services
```bash
docker-compose down
```

## Production Deployment

### Container Registry Setup

#### 1. Build Production Images
```bash
# Build backend image
docker build -f backend/Dockerfile -t essp-backend:latest ./backend

# Build frontend image
docker build -f frontend/Dockerfile -t essp-frontend:latest ./frontend
```

#### 2. Tag and Push Images
```bash
# Tag images
docker tag essp-backend:latest your-registry/essp-backend:latest
docker tag essp-frontend:latest your-registry/essp-frontend:latest

# Push to registry
docker push your-registry/essp-backend:latest
docker push your-registry/essp-frontend:latest
```

### Kubernetes Deployment

#### 1. Create Namespace
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: essp-dashboard
```

#### 2. Database Setup
```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: essp-dashboard
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14-alpine
        env:
        - name: POSTGRES_DB
          value: "essp_dashboard"
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

#### 3. Backend Deployment
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: essp-backend
  namespace: essp-dashboard
spec:
  replicas: 3
  selector:
    matchLabels:
      app: essp-backend
  template:
    metadata:
      labels:
        app: essp-backend
    spec:
      containers:
      - name: backend
        image: your-registry/essp-backend:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-url
        ports:
        - containerPort: 3001
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### 4. Frontend Deployment
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: essp-frontend
  namespace: essp-dashboard
spec:
  replicas: 2
  selector:
    matchLabels:
      app: essp-frontend
  template:
    metadata:
      labels:
        app: essp-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/essp-frontend:latest
        env:
        - name: REACT_APP_API_URL
          value: "https://api.yourdomain.com"
        ports:
        - containerPort: 3000
```

### Cloud Platform Deployment

#### AWS ECS
1. Create ECS cluster
2. Define task definitions
3. Create services with load balancers
4. Configure auto-scaling

#### Google Cloud Run
```bash
# Deploy backend
gcloud run deploy essp-backend \
  --image your-registry/essp-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend
gcloud run deploy essp-frontend \
  --image your-registry/essp-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances
```bash
# Create resource group
az group create --name essp-dashboard --location eastus

# Deploy backend
az container create \
  --resource-group essp-dashboard \
  --name essp-backend \
  --image your-registry/essp-backend:latest \
  --ports 3001 \
  --environment-variables DATABASE_URL=your-db-url
```

## Environment Configuration

### Required Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=essp_dashboard
DATABASE_USER=essp_user
DATABASE_PASSWORD=secure_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Security
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum
SESSION_SECRET=your-super-secure-session-secret

# GitHub Integration
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# CORS
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com

# Application
REACT_APP_NAME=ESSP Dashboard
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production

# GitHub OAuth
REACT_APP_GITHUB_CLIENT_ID=your-github-oauth-client-id

# Analytics (optional)
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Database Migration

### Initial Setup
```bash
# Run migrations
cd backend
npm run db:migrate

# Seed initial data
npm run db:seed
```

### Backup and Restore
```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Monitoring and Logging

### Health Checks
- Application: `/health`
- Database: `/health/db`
- Redis: `/health/redis`
- Comprehensive: `/health/all`

### Log Aggregation
Configure log forwarding to:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- CloudWatch Logs
- Google Cloud Logging

### Monitoring Setup
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'essp-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
```

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database connectivity
docker-compose exec postgres pg_isready

# Check database logs
docker-compose logs postgres
```

#### Redis Connection Errors
```bash
# Check Redis connectivity
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis
```

#### Application Errors
```bash
# Check application logs
docker-compose logs backend
docker-compose logs frontend

# Check health endpoints
curl http://localhost:3001/health/all
```

### Performance Optimization

#### Backend
- Enable gzip compression
- Configure connection pooling
- Implement caching strategies
- Optimize database queries

#### Frontend
- Enable code splitting
- Implement lazy loading
- Configure CDN for static assets
- Optimize bundle size

## Security Considerations

### Production Checklist
- [ ] Use HTTPS everywhere
- [ ] Configure proper CORS settings
- [ ] Enable rate limiting
- [ ] Set secure JWT secrets
- [ ] Configure database access controls
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Implement backup strategies

### Security Headers
```javascript
// helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```
# Deployment Guide - InventoryPOS

This guide covers deploying InventoryPOS to production environments.

## Prerequisites
- Docker & Docker Compose (recommended)
- Cloud account (Heroku, Railway, Vercel, Netlify, AWS, etc.)
- MongoDB Atlas account (for managed database)
- Custom domain (optional)

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Local Docker Setup

1. **Install Docker**
   - Download from https://www.docker.com/products/docker-desktop
   - Ensure Docker is running

2. **Build and Run**
   ```bash
   docker-compose up --build
   ```

3. **Access Application**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000
   - MongoDB: localhost:27017

4. **Stop Services**
   ```bash
   docker-compose down
   ```

#### Deploy to Docker Hub

1. **Build Images**
   ```bash
   # Backend
   cd backend
   docker build -t yourusername/inventory-pos-backend .
   docker push yourusername/inventory-pos-backend

   # Frontend
   cd ../frontend
   docker build -t yourusername/inventory-pos-frontend .
   docker push yourusername/inventory-pos-frontend
   ```

2. **Update docker-compose.yml**
   ```yaml
   image: yourusername/inventory-pos-backend
   image: yourusername/inventory-pos-frontend
   ```

---

### Option 2: Heroku Deployment

#### Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

3. **Add MongoDB Atlas**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/inventory-pos
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

#### Deploy Frontend to Vercel

1. **Copy frontend to separate repo**
2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import project from GitHub
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.herokuapp.com/api
     ```
3. **Deploy automatically on push**

---

### Option 3: Railway Deployment

#### Deploy Full Stack

1. **Sign up at https://railway.app**

2. **Connect GitHub Repository**

3. **Create Services**
   - Backend (Node.js)
   - Database (MongoDB)
   - Frontend (Static)

4. **Add Environment Variables**
   ```
   MONGODB_URI=railway_provided_uri
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```

5. **Deploy and Get URLs**

---

### Option 4: AWS Deployment

#### Backend on EC2

1. **Create EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.micro or t2.small
   - Security Group: Allow ports 80, 443, 5000

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm mongodb
   ```

3. **Clone and Deploy**
   ```bash
   git clone your-repo.git
   cd inventory-app/backend
   npm install
   npm start
   ```

#### Frontend on S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Configure CloudFront** with S3 origin

---

### Option 5: DigitalOcean App Platform

1. **Create Account**
   - Sign up at https://www.digitalocean.com

2. **Create App from Repository**
   - Connect GitHub
   - Auto-detected buildpacks

3. **Configure Services**
   - Backend component
   - Frontend component
   - Managed MongoDB

4. **Set Environment Variables**

5. **Deploy**

---

## Production Configuration

### Environment Variables

**Backend (.env)**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/inventory-pos
JWT_SECRET=long_random_secret_key_min_32_characters
JWT_EXPIRE=7d
```

**Frontend (.env)**
```
VITE_API_URL=https://api.yourdomain.com/api
```

### Security Checklist

- [ ] Change JWT_SECRET to long random string
- [ ] Use HTTPS/SSL certificates
- [ ] Set CORS_ORIGIN properly
- [ ] Use strong MongoDB passwords
- [ ] Enable MongoDB IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Setup backup system

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to https://www.mongodb.com/atlas
   - Create free cluster

2. **Create Database User**
   - Set username and password
   - Note connection string

3. **Whitelist IPs**
   - Add your server IPs

4. **Connection String Format**
   ```
   mongodb+srv://user:password@cluster.mongodb.net/inventory-pos?retryWrites=true&w=majority
   ```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and Push
        uses: docker/build-push-action@v2
        with:
          context: ./backend
          push: true
          tags: yourusername/inventory-pos-backend:latest
      
      - name: Deploy to Server
        run: |
          ssh user@server "docker pull && docker-compose up -d"
```

---

## Monitoring & Logging

### Setup Logging

**Backend - Winston Logger**
```bash
npm install winston
```

### Monitor Performance

- Setup New Relic / DataDog
- Monitor API response times
- Alert on errors
- Track database performance

### Backup Strategy

- Daily MongoDB backup to cloud storage
- Transaction logs backup
- Test restore procedures

---

## Domain & SSL

### Map Custom Domain

1. **Get Domain**
   - GoDaddy, Namecheap, etc.

2. **Point to Server**
   - Update DNS A records
   - Or use CNAME for CDN

3. **Setup SSL Certificate**
   - Use Let's Encrypt (free)
   - Or buy from provider

### Nginx Reverse Proxy Config

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api {
        proxy_pass http://localhost:5000;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## Performance Optimization

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Optimize images
- Cache static assets

### Backend
- Use MongoDB indexes
- Implement caching (Redis)
- Compression middleware
- Connection pooling

### Database
- Create indexes on frequently queried fields
- Archive old transactions
- Setup replication

---

## Troubleshooting Deployment

### Backend Not Connecting to Database
```bash
# Check MongoDB connection
echo "db.adminCommand('ping')" | mongosh mongodb+srv://...
```

### Frontend API Calls Failing
- Check CORS settings
- Verify API URL
- Check firewall rules

### High Latency
- Check server resources
- Optimize database queries
- Add caching layer

---

## Rollback Procedure

```bash
# Keep previous version
git tag v1.0.0
git push origin v1.0.0

# Rollback if needed
git reset --hard v1.0.0
docker-compose up --build
```

---

## Maintenance Schedule

- Weekly: Check error logs
- Monthly: Database optimization
- Quarterly: Security updates
- Annually: Backup verification

---

## Support & Resources

- Docker: https://docs.docker.com
- Heroku: https://devcenter.heroku.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Let's Encrypt: https://letsencrypt.org
- AWS: https://docs.aws.amazon.com

---

For application architecture, see README.md

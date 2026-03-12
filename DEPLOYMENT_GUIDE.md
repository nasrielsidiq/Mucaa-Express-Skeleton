# 🚀 VPS Deployment Guide - SESPIMA Backend

This guide provides complete instructions for deploying the SESPIMA backend API to a production VPS.

---

## 📋 Prerequisites

- **VPS/Server**: Ubuntu 20.04+ or similar Linux distribution
- **Node.js**: v20.x or higher (verify with `node --version`)
- **MySQL**: v5.7+ installed and running
- **PM2**: Global process manager for Node.js applications
- **Git**: Installed on the server

---

## 🔧 1. Server Setup

### 1.1 Install Node.js & NPM

```bash
# Using NodeSource repository (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.2 Install PM2 Globally

```bash
sudo npm install -g pm2
sudo pm2 startup
```

### 1.3 Create Application Directory

```bash
sudo mkdir -p /var/www/sespima-api
sudo chown $USER:$USER /var/www/sespima-api
cd /var/www/sespima-api
```

---

## 📦 2. Application Setup

### 2.1 Clone Repository

```bash
# If using git
git clone <your-repo-url> .

# Or manually upload files using SCP/SFTP
scp -r ./sespima_backend user@your-vps-ip:/var/www/sespima-api/
```

### 2.2 Install Dependencies

```bash
cd /var/www/sespima-api
nvm use 20  # If using nvm (check .nvmrc for version)
npm install --production
```

### 2.3 Configure Environment Variables

```bash
# Copy .env.example and customize
cp .env.example .env

# Edit with your production values
nano .env  # or use your preferred editor
```

**Required Environment Variables for Production:**

```env
# Database
DB_HOST=localhost                          # Or your MySQL server IP
DB_PORT=3306
DB_USER=sespima_user                       # Create this user on MySQL
DB_PASSWORD=your_strong_password           # Use strong password
DB_NAME=sespima

# JWT
JWT_SECRET=generate_a_random_string_here   # Use: openssl rand -base64 32
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com        # Your frontend domain

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15m
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate a Strong JWT_SECRET:**

```bash
openssl rand -base64 32
```

### 2.4 Database Setup

```bash
# Create MySQL user (on your MySQL server)
mysql -u root -p
```

```sql
CREATE USER 'sespima_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON sespima.* TO 'sespima_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.5 Initialize Database

```bash
cd /var/www/sespima-api

# Initialize tables
npm run init:db

# Seed sample data (optional)
npm run seed:db
```

---

## 🚀 3. Start Application with PM2

### 3.1 Start the Application

```bash
cd /var/www/sespima-api

# Start with PM2 using ecosystem.config.js
npm run pm2:start

# Verify it's running
pm2 status
pm2 logs sespima-api
```

### 3.2 Enable PM2 Auto-restart on Server Reboot

```bash
pm2 startup systemd -u $USER --hp /home/$USER
pm2 save
```

### 3.3 Useful PM2 Commands

```bash
# View logs (real-time)
npm run pm2:logs

# Monitor resources (CPU, memory)
npm run pm2:monit

# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# Delete from PM2
npm run pm2:delete

# View all processes
pm2 list
```

---

## 🔐 4. Nginx Reverse Proxy Setup

### 4.1 Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 4.2 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sespima-api
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Certificate (using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Swagger UI
    location /api-docs {
        proxy_pass http://localhost:3000/api-docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.3 Enable Configuration

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sespima-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 4.4 Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 📊 5. Monitoring & Logging

### 5.1 View Application Logs

```bash
# Real-time logs
pm2 logs sespima-api

# Specific log output
cat ~/.pm2/logs/sespima-api-out.log
cat ~/.pm2/logs/sespima-api-error.log

# Last 100 lines
pm2 logs sespima-api --lines 100
```

### 5.2 Monitor System Resources

```bash
# PM2 monitoring
pm2 monit

# System monitoring
top
htop  # (install if needed: sudo apt install htop)

# Disk usage
df -h

# Memory usage
free -h
```

### 5.3 Database Connection Monitoring

```bash
# Check if MySQL is running
systemctl status mysql

# Connect to database
mysql -u sespima_user -p

# Inside MySQL: Check connections
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads%';
```

---

## 🔄 6. Updating the Application

### 6.1 Update Code

```bash
cd /var/www/sespima-api

# Pull latest code
git pull origin main

# Install any new dependencies
npm install --production
```

### 6.2 Apply Database Migrations (if any)

```bash
# Only run if there are new initializers
npm run init:db
```

### 6.3 Restart Application

```bash
npm run pm2:restart

# Or reload with zero-downtime
pm2 reload ecosystem.config.js
```

---

## 🐛 7. Troubleshooting

### Application Won't Start

```bash
# Check error logs
pm2 logs sespima-api --err

# Check if port 3000 is in use
lsof -i :3000

# Check Node.js version
node --version

# Verify .env file exists and is readable
cat .env
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -h DB_HOST -u DB_USER -p DB_NAME

# Check MySQL service
sudo systemctl status mysql
sudo systemctl restart mysql

# Check DB_HOST in .env (use 'localhost' or '127.0.0.1' for local)
```

### High Memory Usage

```bash
# Check PM2 memory limits
pm2 describe sespima-api

# Increase memory limit in ecosystem.config.js
# max_memory_restart: "500M"

# Restart after config change
pm2 restart ecosystem.config.js
```

### Nginx Issues

```bash
# Test config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📝 8. Health Check & Testing

### 8.1 Health Check Endpoint

```bash
# Test application health
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"ok","uptime":1234.567}
```

### 8.2 Test API with Authentication

```bash
# Register a user
curl -X POST https://api.yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "securepassword123",
    "role": "students",
    "phone_number": "08123456789",
    "address": "123 Test Street",
    "birth_date": "1990-01-01"
  }'

# Login
curl -X POST https://api.yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

### 8.3 Access Swagger Documentation

Open in browser: `https://api.yourdomain.com/api-docs`

---

## 🔒 9. Security Checklist

- ✅ Use strong JWT_SECRET (minimum 32 characters)
- ✅ Set `NODE_ENV=production` 
- ✅ Update `CORS_ORIGIN` to your frontend domain
- ✅ Use HTTPS with SSL certificate
- ✅ Database user has limited privileges (only on sespima database)
- ✅ Database password is strong and changed from default
- ✅ Rate limiting enabled
- ✅ Helmet.js security headers enabled
- ✅ Firewall restricts access to database port (3306)
- ✅ SSH keys configured, password login disabled
- ✅ Regular backups of MySQL database configured

---

## 📋 10. Backup Strategy

### 10.1 Database Backup

```bash
# Manual backup
mysqldump -u sespima_user -p sespima > /var/backups/sespima-$(date +%Y%m%d-%H%M%S).sql

# Automated daily backup (add to crontab)
0 2 * * * mysqldump -u sespima_user -pPASSWORD sespima > /var/backups/sespima-$(date +\%Y\%m\%d).sql
```

### 10.2 Application Code Backup

```bash
# Archive entire application
tar -gzf /var/backups/sespima-api-$(date +%Y%m%d).tar.gz /var/www/sespima-api
```

---

## 📞 11. Support & Additional Resources

- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

---

**Last Updated**: March 2026  
**Version**: 1.0.0

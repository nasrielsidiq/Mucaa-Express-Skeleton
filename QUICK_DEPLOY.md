# ⚡ Quick Production Setup Checklist

Complete this checklist before deploying to production VPS.

## Pre-Deployment ✅

- [ ] All sensitive data removed from code
- [ ] Environment variables documented in `.env.example`
- [ ] Database credentials changed from default
- [ ] JWT_SECRET generated with `openssl rand -base64 32`
- [ ] CORS_ORIGIN updated to production domain
- [ ] NODE_ENV set to `production`

## VPS Setup

```bash
# 1. Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 globally
sudo npm install -g pm2
sudo pm2 startup

# 3. Clone application & install dependencies
git clone <repo> /var/www/sespima-api
cd /var/www/sespima-api
npm install --production

# 4. Setup environment variables
cp .env.example .env
nano .env  # Edit with production values

# 5. Create MySQL database & user
mysql -u root -p
# Run SQL from DEPLOYMENT_GUIDE.md section 2.4

# 6. Initialize database
npm run init:db
npm run seed:db

# 7. Start application with PM2
npm run pm2:start
pm2 save
```

## Post-Deployment Verification

```bash
# Check application status
pm2 status

# Check logs
pm2 logs sespima-api

# Test health endpoint
curl http://localhost:3000/health

# Test API
curl https://api.yourdomain.com/health
```

## Production Monitoring

```bash
# Real-time monitoring
pm2 monit

# View application logs
pm2 logs sespima-api

# View system status
top
df -h
```

## Nginx Configuration

See `DEPLOYMENT_GUIDE.md` section 4 for complete Nginx + SSL setup.

## Emergency Commands

```bash
# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# View process details
pm2 describe sespima-api

# Delete from PM2
npm run pm2:delete
```

---

**Full deployment guide**: See `DEPLOYMENT_GUIDE.md`

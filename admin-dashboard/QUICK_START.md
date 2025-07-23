# 🚀 Quick Start Guide

Get the Nava Jothi Silks Admin Dashboard running in minutes!

## 📋 Prerequisites

- **Node.js** (v18+): [Download here](https://nodejs.org/)
- **Redis**: [Download here](https://redis.io/download) or use Docker
- **Git**: [Download here](https://git-scm.com/)

## ⚡ Quick Setup (Recommended)

### Option 1: Docker (Easiest)
```bash
# 1. Clone and navigate
git clone <repository-url>
cd admin-dashboard

# 2. Copy environment config
cp .env.example .env

# 3. Start with Docker (backend only)
docker-compose -f docker-compose.dev.yml up -d

# 4. Access dashboard
open http://localhost:5000
```

### Option 2: Manual Setup
```bash
# 1. Clone and navigate
git clone <repository-url>
cd admin-dashboard

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Start Redis (if not using Docker)
redis-server

# 4. Start the application
npm start

# 5. Access dashboard
open http://localhost:5000
```

## 🔑 Default Login

- **Email**: `admin@navajothisilks.com`
- **Password**: `SecurePassword123!`

## 🛠 Development Mode

To run in development mode with auto-reload:

```bash
# Backend only
npm run server:dev

# Full stack (if client is set up)
npm run dev
```

## 📱 What You Can Do

1. **Dashboard**: View product statistics and inventory status
2. **Products**: Add, edit, and manage silk saree products  
3. **Images**: Upload and manage product images
4. **Stock**: Track inventory levels with low-stock alerts
5. **Analytics**: View sales and product performance (coming soon)

## 🔧 Configuration

Edit the `.env` file to customize:

```env
# Change these for security
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=YourSecurePassword123!

# Redis connection (if not using Docker)
REDIS_HOST=localhost
REDIS_PORT=6379

# File upload settings
MAX_FILE_SIZE=5242880  # 5MB
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild after changes
docker-compose -f docker-compose.dev.yml up --build
```

## 🚨 Troubleshooting

### Redis Connection Error
```bash
# Start Redis manually
redis-server

# Or use Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001

# Or kill existing process
lsof -ti:5000 | xargs kill -9
```

### Permission Denied
```bash
# Fix directory permissions
sudo chmod -R 755 uploads logs
sudo chown -R $USER uploads logs
```

## 📚 Next Steps

1. **Customize Products**: Add your actual silk saree inventory
2. **Upload Images**: Add high-quality product photos
3. **Configure Categories**: Adjust product categories as needed
4. **Set Up Backups**: Configure Redis persistence for production
5. **SSL Certificate**: Set up HTTPS for production deployment

## 🆘 Need Help?

- Check the full [README.md](./README.md) for detailed documentation
- Review the [API Documentation](#) for integration details
- Check logs in the `logs/` directory for error details

---

**🎯 Goal**: Get your silk saree inventory online and manageable within 10 minutes!
# Nava Jothi Silks - Admin Dashboard

A complete admin dashboard system for managing Nava Jothi Silks products, inventory, and operations. Built with Express.js backend, React frontend, and Redis database.

## 🚀 Features

### Backend (Express.js + Redis)
- **Secure Authentication**: JWT-based admin authentication with session management
- **Product Management**: Full CRUD operations for silk saree products
- **File Upload**: Secure image upload with automatic resizing and optimization
- **Inventory Tracking**: Real-time stock management with low-stock alerts
- **API Security**: Rate limiting, input validation, and comprehensive error handling
- **Performance**: Redis caching and optimized database queries

### Frontend (React + Vite)
- **Modern UI**: Responsive design with Tailwind CSS
- **Product Management**: Intuitive forms for adding/editing products
- **Dashboard Analytics**: Sales insights and inventory statistics
- **Image Gallery**: Drag-and-drop image upload with previews
- **Real-time Updates**: Live stock levels and notifications
- **Mobile Responsive**: Works seamlessly on desktop and mobile

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- File upload validation
- Rate limiting
- Input sanitization
- CORS protection
- Security headers

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) 
- **Redis** (v7 or higher)
- **Docker** (optional, for containerized deployment)

## 🛠 Installation & Setup

### Method 1: Manual Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd admin-dashboard
```

#### 2. Install Backend Dependencies
```bash
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

#### 4. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configurations
nano .env
```

Required environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@navajothisilks.com
ADMIN_PASSWORD=SecurePassword123!

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Session Configuration
SESSION_SECRET=your-super-secret-session-key
```

#### 5. Start Redis Server
```bash
# On macOS (with Homebrew)
brew services start redis

# On Ubuntu/Debian
sudo systemctl start redis-server

# On Windows (with Redis Windows)
redis-server
```

#### 6. Start the Application

**Development Mode:**
```bash
# Start both backend and frontend in development mode
npm run dev
```

**Production Mode:**
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

### Method 2: Docker Setup (Recommended for Production)

#### 1. Using Docker Compose
```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 2. Individual Docker Commands
```bash
# Build the application image
docker build -t nava-jothi-admin .

# Run Redis
docker run -d --name nava-jothi-redis \
  -p 6379:6379 \
  redis:7-alpine

# Run the application
docker run -d --name nava-jothi-admin \
  -p 5000:5000 \
  --link nava-jothi-redis:redis \
  -v $(pwd)/uploads:/app/uploads \
  nava-jothi-admin
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `REDIS_HOST` | Redis server host | localhost | Yes |
| `REDIS_PORT` | Redis server port | 6379 | No |
| `REDIS_PASSWORD` | Redis password | - | No |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `ADMIN_EMAIL` | Default admin email | admin@navajothisilks.com | Yes |
| `ADMIN_PASSWORD` | Default admin password | - | Yes |
| `MAX_FILE_SIZE` | Max upload size in bytes | 5242880 | No |
| `CORS_ORIGINS` | Allowed CORS origins | localhost:3000 | No |

### Redis Configuration

The system uses Redis for:
- Session storage
- Product data persistence  
- Admin user management
- Caching and performance optimization

Default Redis configuration is optimized for:
- **Memory limit**: 256MB
- **Persistence**: RDB snapshots + AOF logging
- **Eviction policy**: allkeys-lru

## 📱 Usage

### First Time Setup

1. **Start the application** using one of the methods above
2. **Access the dashboard** at `http://localhost:5000`
3. **Login with default credentials**:
   - Email: `admin@navajothisilks.com`
   - Password: `SecurePassword123!` (or your configured password)

### Managing Products

#### Adding Products
1. Navigate to **Products** → **Add New Product**
2. Fill in the product details:
   - Name, description, category
   - Pricing information
   - Stock quantity
   - Product specifications
3. Upload product images (supports JPEG, PNG, WebP)
4. Click **Save Product**

#### Editing Products
1. Go to **Products** page
2. Find the product and click **Edit**
3. Modify the required fields
4. **Save changes**

#### Managing Inventory
1. Use the **Stock Management** section
2. Update quantities individually or in bulk
3. Monitor low-stock alerts in the dashboard

#### Image Management
- **Upload**: Drag and drop or click to select images
- **Optimization**: Images are automatically resized and compressed
- **Storage**: Images are stored securely with unique filenames

## 🔐 Security

### Authentication
- **JWT tokens** for stateless authentication
- **Session storage** in Redis for additional security
- **Password hashing** using bcrypt with salt rounds
- **Token expiration** and refresh mechanisms

### API Security
- **Rate limiting** on all endpoints
- **Input validation** using express-validator
- **SQL injection prevention** through parameterized queries
- **XSS protection** via input sanitization
- **CORS configuration** for cross-origin requests

### File Upload Security
- **File type validation** (only images allowed)
- **File size limits** (default 5MB)
- **Secure filename generation** to prevent directory traversal
- **Image processing** using Sharp for optimization

## 📊 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
```json
{
  "email": "admin@navajothisilks.com",
  "password": "SecurePassword123!"
}
```

#### POST `/api/auth/logout`
Requires authentication header.

#### GET `/api/auth/profile`
Returns current admin profile information.

### Product Endpoints

#### GET `/api/products`
Query parameters:
- `q`: Search query
- `category`: Filter by category
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

#### POST `/api/products`
Create new product with JSON body.

#### PUT `/api/products/:id`
Update existing product.

#### DELETE `/api/products/:id`
Delete product by ID.

#### PATCH `/api/products/:id/stock`
```json
{
  "quantity": 10,
  "operation": "add|subtract|set"
}
```

### Upload Endpoints

#### POST `/api/upload/products`
Upload multiple product images (multipart/form-data).

#### POST `/api/upload/products/single`
Upload single product image.

#### DELETE `/api/upload/products/:filename`
Delete uploaded image file.

## 🚨 Troubleshooting

### Common Issues

#### Redis Connection Failed
```
Error: Redis connection refused
```
**Solution:**
1. Ensure Redis server is running
2. Check Redis host and port in `.env`
3. Verify Redis authentication if password is set

#### File Upload Errors
```
Error: File too large
```
**Solution:**
1. Check `MAX_FILE_SIZE` in environment variables
2. Ensure uploads directory has write permissions
3. Verify file type is supported (JPEG, PNG, WebP)

#### Authentication Issues
```
Error: Invalid token
```
**Solution:**
1. Check JWT_SECRET is properly set
2. Clear browser localStorage and login again
3. Verify admin credentials in Redis

#### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm start
```

### Performance Optimization

#### Redis Memory Usage
```bash
# Monitor Redis memory
redis-cli info memory

# Set memory limit
redis-cli config set maxmemory 512mb
```

#### Image Storage
- Use CDN for production image serving
- Implement automatic image cleanup for deleted products
- Consider using cloud storage (AWS S3, Google Cloud Storage)

## 🚀 Deployment

### Production Checklist

#### Security
- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET and SESSION_SECRET
- [ ] Configure Redis password
- [ ] Enable HTTPS with SSL certificates
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable Redis AUTH

#### Performance
- [ ] Set up Redis persistence
- [ ] Configure nginx reverse proxy
- [ ] Enable gzip compression
- [ ] Set up CDN for static files
- [ ] Configure logging and monitoring
- [ ] Set up backup strategies

#### Environment
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-secret-key
REDIS_PASSWORD=your-production-redis-password
```

### Deployment Options

#### 1. Traditional Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start server.js --name nava-jothi-admin

# Setup startup script
pm2 startup
pm2 save
```

#### 2. Docker Production
```bash
# Build production image
docker build -t nava-jothi-admin:latest .

# Run with docker-compose
docker-compose -f docker-compose.yml up -d
```

#### 3. Cloud Deployment
- **AWS**: Use ECS with Application Load Balancer
- **Google Cloud**: Deploy to Cloud Run or GKE
- **Azure**: Use Container Instances or AKS
- **DigitalOcean**: Use App Platform or Droplets

## 📝 Maintenance

### Regular Tasks

#### Database Maintenance
```bash
# Redis health check
redis-cli ping

# Check memory usage
redis-cli info memory

# Backup Redis data
redis-cli --rdb /backup/dump.rdb
```

#### Log Management
```bash
# View application logs
tail -f logs/combined.log

# Rotate logs (setup with logrotate)
logrotate /etc/logrotate.d/nava-jothi-admin
```

#### Security Updates
```bash
# Update npm dependencies
npm audit
npm audit fix

# Update system packages
sudo apt update && sudo apt upgrade
```

## 🤝 Support

For technical support or questions:

1. **Check the logs** in `logs/` directory
2. **Review configuration** in `.env` file
3. **Verify dependencies** are properly installed
4. **Test Redis connection** manually
5. **Check file permissions** for uploads directory

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Development Roadmap

- [ ] Advanced analytics dashboard
- [ ] Bulk product import/export
- [ ] Email notifications for low stock
- [ ] Multi-admin user management
- [ ] Order management integration
- [ ] Backup and restore functionality
- [ ] Advanced search with filters
- [ ] Product variants management
- [ ] Inventory forecasting
- [ ] API documentation with Swagger

---

**Built with ❤️ for Nava Jothi Silks**
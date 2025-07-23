#!/bin/bash

# Nava Jothi Silks Admin Dashboard Setup Script

echo "🚀 Setting up Nava Jothi Silks Admin Dashboard..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configurations."
else
    echo "✅ .env file already exists."
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if client directory exists and install frontend dependencies
if [ -d "client" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
else
    echo "⚠️  Client directory not found. Skipping frontend setup."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads/products/thumbnails
mkdir -p logs

# Set permissions
chmod 755 uploads
chmod 755 logs

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  Development: npm run dev"
echo "  Production:  npm start"
echo ""
echo "To use Docker:"
echo "  Development: docker-compose -f docker-compose.dev.yml up"
echo "  Production:  docker-compose up"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@navajothisilks.com"
echo "  Password: SecurePassword123!"
echo ""
echo "Dashboard will be available at: http://localhost:5000"
echo ""
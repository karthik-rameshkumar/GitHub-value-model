#!/bin/bash

# ESSP Dashboard Development Setup Script

set -e

echo "🚀 Setting up ESSP Dashboard development environment..."

# Check for required tools
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "🔍 Checking required tools..."
check_tool docker
check_tool docker-compose || check_tool "docker compose"
check_tool node
check_tool npm

echo "✅ All required tools are available."

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend environment file..."
    cp .env.backend.example backend/.env
    echo "⚠️  Please update backend/.env with your configuration"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend environment file..."
    cp .env.frontend.example frontend/.env
    echo "⚠️  Please update frontend/.env with your configuration"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d postgres redis
else
    docker compose up -d postgres redis
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Run database migrations
echo "🗄️  Running database migrations..."
cd backend
npm run db:migrate || echo "⚠️  Database migrations failed. You may need to run them manually."
cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update environment files with your configuration"
echo "2. Start the development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🏥 Health checks:"
echo "   - Backend: http://localhost:3001/health"
echo "   - Database: http://localhost:3001/health/db"
echo "   - Redis: http://localhost:3001/health/redis"
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 WeAce Development Environment Setup"
echo "======================================"

# Check if Docker is running
print_status "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi
print_success "Docker is running"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi
print_success "Docker Compose is available"

# Step 1: Create docker-compose.override.yml if it doesn't exist
print_status "Setting up development configuration..."
if [ ! -f "docker-compose.override.yml" ]; then
    if [ -f "docker-compose.override.yml.example" ]; then
        cp docker-compose.override.yml.example docker-compose.override.yml
        print_success "Created docker-compose.override.yml from example"
    else
        print_warning "docker-compose.override.yml.example not found, creating basic override"
        cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/api-gateway:/app
      - /app/node_modules
    command: npm run start:dev

  # Auth Service
  auth-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/auth-service:/app
      - /app/node_modules
    command: npm run start:dev

  # User Service
  user-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/user-service:/app
      - /app/node_modules
    command: npm run start:dev

  # Coaching Service
  coaching-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/coaching-service:/app
      - /app/node_modules
    command: npm run start:dev

  # Training Service
  training-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/training-service:/app
      - /app/node_modules
    command: npm run start:dev

  # Event Service
  event-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/event-service:/app
      - /app/node_modules
    command: npm run start:dev

  # Engagement Service
  engagement-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/engagement-service:/app
      - /app/node_modules
    command: npm run start:dev

  # Notification Service
  notification-service:
    build:
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/notification-service:/app
      - /app/node_modules
    command: npm run start:dev
EOF
        print_success "Created basic docker-compose.override.yml"
    fi
else
    print_success "docker-compose.override.yml already exists"
fi

# Step 2: Create Dockerfile.dev for each service if they don't exist
print_status "Setting up development Dockerfiles..."
services=("api-gateway" "auth-service" "user-service" "coaching-service" "training-service" "event-service" "engagement-service" "notification-service")

for service in "${services[@]}"; do
    if [ ! -f "services/$service/Dockerfile.dev" ]; then
        cat > "services/$service/Dockerfile.dev" << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "start:dev"]
EOF
        print_success "Created Dockerfile.dev for $service"
    else
        print_success "Dockerfile.dev already exists for $service"
    fi
done

# Step 3: Set up .env files
print_status "Setting up environment files..."
for service in "${services[@]}"; do
    if [ ! -f "services/$service/.env" ]; then
        if [ -f "services/$service/env.example" ]; then
            cp "services/$service/env.example" "services/$service/.env"
            print_success "Created .env for $service from example"
        elif [ -f "services/$service/.env.example" ]; then
            cp "services/$service/.env.example" "services/$service/.env"
            print_success "Created .env for $service from example"
        else
            print_warning "No example env file found for $service"
        fi
    else
        print_success ".env already exists for $service"
    fi
done

# Step 4: Install dependencies (optional - can be done by Docker)
print_status "Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_success "Installed root dependencies"
fi

# Step 5: Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/*.sh
print_success "Made all scripts executable"

# Step 6: Stop any running containers
print_status "Stopping any existing containers..."
docker-compose down
print_success "Stopped existing containers"

# Step 7: Build and start services
print_status "Building and starting services..."
docker-compose build
if [ $? -eq 0 ]; then
    print_success "Services built successfully"
else
    print_error "Failed to build services"
    exit 1
fi

# Step 8: Start all services
print_status "Starting all services..."
docker-compose up -d
if [ $? -eq 0 ]; then
    print_success "Services started successfully"
else
    print_error "Failed to start services"
    exit 1
fi

# Step 9: Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Step 10: Check service status
print_status "Checking service status..."
docker-compose ps

# Step 11: Display access information
echo ""
echo "🎉 WeAce Development Environment is Ready!"
echo "=========================================="
echo ""
echo "🌐 Access Points:"
echo "   • API Gateway: http://localhost:3000"
echo "   • API Documentation: http://localhost:3000/api/docs"
echo "   • Health Check: http://localhost:3000/api/v1/health"
echo ""
echo "🗄️  Database Management:"
echo "   • phpMyAdmin (MySQL): http://localhost:8080"
echo "     - Username: root"
echo "     - Password: Admin@123"
echo "   • Mongo Express (MongoDB): http://localhost:8081"
echo "     - Username: admin"
echo "     - Password: admin123"
echo ""
echo "🔧 Database Connection Details:"
echo "   • MySQL: localhost:3307 (root/Admin@123)"
echo "   • MongoDB: localhost:27017"
echo "   • MongoDB Compass: mongodb://localhost:27017"
echo ""
echo "📋 Useful Commands:"
echo "   • View logs: docker-compose logs -f [service-name]"
echo "   • Stop services: docker-compose down"
echo "   • Restart services: docker-compose restart [service-name]"
echo "   • Rebuild services: docker-compose build [service-name]"
echo ""
echo "🔄 Development Features:"
echo "   • Hot reload enabled for all services"
echo "   • Volume mounts for live code changes"
echo "   • No rebuilding needed for most changes"
echo ""
print_success "Setup complete! Your development environment is ready." 
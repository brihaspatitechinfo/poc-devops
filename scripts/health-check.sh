#!/bin/bash

# WeAce Microservices - Health Check Script
# This script checks the health of all microservices

set -e

echo "🔍 WeAce Microservices Health Check"

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

# Function to check service health
check_service_health() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    echo -n "Checking $service_name (port $port)... "
    
    if curl -s "$endpoint" > /dev/null 2>&1; then
        print_success "✅ Healthy"
        return 0
    else
        print_error "❌ Unhealthy"
        return 1
    fi
}

# Function to get detailed health info
get_health_details() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    echo ""
    print_status "Detailed health info for $service_name:"
    
    if response=$(curl -s "$endpoint" 2>/dev/null); then
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        print_error "Could not retrieve health information"
    fi
}

# Check if jq is available for JSON formatting
if command -v jq &> /dev/null; then
    JQ_AVAILABLE=true
else
    JQ_AVAILABLE=false
    print_warning "jq not found. Install jq for better JSON formatting."
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    print_error "curl is not installed. Please install curl first."
    exit 1
fi

# Services to check
services=(
    "API Gateway:3000:http://localhost:3000/api/v1/health"
    "Auth Service:3001:http://localhost:3001/api/v1/health"
    "User Service:3002:http://localhost:3002/api/v1/health"
    "Coaching Service:3003:http://localhost:3003/api/v1/health"
    "Event Service:3004:http://localhost:3004/api/v1/health"
    "Notification Service:3005:http://localhost:3005/api/v1/health"
    "Training Service:3006:http://localhost:3006/api/v1/health"
    "Engagement Service:3007:http://localhost:3007/api/v1/health"
)

echo ""
echo "📊 Service Health Status:"
echo "========================="

healthy_count=0
total_count=0

for service in "${services[@]}"; do
    service_name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    endpoint=$(echo $service | cut -d: -f3)
    
    total_count=$((total_count + 1))
    
    if check_service_health "$service_name" "$port" "$endpoint"; then
        healthy_count=$((healthy_count + 1))
    fi
done

echo ""
echo "📈 Summary:"
echo "==========="
echo "Healthy services: $healthy_count/$total_count"

if [ "$healthy_count" -eq "$total_count" ]; then
    print_success "All services are healthy! 🎉"
else
    print_warning "Some services are unhealthy. Check logs with: docker-compose logs"
fi

# Check container status
echo ""
print_status "Checking Docker container status..."
if docker-compose ps | grep -q "Up"; then
    print_success "All containers are running"
else
    print_error "Some containers are not running"
    docker-compose ps
fi

# Check database connectivity
echo ""
print_status "Checking database connectivity..."

# Check MySQL
if docker exec we-ace-mysql-1 mysql -u root -pAdmin@123 -e "SELECT 1" > /dev/null 2>&1; then
    print_success "MySQL database is accessible"
else
    print_error "MySQL database is not accessible"
fi

# Check MongoDB
if docker exec we-ace-mongo-1 mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB database is accessible"
else
    print_error "MongoDB database is not accessible"
fi

# Display service URLs
echo ""
echo "🌐 Service URLs:"
echo "================"
echo "API Gateway:     http://localhost:3000/api/docs"
echo "Auth Service:    http://localhost:3001/api/docs"
echo "User Service:    http://localhost:3002/api/docs"
echo "Coaching Service: http://localhost:3003/api/docs"
echo "Event Service:   http://localhost:3004/api/docs"
echo "Notification:    http://localhost:3005/api/docs"
echo "Training Service: http://localhost:3006/api/docs"
echo "Engagement:      http://localhost:3007/api/docs"

# Optional: Get detailed health info for unhealthy services
if [ "$healthy_count" -lt "$total_count" ]; then
    echo ""
    print_status "Getting detailed health information for unhealthy services..."
    
    for service in "${services[@]}"; do
        service_name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        endpoint=$(echo $service | cut -d: -f3)
        
        if ! curl -s "$endpoint" > /dev/null 2>&1; then
            get_health_details "$service_name" "$port" "$endpoint"
        fi
    done
fi

echo ""
print_status "Health check completed!" 
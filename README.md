# WeAce Microservices Platform

A comprehensive microservices platform for coaching, training, and engagement management built with NestJS, Docker, and modern cloud technologies.

## 🏗️ Architecture

The platform consists of 8 microservices:

- **API Gateway** (Port 3000) - Central routing and authentication
- **Auth Service** (Port 3001) - User authentication and authorization
- **User Service** (Port 3002) - User profile management (MongoDB)
- **Coaching Service** (Port 3003) - Coaching session management
- **Event Service** (Port 3004) - Event management
- **Notification Service** (Port 3005) - Notification system
- **Training Service** (Port 3006) - Training and assessment management
- **Engagement Service** (Port 3007) - User engagement tracking

## 🗄️ Database Architecture

- **MySQL**: Primary database for business services (coaching, training, events, engagement)
- **MongoDB**: Used by user service and notification service for flexible document storage
- **AWS Cognito**: Handles authentication and user management (no local database needed)

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Environment Configuration

The project follows environment configuration best practices:

#### Environment Files Structure

Each service has the following environment files:
- `.env` - Actual environment variables (not committed to git)
- `.env.example` - Template with example values (committed to git)

#### Environment Loading Priority

1. **Docker Compose environment variables** (highest priority)
2. **Local `.env` files** (loaded by ConfigModule)
3. **`.env.example` files** (documentation only)

#### Setting Up Environment Files

1. **Copy example files** (first time setup):
   ```bash
   # For each service
   cp services/[service-name]/env.example services/[service-name]/.env
   ```

2. **Customize values** in each `.env` file according to your environment

3. **Database configuration**:
   - MySQL services: Use `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
   - MongoDB services: Use `MONGODB_URI`

#### Environment Variables by Service

**API Gateway**:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
AUTH_SERVICE_URL=http://auth-service:3001
USER_SERVICE_URL=http://user-service:3002
# ... other service URLs
```

**MySQL Services** (Coaching, Training, Events, Engagement):
```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=Admin@123
DB_NAME=weace_[service_name]
NODE_ENV=development
PORT=[service_port]
JWT_SECRET=your-jwt-secret
```

**Auth Service** (AWS Cognito - No Database):
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-jwt-secret
AWS_REGION=ap-south-1
AWS_COGNITO_USER_POOL_ID=your-user-pool-id
AWS_COGNITO_CLIENT_ID=your-client-id
AWS_COGNITO_CLIENT_SECRET=your-client-secret
USER_SERVICE_URL=http://user-service:3002
```

**MongoDB Services** (User Service, Notification Service):
```env
MONGODB_URI=mongodb://mongo:27017/weace_[service_name]
NODE_ENV=development
PORT=[service_port]
JWT_SECRET=your-jwt-secret
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd we-ace
   ```

2. **Run the development setup**:
   ```bash
   ./scripts/dev-setup.sh
   ```

3. **Verify health**:
   ```bash
   ./scripts/health-check.sh
   ```

### Production Setup
```bash
# Clone the repository
git clone <repository-url>
cd we-ace

# Start all services
docker-compose up -d

# Access the API Gateway
curl http://localhost:3000/api/v1/health
```

## 🛠️ Development Setup

For development with hot reloading and volume mounts:

### Single Command Setup
```bash
# Clone the repository
git clone <repository-url>
cd we-ace

# Run the complete development setup (one command does everything)
./scripts/dev-setup.sh

# This single script will:
# - Check Docker and Docker Compose
# - Create docker-compose.override.yml
# - Create Dockerfile.dev for all services
# - Set up .env files from examples
# - Install dependencies
# - Build and start all services
# - Set up database management tools
# - Display all access information
```

### Manual Setup (Alternative)
```bash
# Clone the repository
git clone <repository-url>
cd we-ace

# Manual setup steps
docker-compose down
docker-compose build
docker-compose up -d
```

### 3. Database Management Tools

#### phpMyAdmin (MySQL)
- **URL**: http://localhost:8080
- **Username**: root
- **Password**: Admin@123
- **Features**: Full MySQL database management, query execution, table browsing

#### Mongo Express (MongoDB)
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: admin123
- **Features**: MongoDB database management, collection browsing, document viewing

#### MongoDB Compass (Desktop App)
- **Connection String**: `mongodb://localhost:27017`
- **No authentication required** for development
- **Features**: Advanced MongoDB GUI with query building, aggregation, and visualization

### 3. Development Workflow
- **Code changes are automatically reflected** (hot reload)
- **No rebuilding needed** for most changes
- **Restart service** if needed: `docker-compose restart <service-name>`

## 📁 Project Structure

```
we-ace/
├── services/
│   ├── api-gateway/          # API Gateway (NestJS)
│   ├── auth-service/         # Authentication Service
│   ├── user-service/         # User Management Service
│   ├── coaching-service/     # Coaching Service
│   ├── training-service/     # Training Service
│   ├── event-service/        # Event Management Service
│   ├── engagement-service/   # Engagement Service
│   └── notification-service/ # Notification Service
├── scripts/
│   ├── dev-setup.sh          # Complete development setup
│   ├── health-check.sh       # Service health verification
│   └── mysql-init.sql        # Database initialization
├── docs/                     # Documentation
├── docker-compose.yml        # Production configuration
└── docker-compose.override.yml.example  # Development template
```

## 🌐 Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Central entry point for all APIs |
| Auth Service | 3001 | Authentication & authorization |
| User Service | 3002 | User profile management |
| Coaching Service | 3003 | Coaching sessions & mentoring |
| Event Service | 3004 | Event management |
| Notification Service | 3005 | Notification system |
| Training Service | 3006 | Training & assessment management |
| Engagement Service | 3007 | User engagement tracking |
| phpMyAdmin | 8080 | MySQL database management |
| Mongo Express | 8081 | MongoDB database management |
| Event Service | 3004 | Event management |
| Notification Service | 3005 | Email, SMS, push notifications |
| Training Service | 3006 | Course management & assessments |
| Engagement Service | 3007 | User engagement tracking |
| MySQL | 3307 | Primary database |
| MongoDB | 27017 | Document database |

## 🔧 Development Commands

```bash
# View logs
docker-compose logs api-gateway

# Restart specific service
docker-compose restart api-gateway

# Rebuild specific service
docker-compose build api-gateway

# Stop all services
docker-compose down

# Check service status
docker-compose ps
```

## 📚 API Documentation

- **Swagger UI**: http://localhost:3000/api/docs
- **Postman Collection**: `docs/WeAce_Microservices.postman_collection.json`
- **API Testing Guide**: `docs/API_TESTING_GUIDE.md`

## 🧪 Testing

### Health Checks
```bash
# Check all services health
./scripts/health-check.sh

# Individual service health
curl http://localhost:3000/api/v1/health
curl http://localhost:3001/api/v1/health
# ... etc for each service
```

### API Testing
```bash
# Import Postman collection
# Use the provided collection in docs/WeAce_Microservices.postman_collection.json
```

## 🛠️ Development

### Service Structure
Each service follows NestJS best practices:
```
services/[service-name]/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── [feature]/
│   │   ├── [feature].controller.ts
│   │   ├── [feature].service.ts
│   │   ├── [feature].module.ts
│   │   ├── dto/
│   │   └── entities/
│   └── health/
├── .env
├── env.example
├── package.json
└── Dockerfile
```

### Adding New Services
1. Create service directory in `services/`
2. Add `.env` and `env.example` files
3. Update `docker-compose.yml`
4. Add service to API Gateway
5. Update documentation

### Environment Best Practices
- ✅ Use `.env` files for local development
- ✅ Use Docker environment variables for production
- ✅ Keep `.env.example` files updated
- ✅ Never commit `.env` files to git
- ✅ Use consistent variable naming
- ✅ Document all environment variables

## 🔧 Configuration

### Database Configuration
- **MySQL**: Used by 7 services for structured data
- **MongoDB**: Used by user service for flexible schemas
- **Connection**: Services connect via Docker network

### Security
- JWT-based authentication
- Environment-based secrets
- Docker network isolation
- Input validation and sanitization

### Logging
- Structured logging with configurable levels
- Environment-based log configuration
- Health check endpoints for monitoring

## 📊 Monitoring

### Health Endpoints
All services provide health check endpoints:
- `GET /api/v1/health` - Service health status
- `GET /api/v1/health/detailed` - Detailed health information

### Logs
```bash
# View service logs
docker-compose logs [service-name]

# Follow logs
docker-compose logs -f [service-name]
```

## 🚀 Deployment

### Production Considerations
1. Use production-grade secrets management
2. Configure proper logging and monitoring
3. Set up database backups
4. Use environment-specific configurations
5. Implement proper security measures

### Environment Variables for Production
- Use secure secret management (AWS Secrets Manager, HashiCorp Vault)
- Rotate JWT secrets regularly
- Use strong database passwords
- Configure proper CORS settings
- Set up monitoring and alerting

## 🤝 Contributing

1. Follow the established environment configuration patterns
2. Update `.env.example` files when adding new variables
3. Test with both Docker and local environments
4. Update documentation for any configuration changes

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the health endpoints
2. Review service logs
3. Verify environment configuration
4. Consult the API documentation

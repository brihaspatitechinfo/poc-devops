# WeAce Utility Service - Environment Setup Guide

## 📋 Overview

This guide explains how to configure the environment variables for the WeAce Utility Service microservice.

## 🚀 Quick Start

### 1. Copy Environment Template
```bash
cp env.example .env
```

### 2. Configure Database
Update the database configuration in your `.env` file:
```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=utility_user
DB_PASSWORD=Admin@123
DB_NAME=weace_utility
```

### 3. Start the Service
```bash
npm run start:dev
```

## 🔧 Environment Variables

### Database Configuration (MySQL)
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `mysql` | Database host |
| `DB_PORT` | `3306` | Database port |
| `DB_USERNAME` | `utility_user` | Database username |
| `DB_PASSWORD` | `Admin@123` | Database password |
| `DB_NAME` | `weace_utility` | Database name |

### Application Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3008` | Service port |
| `API_PREFIX` | `api/v1` | API prefix |

### Logging Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `debug` | Log level (error, warn, info, debug) |

### JWT Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `your-jwt-secret-here` | JWT secret key |
| `JWT_EXPIRES_IN` | `1d` | JWT expiration time |

### External Services
| Variable | Default | Description |
|----------|---------|-------------|
| `API_GATEWAY_URL` | `http://api-gateway:3000` | API Gateway URL |

## 🐳 Docker Environment

When running with Docker, the environment is configured in `docker-compose.yml`:

```yaml
utility-service:
  environment:
    - NODE_ENV=development
    - PORT=3008
    - DB_HOST=mysql
    - DB_PORT=3306
    - DB_USERNAME=utility_user
    - DB_PASSWORD=Admin@123
    - DB_NAME=weace_utility
```

## 🔒 Production Environment

For production, update these variables:

```env
NODE_ENV=production
LOG_LEVEL=warn
JWT_SECRET=your-super-secure-jwt-secret-key-2024
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `GET /health`
- **Description**: Service health status
- **Response**: JSON with service status

### Swagger Documentation
- **URL**: `GET /api/docs`
- **Description**: API documentation
- **Features**: Interactive API testing

## 🔄 Environment File Priority

The service loads environment variables in this order:
1. `.env.local` (highest priority)
2. `.env`
3. System environment variables
4. Default values (lowest priority)

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
   - Ensure MySQL service is running
   - Verify database exists: `weace_utility`

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Check if another service is using port 3008

3. **TypeORM Synchronization Issues**
   - Set `NODE_ENV=production` to disable sync in production
   - Check database permissions
   - Verify entity configurations

4. **CORS Issues**
   - CORS is enabled by default for development
   - Configure specific origins for production

## 📝 Environment File Templates

### Development Template
```env
NODE_ENV=development
PORT=3008
LOG_LEVEL=debug
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=utility_user
DB_PASSWORD=Admin@123
DB_NAME=weace_utility
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=1d
API_GATEWAY_URL=http://api-gateway:3000
```

### Production Template
```env
NODE_ENV=production
PORT=3008
LOG_LEVEL=warn
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=utility_user
DB_PASSWORD=Admin@123
DB_NAME=weace_utility
JWT_SECRET=your-super-secure-jwt-secret-key-2024
JWT_EXPIRES_IN=1d
API_GATEWAY_URL=http://api-gateway:3000
```

## 🎯 Next Steps

1. **Copy Environment Template**: `cp env.example .env`
2. **Configure Database**: Update database credentials
3. **Start Service**: `npm run start:dev`
4. **Test Health**: `curl http://localhost:3008/health`
5. **View API Docs**: `http://localhost:3008/api/docs`

## 📞 Support

For issues with environment configuration:
1. Check the logs: `npm run start:dev`
2. Verify database connection
3. Review environment variable values
4. Check Docker configuration if using containers 
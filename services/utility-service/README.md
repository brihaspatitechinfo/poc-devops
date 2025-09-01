# WeAce Utility Service

A microservice providing common utility functions for the WeAce platform.

## Features

- **Health Checks**: Service health, readiness, and liveness endpoints
- **Timestamp Utilities**: Get current timestamp in various formats
- **UUID Generation**: Generate unique identifiers
- **String Hashing**: Hash strings using SHA-256
- **Email Validation**: Validate email format
- **Password Generation**: Generate secure random passwords

## API Endpoints

### Health Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/ready` - Readiness check
- `GET /api/v1/health/live` - Liveness check

### Utility Endpoints
- `GET /api/v1/utils/timestamp` - Get current timestamp
- `GET /api/v1/utils/uuid` - Generate UUID
- `POST /api/v1/utils/hash` - Hash a string
- `GET /api/v1/utils/validate-email?email=test@example.com` - Validate email
- `GET /api/v1/utils/generate-password?length=12` - Generate password

## Development

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Running the Service
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Testing
```bash
npm test
npm run test:watch
npm run test:cov
```

## Docker

### Build
```bash
docker build -t weace-utility-service .
```

### Run
```bash
docker run -p 3008:3008 weace-utility-service
```

## Environment Variables

Copy `env.example` to `.env` and configure:

- `PORT`: Service port (default: 3008)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (default: info)

## Swagger Documentation

Access the API documentation at: `http://localhost:3008/api/docs` 
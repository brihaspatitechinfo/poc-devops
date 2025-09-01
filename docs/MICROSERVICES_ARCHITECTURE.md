# WeAce Microservices Architecture

## Overview

WeAce follows a microservices architecture pattern with clear separation of concerns. This document outlines the responsibilities of each service and the best practices implemented.

## Service Responsibilities

### 1. API Gateway (`api-gateway`)
**Port: 3000**

**Responsibilities:**
- **Route Orchestration**: Directs requests to appropriate microservices
- **SSO Flow Management**: Handles SSO login/logout URLs and callbacks
- **Request Aggregation**: Combines data from multiple services when needed
- **Rate Limiting**: API-level protection and throttling
- **Authentication Middleware**: Validates tokens before routing to protected services

**Key Endpoints:**
- `GET /auth/sso/login` - Get SSO login URL
- `GET /auth/sso/logout` - Get SSO logout URL  
- `GET /auth/sso/callback` - Handle SSO callback
- `POST /auth/sso/refresh` - Refresh SSO tokens
- `GET /auth/sso/user-info` - Get SSO user information
- `* /auth/*` - Proxy to auth-service
- `* /users/*` - Proxy to user-service
- `* /training/*` - Proxy to training-service
- `* /coaching/*` - Proxy to coaching-service
- `* /events/*` - Proxy to event-service
- `* /notifications/*` - Proxy to notification-service
- `* /engagement/*` - Proxy to engagement-service

### 2. Authentication Service (`auth-service`)
**Port: 3001**

**Responsibilities:**
- **Authentication**: Login, logout, token validation
- **Authorization**: JWT token generation/validation, permissions
- **Password Management**: Reset, change (authentication-related only)
- **SSO Integration**: AWS Cognito integration, token exchange
- **Admin Auth Operations**: Create/delete users in Cognito

**Key Endpoints:**
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/confirm-forgot-password` - Confirm password reset
- `GET /auth/verify-token` - Verify access token
- `GET /auth/login-url` - Get SSO login URL
- `GET /auth/logout-url` - Get SSO logout URL
- `GET /auth/sso/callback` - Handle SSO callback
- `POST /auth/sso/refresh` - Refresh SSO tokens
- `POST /auth/admin/create-user` - Create user in Cognito (Admin)
- `POST /auth/admin/set-password` - Set user password (Admin)
- `POST /auth/admin/delete-user` - Delete user from Cognito (Admin)

### 3. User Service (`user-service`)
**Port: 3002**

**Responsibilities:**
- **User Registration**: New user signup and confirmation
- **User Profile Management**: CRUD operations on user profiles
- **User Search**: Find and filter users
- **User Relationships**: Followers, connections, etc.
- **User Preferences**: Settings, preferences, customization

**Key Endpoints:**
- `POST /users/register` - Register new user
- `POST /users/confirm-registration` - Confirm user registration
- `GET /users/profile` - Get current user profile
- `GET /users/profile/:id` - Get user profile by ID
- `PUT /users/profile` - Update current user profile
- `GET /users` - Get all users (with pagination)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)
- `POST /users/search` - Search users

### 4. Training Service (`training-service`)
**Port: 3003**

**Responsibilities:**
- **Course Management**: Create, update, delete training courses
- **Assessment Management**: Create and manage assessments
- **Progress Tracking**: Track user progress through courses
- **Certification**: Issue and manage certificates

### 5. Coaching Service (`coaching-service`)
**Port: 3004**

**Responsibilities:**
- **Session Management**: Schedule and manage coaching sessions
- **Coach Profiles**: Manage coach information and availability
- **Booking System**: Handle session bookings and cancellations
- **Session Notes**: Store and retrieve session notes

### 6. Event Service (`event-service`)
**Port: 3005**

**Responsibilities:**
- **Event Management**: Create, update, delete events
- **Event Registration**: Handle event registrations
- **Event Notifications**: Send event-related notifications
- **Calendar Integration**: Manage event calendars

### 7. Notification Service (`notification-service`)
**Port: 3006**

**Responsibilities:**
- **Notification Management**: Create and send notifications
- **Notification Preferences**: Manage user notification settings
- **Notification History**: Store and retrieve notification history
- **Multi-channel Support**: Email, SMS, push notifications

### 8. Engagement Service (`engagement-service`)
**Port: 3007**

**Responsibilities:**
- **Engagement Tracking**: Track user engagement metrics
- **Feedback Management**: Collect and manage user feedback
- **Analytics**: Provide engagement analytics and insights
- **Gamification**: Points, badges, leaderboards

## Data Flow Examples

### User Registration Flow:
1. **Client** → `POST /users/register` → **API Gateway**
2. **API Gateway** → **User Service** (creates user profile)
3. **User Service** → **Auth Service** (creates Cognito user)
4. **Auth Service** → **User Service** (confirms user creation)
5. **User Service** → **API Gateway** → **Client** (registration success)

### User Login Flow:
1. **Client** → `POST /auth/login` → **API Gateway**
2. **API Gateway** → **Auth Service** (validates credentials)
3. **Auth Service** → **User Service** (gets user profile)
4. **Auth Service** → **API Gateway** → **Client** (login success + tokens)

### SSO Login Flow:
1. **Client** → `GET /auth/sso/login` → **API Gateway**
2. **API Gateway** → **Client** (SSO login URL)
3. **Client** → **Cognito** (user authenticates)
4. **Cognito** → `GET /auth/sso/callback` → **API Gateway**
5. **API Gateway** → **Auth Service** (exchanges code for tokens)
6. **Auth Service** → **User Service** (gets/creates user profile)
7. **API Gateway** → **Client** (SSO success + tokens)

## Best Practices Implemented

### 1. Single Responsibility Principle
Each service has a clear, focused responsibility:
- **Auth Service**: Authentication and authorization only
- **User Service**: User profile and registration management
- **API Gateway**: Routing and orchestration

### 2. Service Independence
- Services can be developed, deployed, and scaled independently
- Each service has its own database
- Services communicate via well-defined APIs

### 3. API Gateway Pattern
- Centralized routing and orchestration
- Consistent API interface for clients
- Cross-cutting concerns (rate limiting, authentication)

### 4. Event-Driven Architecture
- Services can communicate asynchronously via events
- Loose coupling between services
- Better scalability and fault tolerance

### 5. Security Best Practices
- JWT tokens for authentication
- Service-to-service authentication
- Input validation at API Gateway level
- Rate limiting and throttling

## Database Strategy

### Auth Service
- **Database**: AWS Cognito (managed service)
- **Purpose**: User authentication and authorization
- **Data**: User credentials, tokens, permissions

### User Service
- **Database**: MongoDB
- **Purpose**: User profiles and metadata
- **Data**: User profiles, preferences, relationships

### Other Services
- **Database**: MongoDB/MySQL (as appropriate)
- **Purpose**: Service-specific data
- **Data**: Business domain data

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Auth Service  │
│   (Port 80/443) │───▶│   (Port 3000)   │───▶│   (Port 3001)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ├─▶ User Service (Port 3002)
                              ├─▶ Training Service (Port 3003)
                              ├─▶ Coaching Service (Port 3004)
                              ├─▶ Event Service (Port 3005)
                              ├─▶ Notification Service (Port 3006)
                              └─▶ Engagement Service (Port 3007)
```

## Monitoring and Observability

### Health Checks
- Each service exposes `/health` endpoint
- API Gateway monitors service health
- Automatic failover for unhealthy services

### Logging
- Centralized logging for all services
- Structured logging with correlation IDs
- Request tracing across services

### Metrics
- Service-level metrics (response time, error rate)
- Business metrics (user registrations, logins)
- Infrastructure metrics (CPU, memory, disk)

## Future Enhancements

### 1. Service Mesh
- Implement Istio or similar service mesh
- Advanced traffic management
- Enhanced security and observability

### 2. Event Sourcing
- Implement event sourcing for better audit trails
- Event-driven communication between services
- Better scalability and fault tolerance

### 3. CQRS Pattern
- Separate read and write models
- Better performance for read-heavy operations
- Eventual consistency where appropriate

### 4. API Versioning
- Implement proper API versioning strategy
- Backward compatibility
- Gradual migration support 
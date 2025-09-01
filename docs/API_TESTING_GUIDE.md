# WeAce Microservices API Testing Guide

This guide provides comprehensive testing instructions for all WeAce microservices APIs, including health checks, authentication, and business logic endpoints.

## 🏗️ Service Architecture

### Current Services
| Service | Port | Database | Base URL | Health Endpoint |
|---------|------|----------|----------|-----------------|
| API Gateway | 3000 | - | http://localhost:3000 | `/api/v1/health` |
| Auth Service | 3001 | MySQL | http://localhost:3001 | `/api/v1/health` |
| User Service | 3002 | MongoDB | http://localhost:3002 | `/api/v1/health` |
| Coaching Service | 3003 | MySQL | http://localhost:3003 | `/api/v1/health` |
| Event Service | 3004 | MySQL | http://localhost:3004 | `/api/v1/health` |
| Notification Service | 3005 | MySQL | http://localhost:3005 | `/api/v1/health` |
| Training Service | 3006 | MySQL | http://localhost:3006 | `/api/v1/health` |
| Engagement Service | 3007 | MySQL | http://localhost:3007 | `/api/v1/health` |

## 🚀 Quick Start

### 1. Start All Services
```bash
# Start all microservices
docker-compose up -d

# Verify services are running
docker-compose ps

# Check overall health
curl http://localhost:3000/api/v1/health
```

### 2. Health Check All Services
```bash
# API Gateway
curl http://localhost:3000/api/v1/health

# Auth Service
curl http://localhost:3001/api/v1/health

# User Service
curl http://localhost:3002/api/v1/health

# Coaching Service
curl http://localhost:3003/api/v1/health

# Event Service
curl http://localhost:3004/api/v1/health

# Notification Service
curl http://localhost:3005/api/v1/health

# Training Service
curl http://localhost:3006/api/v1/health

# Engagement Service
curl http://localhost:3007/api/v1/health
```

## 🔐 Authentication Testing

### 1. User Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Using JWT Token
```bash
# Store token in variable
TOKEN="your-jwt-token-here"

# Use token in subsequent requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users
```

## 👥 User Service Testing

### 1. Create User
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "coach"
  }'
```

### 2. Get All Users
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users
```

### 3. Get User by ID
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users/USER_ID_HERE
```

### 4. Update User
```bash
curl -X PUT http://localhost:3000/api/v1/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "Jane",
    "lastName": "Johnson",
    "email": "jane.johnson@example.com"
  }'
```

### 5. Delete User
```bash
curl -X DELETE http://localhost:3000/api/v1/users/USER_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

## 🎯 Coaching Service Testing

### 1. Create Coaching Session
```bash
curl -X POST http://localhost:3000/api/v1/coaching/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Leadership Development",
    "description": "Focus on developing leadership skills",
    "coachId": "coach-uuid",
    "coacheeId": "coachee-uuid",
    "scheduledAt": "2024-02-15T14:00:00Z",
    "duration": 60
  }'
```

### 2. Get All Sessions
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/coaching/sessions
```

### 3. Get Session by ID
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/coaching/sessions/SESSION_ID_HERE
```

### 4. Update Session
```bash
curl -X PUT http://localhost:3000/api/v1/coaching/sessions/SESSION_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Advanced Leadership Development",
    "description": "Advanced leadership skills workshop",
    "duration": 90
  }'
```

### 5. Delete Session
```bash
curl -X DELETE http://localhost:3000/api/v1/coaching/sessions/SESSION_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

## 📅 Event Service Testing

### 1. Create Event
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "startDate": "2024-03-15T09:00:00Z",
    "endDate": "2024-03-15T17:00:00Z",
    "location": "Convention Center",
    "maxAttendees": 500
  }'
```

### 2. Get All Events
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/events
```

### 3. Get Event by ID
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/events/EVENT_ID_HERE
```

### 4. Update Event
```bash
curl -X PUT http://localhost:3000/api/v1/events/EVENT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Tech Conference 2024 - Updated",
    "maxAttendees": 750
  }'
```

### 5. Delete Event
```bash
curl -X DELETE http://localhost:3000/api/v1/events/EVENT_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

## 🎓 Training Service Testing

### 1. Create Course
```bash
curl -X POST http://localhost:3000/api/v1/training/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Advanced JavaScript",
    "description": "Learn advanced JavaScript concepts",
    "instructor": "John Doe",
    "duration": 120,
    "level": "intermediate"
  }'
```

### 2. Get All Courses
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/training/courses
```

### 3. Get Course by ID
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/training/courses/COURSE_ID_HERE
```

### 4. Create Assessment
```bash
curl -X POST http://localhost:3000/api/v1/training/assessments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "JavaScript Fundamentals Quiz",
    "description": "Test your JavaScript knowledge",
    "courseId": "COURSE_ID_HERE",
    "questions": [
      {
        "question": "What is JavaScript?",
        "options": ["Programming Language", "Markup Language", "Styling Language"],
        "correctAnswer": 0
      }
    ]
  }'
```

### 5. Submit Assessment
```bash
curl -X POST http://localhost:3000/api/v1/training/assessments/ASSESSMENT_ID_HERE/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "answers": [0, 1, 2],
    "userId": "USER_ID_HERE"
  }'
```

## 🏆 Engagement Service Testing

### 1. Create Engagement Record
```bash
curl -X POST http://localhost:3000/api/v1/engagement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "USER_ID_HERE",
    "type": "course_completion",
    "value": 85.5,
    "description": "Completed JavaScript course"
  }'
```

### 2. Get All Engagement Records
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/engagement
```

### 3. Get User Engagement Score
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/engagement/user/USER_ID_HERE/score
```

### 4. Get User Engagement History
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/engagement/user/USER_ID_HERE
```

## 📢 Notification Service Testing

### 1. Create Notification
```bash
curl -X POST http://localhost:3000/api/v1/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "USER_ID_HERE",
    "title": "Welcome to WeAce!",
    "message": "Thank you for joining our platform",
    "type": "welcome",
    "priority": "normal"
  }'
```

### 2. Get All Notifications
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/notifications
```

### 3. Get User Notifications
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/notifications/user/USER_ID_HERE
```

### 4. Mark Notification as Read
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/NOTIFICATION_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "read": true
  }'
```

## 🔍 Health Check Testing

### 1. Overall Health Check
```bash
# Check if service is healthy
curl http://localhost:3000/api/v1/health
```

### 2. Readiness Check
```bash
# Check if service is ready to accept traffic
curl http://localhost:3000/api/v1/health/ready
```

### 3. Liveness Check
```bash
# Check if service is alive
curl http://localhost:3000/api/v1/health/live
```

### 4. Database Health Check
```bash
# Check database connectivity (included in overall health)
curl http://localhost:3000/api/v1/health | jq '.checks.database'
```

## 🧪 Automated Testing

### 1. Using Postman Collection
1. Import `docs/WeAce_Microservices.postman_collection.json`
2. Set up environment variables
3. Run the collection

### 2. Using cURL Scripts
```bash
# Test all health endpoints
for port in 3000 3001 3002 3003 3004 3005 3006 3007; do
  echo "Testing health on port $port..."
  curl -s http://localhost:$port/api/v1/health | jq '.status'
done
```

### 3. Using jq for JSON Parsing
```bash
# Extract specific fields from responses
curl -s http://localhost:3000/api/v1/health | jq '.status'
curl -s http://localhost:3000/api/v1/health | jq '.checks.database'
curl -s http://localhost:3000/api/v1/health | jq '.uptime'
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Service Not Responding
```bash
# Check if service is running
docker-compose ps

# Check service logs
docker-compose logs SERVICE_NAME

# Restart service
docker-compose restart SERVICE_NAME
```

#### 2. Database Connection Issues
```bash
# Check database containers
docker-compose logs mysql
docker-compose logs mongo

# Check database connectivity
docker exec -it we-ace-mysql-1 mysql -u root -pAdmin@123 -e "SELECT 1"
```

#### 3. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Kill process using port
sudo kill -9 $(lsof -t -i:3000)
```

#### 4. JWT Token Issues
```bash
# Check token format
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq

# Get new token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Password123!"}'
```

## 📊 Performance Testing

### 1. Load Testing with Apache Bench
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:3000/api/v1/health

# Test API endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users
```

### 2. Response Time Testing
```bash
# Measure response time
time curl -s http://localhost:3000/api/v1/health > /dev/null

# Test with verbose output
curl -w "@curl-format.txt" -o /dev/null -s \
  http://localhost:3000/api/v1/health
```

## 📝 Test Data Management

### 1. Create Test Users
```bash
# Create multiple test users
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/v1/users \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"firstName\": \"Test$i\",
      \"lastName\": \"User$i\",
      \"email\": \"test$i@example.com\",
      \"role\": \"user\"
    }"
done
```

### 2. Clean Up Test Data
```bash
# Delete test users (replace with actual IDs)
for id in "id1" "id2" "id3"; do
  curl -X DELETE http://localhost:3000/api/v1/users/$id \
    -H "Authorization: Bearer $TOKEN"
done
```

## 🎯 Best Practices

### 1. Always Check Health First
```bash
# Before testing any service, check its health
curl http://localhost:3000/api/v1/health
```

### 2. Use Environment Variables
```bash
# Set up environment variables
export BASE_URL="http://localhost:3000"
export TOKEN="your-jwt-token"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/users"
```

### 3. Validate Responses
```bash
# Check response status
curl -w "%{http_code}" -o /dev/null -s http://localhost:3000/api/v1/health

# Validate JSON response
curl -s http://localhost:3000/api/v1/health | jq '.status == "ok"'
```

### 4. Log Requests and Responses
```bash
# Log full request/response
curl -v -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users 2>&1 | tee request.log
```

---

**Happy Testing! 🚀**

For more information, check the individual service documentation at `/api/docs` for each service.

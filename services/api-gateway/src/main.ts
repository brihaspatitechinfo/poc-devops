import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('WeAce API Gateway')
    .setDescription(`
# WeAce Microservices API Documentation

Welcome to the WeAce API Gateway! This is the central entry point for all WeAce microservices.

## Available Services

- **Authentication Service** - User registration, login, and password management
- **User Service** - User profile management and user data
- **Training Service** - Course management, assessments, and learning materials
- **Coaching Service** - Coaching sessions and mentor-mentee relationships
- **Event Service** - Event management and scheduling
- **Engagement Service** - User engagement tracking and analytics
- **Notification Service** - Email, SMS, and push notifications

## Getting Started

1. **Register a new user** using the Authentication service
2. **Login** to get your JWT token
3. **Use the token** in the Authorization header for protected endpoints
4. **Explore the APIs** below to interact with different services

## Authentication

Most endpoints require authentication. Include your JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Sample Data

All endpoints include sample data for testing. You can use these examples to understand the expected request/response formats.

## Health Checks

Each service provides health check endpoints to monitor service status:
- \`GET /api/v1/health\` - API Gateway health
- \`GET /api/v1/auth/health\` - Auth service health
- \`GET /api/v1/users/health\` - User service health
- \`GET /api/v1/training/health\` - Training service health
- \`GET /api/v1/coaching/health\` - Coaching service health
- \`GET /api/v1/events/health\` - Event service health
- \`GET /api/v1/engagement/health\` - Engagement service health
- \`GET /api/v1/notifications/health\` - Notification service health
`)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addTag('Authentication', 'User registration, login, and password management')
    .addTag('Users', 'User profile management and user data')
    .addTag('Training', 'Course management, assessments, and learning materials')
    .addTag('Coaching', 'Coaching sessions and mentor-mentee relationships')
    .addTag('Events', 'Event management and scheduling')
    .addTag('Engagement', 'User engagement tracking and analytics')
    .addTag('Notifications', 'Email, SMS, and push notifications')
    .addTag('Health', 'Service health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Customize Swagger UI options
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: 'WeAce API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API Gateway: http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

FROM node:18-alpine AS runtime
WORKDIR /app

# Copy files prepared by Jenkins
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001

USER nestjs

CMD ["node", "dist/main.js"]

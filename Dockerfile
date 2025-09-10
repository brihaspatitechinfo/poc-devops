FROM node:18-alpine AS runtime
WORKDIR /app
COPY . .
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001 \
  && mkdir -p /app/logs \
  && chown -R nestjs:nodejs /app/logs
USER nestjs
CMD ["node", "dist/main.js"]


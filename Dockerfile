FROM node:18-alpine AS runtime
WORKDIR /app
COPY . .
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001 -G nodejs \
  && mkdir -p /app/logs \
  && chown -R nestjs:nodejs /app/logs \
  && chmod -R 755 /app/logs
USER nestjs
CMD ["node", "main.js"]


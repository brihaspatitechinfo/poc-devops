FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001 -G nodejs

# install tini + su-exec (small helpers)
RUN apk add --no-cache tini su-exec

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# create dir (image-level) as a fallback
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app/logs && chmod 755 -R /app/logs

# copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER nestjs
EXPOSE 3002
HEALTHCHECK ...
ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]
CMD ["node", "dist/main.js"]

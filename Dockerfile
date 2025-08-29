# Multi-stage build for production
FROM node:18-alpine as backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Frontend builder stage
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/public ./public
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache sqlite curl

# Copy backend
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S companion -u 1001 && \
    mkdir -p /data/logs && \
    chown -R companion:nodejs /data /app

# Switch to non-root user
USER companion

# Create data directory structure
RUN mkdir -p /data/logs

# Expose port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8082/health || exit 1

# Start the application
CMD ["node", "src/index.js"]
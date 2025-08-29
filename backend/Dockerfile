# Production Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    sqlite \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY migrations/ ./migrations/
COPY seeds/ ./seeds/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S companion -u 1001

# Create data directory
RUN mkdir -p /data/logs && \
    chown -R companion:nodejs /data

# Switch to non-root user
USER companion

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8081/health || exit 1

# Start the application
CMD ["npm", "start"]
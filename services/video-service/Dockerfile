# Hardened Dockerfile for Video Service
# Security: Non-root user, health checks, multi-stage build

FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache ffmpeg python3 make g++

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# ============================================================================
# Production Image
# ============================================================================
FROM node:20-alpine

# Create non-root user
RUN addgroup -g 10001 appgroup && \
    adduser -u 10001 -G appgroup -D -h /home/appuser appuser

# Install runtime dependencies
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev --frozen-lockfile 2>/dev/null || npm install --omit=dev

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:4000/health || exit 1

# Run application
CMD ["node", "dist/index.js"]

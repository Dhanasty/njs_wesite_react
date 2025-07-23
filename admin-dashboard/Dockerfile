# Multi-stage build for production
FROM node:18-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .env.example .env

# Install dependencies
RUN npm ci --only=production

# Copy backend source code
COPY config/ ./config/
COPY middleware/ ./middleware/
COPY routes/ ./routes/
COPY server.js ./

# Frontend build stage
FROM node:18-alpine AS frontend-builder

# Set working directory for client
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies (use npm install since package-lock.json may not exist)
RUN npm install

# Copy client source code
COPY client/ ./

# Build the React app
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy backend from builder stage
COPY --from=backend-builder --chown=nodejs:nodejs /app ./

# Copy frontend build from builder stage
COPY --from=frontend-builder --chown=nodejs:nodejs /app/client/dist ./client/dist/

# Create uploads directory
RUN mkdir -p uploads/products/thumbnails && \
    chown -R nodejs:nodejs uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
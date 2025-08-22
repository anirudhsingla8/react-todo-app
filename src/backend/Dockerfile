# Use Node.js 20 as the base image
FROM node:20-alpine AS builder

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++ gcc

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install --prefer-offline --no-audit --no-fund

# Copy backend source code
COPY . .

# Build the NestJS backend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache sqlite

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /root/.npm/_cacache

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Expose port 3000
EXPOSE 3000

# Start the NestJS server
CMD ["node", "dist/main.js"]
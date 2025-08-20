# Use Node.js 20 as the base image
FROM node:20-alpine

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app/src/backend

# Copy backend package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install --prefer-offline --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /root/.npm/_cacache

# Copy the backend source code
COPY . .

# Build the NestJS application
RUN npm run build

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 3000
EXPOSE 3000

# Start the NestJS server
CMD ["node", "dist/main.js"]
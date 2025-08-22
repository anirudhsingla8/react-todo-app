# Use Node.js 20 as the base image
FROM node:20-alpine

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install --prefer-offline --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /root/.npm/_cacache

# Copy backend source code
COPY . .

# Build the NestJS backend
RUN npm run build

# Set working directory back to backend
WORKDIR /app

# Expose port 3000
EXPOSE 3000

# Start the NestJS server
CMD ["node", "dist/main.js"]
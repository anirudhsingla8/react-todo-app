# Use Node.js 20 as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies including build tools for sqlite3
RUN apk add --no-cache python3 make g++ && \
    npm install --prefer-offline --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /root/.npm/_cacache

# Copy the rest of the application code
COPY . .

# Expose both frontend (5173) and backend (3000) ports
EXPOSE 5173 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
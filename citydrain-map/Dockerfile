# Build stage
FROM node:18-alpine as build

# Install basic tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
ENV NODE_ENV=development
RUN npm install --verbose

# Copy project files
COPY . .

# Set environment variables and build
ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV CI=true

# Build with verbose logging
RUN npm run build || (cat /root/.npm/_logs/*-debug.log && exit 1)

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add custom nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for logs
RUN mkdir -p /var/log/nginx

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
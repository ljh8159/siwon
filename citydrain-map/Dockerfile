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

# Build with verbose logging and error checking
RUN npm run build || (cat /root/.npm/_logs/*-debug.log && exit 1) && \
    if [ ! -d "build" ] || [ -z "$(ls -A build)" ]; then \
        echo "Error: Build directory is empty or missing!" && \
        exit 1; \
    fi

# Production stage
FROM nginx:alpine

# Create directory for logs
RUN mkdir -p /var/log/nginx

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nginx configuration first
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html/

# Create a verification script
RUN echo '#!/bin/sh\n\
if [ ! -d "/usr/share/nginx/html" ] || [ -z "$(ls -A /usr/share/nginx/html)" ]; then\n\
    echo "Error: Build files are missing in nginx html directory!"\n\
    ls -la /usr/share/nginx/html\n\
    exit 1\n\
fi\n\
\n\
if [ ! -f "/usr/share/nginx/html/index.html" ]; then\n\
    echo "Error: index.html is missing!"\n\
    exit 1\n\
fi\n\
\n\
echo "Content verification passed. Starting nginx..."\n\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start nginx with verification
CMD ["/docker-entrypoint.sh"] 
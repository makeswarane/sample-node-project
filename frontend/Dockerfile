# ---------- STAGE 1: Build Angular App ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full project and build
COPY . .
RUN npm run build 

# ---------- STAGE 2: Serve with NGINX ----------
FROM nginx:alpine

# Copy built Angular files from the builder stage
COPY --from=builder /app/dist/myapp/browser /usr/share/nginx/html

# Copy custom NGINX config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Install dependencies (using Bun is faster if available, but for Docker we'll use npm)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if needed, or just use default
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

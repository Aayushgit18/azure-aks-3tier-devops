FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first (better cache)
COPY package.json package-lock.json ./

# Harden npm against network issues
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install --legacy-peer-deps

# Copy source
COPY . .

# Build Angular (uses local CLI from node_modules)
RUN npm run build

# Runtime image
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-crud /usr/share/nginx/html


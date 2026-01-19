FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli@13 && \
    npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/angular-crud /usr/share/nginx/html
#done

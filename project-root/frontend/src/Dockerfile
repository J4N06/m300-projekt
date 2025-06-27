# frontend/Dockerfile

FROM node:18 as builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Vite nutzt /api als Proxy für Backend-Routen
COPY nginx.conf /etc/nginx/conf.d/default.conf

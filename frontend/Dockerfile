FROM node:16-alpine as builder
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY src ./src
COPY public ./public
COPY .env.docker ./.env
COPY ["tsconfig.json", "vite.config.ts", "index.html", "./"]
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
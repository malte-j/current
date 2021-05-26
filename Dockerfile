FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["./backend/package.json", "./backend/package-lock.json*", "./"]
RUN npm ci
COPY ./backend/src .
CMD ["node", "--experimental-specifier-resolution=node", "./bin/www"]
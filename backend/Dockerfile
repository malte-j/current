FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["./package.json", "./package-lock.json*", "./"]
RUN npm ci
COPY ./src .
ENV DEBUG=service:*,route:*
CMD ["node", "--experimental-specifier-resolution=node", "./bin/www"]
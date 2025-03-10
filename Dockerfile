FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma/ /app/prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3333

CMD npx prisma migrate deploy && node dist/server.js

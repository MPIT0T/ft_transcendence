FROM node:22.18.0-slim

ENV NODE_ENV=dev

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json build.mjs ./
COPY src ./src
COPY public ./public

CMD ["node", "build.mjs"]

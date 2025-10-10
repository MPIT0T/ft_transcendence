FROM node:22.18.0-slim AS base

WORKDIR /app

COPY package.json tsconfig.json postcss.config.js build.mjs ./
COPY src ./src
COPY public ./public

RUN npm install

FROM base AS prod
CMD ["npm", "run", "build"]

FROM base AS dev
CMD ["npm", "run", "dev"]

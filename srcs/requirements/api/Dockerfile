FROM node:22.18.0-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY src/ ./src

EXPOSE 3000

CMD ["node", "src/start.js"]

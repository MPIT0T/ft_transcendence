FROM node:22.18.0-slim

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3

COPY package.json .

RUN npm install

COPY src/ ./src

RUN sqlite3 /src/user/users.sql

CMD ["node", "src/start.js"]

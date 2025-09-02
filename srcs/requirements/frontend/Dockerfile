FROM debian:12

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=22.18.0

# Install build dependencies
RUN apt-get update && apt-get install -y \
    curl \
    xz-utils \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz \
    -o /tmp/node.tar.xz \
    && tar -xf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && rm /tmp/node.tar.xz

RUN node -v && npm -v

WORKDIR /app

# Copy package.json and install dependencies (typescript)
COPY package.json ./
RUN npm install

# Install esbuild for javascript bundling
RUN npm install --save-dev esbuild

# Copy source code and tsconfig
COPY tsconfig.json build.mjs ./
COPY src ./src
COPY public ./public

# Compile TypeScript into JS (default output: ./dist)
RUN node build.mjs

# Copy static assets (index.html)
RUN cp -r public/* dist/

# Expose port if serving via Node/Fastify (optional)
EXPOSE 3006

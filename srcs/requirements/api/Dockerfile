FROM debian:12

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=22.18.0

# Download dependencies
RUN apt-get update && apt-get install -y \
    curl \
    xz-utils \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Download and extract node tarball
RUN curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz \
    -o /tmp/node.tar.xz \
    && tar -xf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && rm /tmp/node.tar.xz

RUN node -v && npm -v

WORKDIR /app

# Copy package and sources
COPY package.json .
COPY src/ ./src

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["node", "src/start.js"]

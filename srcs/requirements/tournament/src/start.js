#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const fastifyFactory = require('fastify');
const AutoLoad = require('@fastify/autoload');

const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const serverAddr = process.env.SERVER_ADDR || '0.0.0.0';
const port = parseInt(process.env.SERVER_PORT || '3002', 10);

let cert, key;
try {
  cert = fs.readFileSync('/run/secrets/tournament_cert');
  key = fs.readFileSync('/run/secrets/tournament_key');
} catch (e) {
  console.error('❌ Unable to read TLS cert/key for tournament service.', e);
  process.exit(1);
}

const fastify = fastifyFactory({
  https: { cert, key, allowHTTP1: true },
  logger: { level: 'warn' }
});

process.on("SIGTERM", () => {
    fastify.close(() => process.exit(0));
})

fastify.register(AutoLoad, { dir: path.join(__dirname, 'plugins') });
fastify.register(AutoLoad, { dir: path.join(__dirname, 'routes') });

fastify.listen({ host: serverAddr, port }).then(addr => {
  console.log(`🚀 Tournament service listening (HTTPS) on ${addr}`);
}).catch(err => { fastify.log.error(err); process.exit(1); });

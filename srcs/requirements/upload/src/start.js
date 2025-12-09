#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const fastifyFactory = require('fastify');
const AutoLoad = require('@fastify/autoload');
const fastifyMultipart = require('@fastify/multipart');
const fastifyStatic = require('@fastify/static');

const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const serverAddr = process.env.SERVER_ADDR || '0.0.0.0';
const port = parseInt(process.env.SERVER_PORT || '3000', 10);

const certPath = '/run/secrets/upload_cert';
const keyPath = '/run/secrets/upload_key';
let cert, key;
try {
  cert = fs.readFileSync(certPath);
  key = fs.readFileSync(keyPath);
} catch (e) {
  console.error('❌ Unable to read TLS cert/key for upload service.', e);
  process.exit(1);
}

const fastify = fastifyFactory({
  https: { cert, key, allowHTTP1: true },
  logger: { level: 'info' }
});

fastify.register(fastifyMultipart, {
  limits: { fileSize: 1000 * 1024 } // 800KB
});

process.on("SIGTERM", () => {
    fastify.close(() => process.exit(0));
})

fastify.register(AutoLoad, { dir: path.join(__dirname, 'plugins') });
fastify.register(AutoLoad, { dir: path.join(__dirname, 'routes') });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'avatars'),
  prefix: '/avatars/',
});

fastify.listen({ host: serverAddr, port }).then(addr => {
  console.log(`API service listening (HTTPS) on ${addr}`);
}).catch(err => { fastify.log.error(err); process.exit(1); });

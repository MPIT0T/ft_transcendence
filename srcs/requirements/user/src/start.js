#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const fastifyFactory = require('fastify');
const AutoLoad = require('@fastify/autoload');

// Load env
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const serverAddr = process.env.SERVER_ADDR || '0.0.0.0';
const port = parseInt(process.env.SERVER_PORT || '3003', 10);

// Read TLS certs from Docker secrets
const certPath = '/run/secrets/user_cert';
const keyPath = '/run/secrets/user_key';
let cert;
let key;
try {
  cert = fs.readFileSync(certPath);
  key = fs.readFileSync(keyPath);
} catch (e) {
  console.error('❌ Unable to read TLS cert or key for user service.', e);
  process.exit(1);
}

const fastify = fastifyFactory({
  https: {
    cert,
    key,
    allowHTTP1: true
  },
  logger: { level: 'warn' }  // 'warn' = only warnings/errors, 'error' = errors only
});

// Autoload plugins & routes (mimic previous CLI behavior)

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins')
});
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes')
});

fastify.listen({ host: serverAddr, port }).then(addr => {
  console.log(`🚀 User service listening (HTTPS) on ${addr}`);
}).catch(err => {
  fastify.log.error(err);
  process.exit(1);
});

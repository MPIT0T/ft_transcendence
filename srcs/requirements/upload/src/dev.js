#!/usr/bin/env node
'use strict';

const path = require('node:path');

// Load environment variables from the parent directory
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const { spawn } = require('child_process');

// Get the server address from environment variable, default to 0.0.0.0
const serverAddr = process.env.SERVER_ADDR || '0.0.0.0';
const port = process.env.SERVER_PORT || '3000';

console.log(`Starting DEV server on ${serverAddr}:${port}`);
console.log(`Using .env file: ${envPath}`);

// Start the fastify server in development mode with watch
const args = ['start', '-w', '-l', 'info', '-P', '-a', serverAddr, '-p', port, 'app.js'];

console.log(`Running: fastify ${args.join(' ')}`);

const child = spawn('npx', ['fastify', ...args], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env }
});

child.on('error', (err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Dev server stopped with code: ${code}`);
  process.exit(code);
});

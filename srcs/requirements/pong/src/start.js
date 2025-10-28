#!/usr/bin/env node
'use strict';

const path = require('node:path');

// Load environment variables from the parent directory
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const { spawn } = require('child_process');

// Get the server address from environment variable, default to 0.0.0.0
const serverAddr = process.env.SERVER_ADDR || '0.0.0.0';
const port = process.env.SERVER_PORT || '3001';

// Start the fastify server with the specified address
const args = ['start', '-l', 'info', '-a', serverAddr, '-p', port, 'app.js'];

const child = spawn('npx', ['fastify', ...args], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env }
});

child.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`📴 Server stopped with code: ${code}`);
  process.exit(code);
});

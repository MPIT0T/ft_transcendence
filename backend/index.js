const path = require('path');
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static');
const fastifyMysql = require('@fastify/mysql');

fastify.register(fastifyMysql, {
  promise: true,
  connectionString: 'mysql://root:password@mariadb/mydb'
});

// Serve static frontend files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'),
  prefix: '/',
  decorateReply: false,
});

// API routes
fastify.register(require('./routes/api'));

// SPA fallback: serve index.html for unknown routes
fastify.setNotFoundHandler((req, reply) => {
  if (req.raw.method === 'GET' && !req.url.startsWith('/api')) {
    return reply.sendFile('index.html');
  }
  reply.status(404).send({ error: 'Not Found' });
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log('Server is running on http://localhost:3000');
});

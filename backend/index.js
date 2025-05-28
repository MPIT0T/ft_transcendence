import Fastify from 'fastify';
import fastifyStatic from "@fastify/static";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __frontendPath = path.resolve(__dirname, 'frontend', 'dist');

console.log(__frontendPath);

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: __frontendPath,
  prefix: '/',
});

fastify.setNotFoundHandler((request, reply) => {
  if (request.raw.method === 'GET' && !request.raw.url.startsWith('/api')) {
    reply.type('text/html').sendFile('index.html');
  } else {
    reply.code(404).send({ error: 'Not found' });
  }
});

// fastify.get('/', async (request, reply) => {
//   return { hello: 'world' };
// })

const start = async () => {
  try {
    const address = await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
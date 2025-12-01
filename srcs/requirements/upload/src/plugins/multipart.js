'use strict';
const fastifyMultipart = require('fastify-multipart');

module.exports = async function (fastify, opts) {
  await fastify.register(fastifyMultipart, {
    limits: { fileSize: 800 * 1024 } // 800KB
  });
};


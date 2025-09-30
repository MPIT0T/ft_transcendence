'use strict'

module.exports = async function(fastify, opts) {
    fastify.get('/', async function(req, rep) {
        return {msg: "qqchose"};
    });
};

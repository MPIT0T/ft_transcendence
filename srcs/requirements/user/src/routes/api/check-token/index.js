'use strict';
const { checkToken } = require("../../../utils.js");
const {errorToken} = require("../../../utils");

async function apiCheckTokenRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //check validity of a token
        const {username} = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        if (errorToken(req.headers['authorization'], username))
            reply.status(400).send({ error: "invalid token" });
        else
            reply.status(200).send({ message: "valid token"});
    });
}

module.exports = apiCheckTokenRoute;
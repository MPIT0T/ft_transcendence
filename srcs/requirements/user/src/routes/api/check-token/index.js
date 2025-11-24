'use strict';
const { checkToken } = require("../../../utils.js");

async function apiCheckTokenRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //check validity of a token
        const { token, username} = req.body || {};
        if (!username || !token) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        if (checkToken(token,  username))
           reply.status(200).send({ message: "valid token"});
        else
           reply.status(400).send({ error: "invalid token" });
    });
}

module.exports = apiCheckTokenRoute;
'use strict';
const fs = require('fs');
const db = require("../../../db.js");
const {errorToken} = require("../../../utils");
const SERVER_SECRET = fs.readFileSync('/run/secrets/server_key', 'utf8').trim(); 

async function apiGetEloRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //send elo from a user via username search
        const { username, secret } = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        if (errorToken(req.headers['authorization'], username))
        {
            return reply.status(401).send({error: "Token manquant ou invalide"});
        }
        if (SERVER_SECRET !== secret)
            return reply.status(401).send({error: "missing credentials"});
        try {
            const stmt = db.prepare('SELECT id FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user)
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            return reply.status(200).send({ id: user.id });
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = apiGetEloRoute;
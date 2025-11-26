'use strict';
const db = require("../../../db.js");
const fs = require('fs');
const SERVER_SECRET = fs.readFileSync('/run/secrets/server_key', 'utf8').trim(); 

async function apiGetEloRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //send elo from a user via db id search
        const { ids, secret } = req.body || {};
        if (!secret || secret !== SERVER_SECRET)
        {
            return reply.status(401).send({error: "server secret needed"});
        }
        if (ids[0] == -1 && ids[1] == -1) {
            return reply.status(400).send({ error: "ids needed" });
        }
        try {
            const stmt = db.prepare('SELECT elo FROM users WHERE id = ?');
            const user1 = stmt.get(ids[0]);
            const user2 = stmt.get(ids[1]);
            if (!user1 || !user2) {
                return reply.status(404).send({ error: "utilisateurs non trouvé" });
            }
            const tab = [];
            tab.push(user1.elo);
            tab.push(user2.elo);
            return reply.status(200).send({ elos: tab});
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = apiGetEloRoute;
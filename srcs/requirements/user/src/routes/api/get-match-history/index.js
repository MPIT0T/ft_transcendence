'use strict';
const db = require("../../../db.js");

async function apiMatchHistoRoute(fastify, options) {

    fastify.post('/get-match-history', async (req, reply) => {
        //send match history from a user via username search
        const {username} = req.body || {};
        if (!username) {
            return reply.status(400).send({error: "nom d'utilisateur requis"});
        }
        try {
            const stmt = db.prepare('SELECT match_history FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({error: "utilisateur non trouvé"});
            }
            return reply.status(200).send({matchHistory: user.match_history});
        } catch (err) {
            return reply.status(500).send({error: 'Erreur serveur'});
        }
    });
}

module.exports = apiMatchHistoRoute;
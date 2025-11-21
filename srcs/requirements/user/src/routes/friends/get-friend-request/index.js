'use strict';
const db = require("../../../db.js");
const { getFriendsFromId } = require("../index.js");
const {checkToken, errorToken} = require("../../../utils");

async function friendRequestRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        // sending all your friends requests
        const { username } = req.body || {};
        if (!username) {
            return reply.status(400).send({error: "nom d'utilisateur requis"});
        }
        if (errorToken(req.headers['authorization'], username))
        {
            return reply.status(401).send({error: "Token manquant ou invalide"});
        }
        try {
            const stmt = db.prepare('SELECT invites_id FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({error: "utilisateur non trouvé"});
            }
            const invitesNames = getFriendsFromId(user.invites_id);
            return reply.status(200).send({invites: invitesNames});
        } catch (err) {
            return reply.status(500).send({error: 'Erreur serveur'});
        }
    });
}

module.exports = friendRequestRoute;
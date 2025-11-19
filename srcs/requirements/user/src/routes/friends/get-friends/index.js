'use strict';
const db = require("../../../db.js");
const { getFriendsFromId, getStatusFromId } = require("../index.js");

async function getFriendsRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        // sending all your friends
        const {username} = req.body || {};
        if (!username) {
            return reply.status(400).send({error: "nom d'utilisateur requis"});
        }
        try {
            const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({error: "utilisateur non trouvé"});
            }
            const friendsNames = getFriendsFromId(user.friends_id);
            const friendsStatus = getStatusFromId(user.friends_id);
            return reply.status(200).send({friends: friendsNames, friendsStatus: friendsStatus});
        } catch (err) {
            return reply.status(500).send({error: 'Erreur serveur'});
        }
    });
}

module.exports = getFriendsRoute;
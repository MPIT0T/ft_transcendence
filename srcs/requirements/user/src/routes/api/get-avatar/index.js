'use strict';
const db = require("../../../db.js");
const {errorToken} = require("../../../utils");

async function apiGetAvatarRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //send elo from a user via username search
        const { username } = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        try {
            const stmt = db.prepare('SELECT avatar FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            }
            return reply.status(200).send({ avatar: user.avatar });
        }
        catch (err) {
            return reply.status(400).send({ error: err.message });
        }
    });
}

module.exports = apiGetAvatarRoute;
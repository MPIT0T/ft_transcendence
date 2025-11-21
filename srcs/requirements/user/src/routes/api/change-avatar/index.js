'use strict';
const db = require("../../../db.js");
const jwt = require('jsonwebtoken');
const privateKey = "secret123123";

async function apiChangeAvatarRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //change avatar in db
        const { username, avatar } = req.body || {};
        if (!username || !avatar) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        try {
            const stmt = db.prepare('UPDATE users SET avatar = ? WHERE username = ?');
            stmt.run(avatar, username);
            const token = jwt.sign(
                { username, avatar: avatar },
                privateKey,
                { expiresIn: '1h' }
            );
            reply.status(200).send({ message: "avatar modifie avec succes", token});
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = apiChangeAvatarRoute;
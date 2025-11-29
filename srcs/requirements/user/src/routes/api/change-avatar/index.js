'use strict';
const db = require("../../../db.js");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../../../utils.js");
const {errorToken} = require("../../../utils");

async function apiChangeAvatarRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //change avatar in db
        const { username, avatar} = req.body || {};
        if (!username || !avatar) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        if (errorToken(req.headers['authorization'], username))
        {
            return reply.status(401).send({error: "Token manquant ou invalide"});
        }
        try {
            const userInfoPrep = db.prepare('SELECT * FROM users WHERE username = ?');
            const userInfo = await userInfoPrep.get(username);
            const stmt = db.prepare('UPDATE users SET avatar = ? WHERE username = ?');
            stmt.run(avatar, username);

            const token = jwt.sign(
                { username, avatar: avatar, elo: userInfo.elo },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            reply.status(200).send({ message: "avatar modifie avec succes", token});
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = apiChangeAvatarRoute;
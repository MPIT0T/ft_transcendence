'use strict';
const db = require("../../../db.js");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../../../utils.js");
const {errorToken} = require("../../../utils");

async function apiChangeUsernameRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //change username in db
        const { username, newUsername} = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        if (errorToken(req.headers['authorization'], username))
        {
            return reply.status(401).send({error: "Token manquant ou invalide"});
        }
        try {
            const prepUserAvatar = db.prepare('SELECT avatar from users where username = ?');
            const getUserAvatar = prepUserAvatar.get(username);
            const stmt = db.prepare('UPDATE users SET username = ? WHERE username = ?');
            stmt.run(newUsername, username);
            const token = jwt.sign(
                { newUsername, avatar: getUserAvatar },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            reply.status(200).send({ message: "avatar modifie avec succes", token});
        }
        catch (err) {
            return reply.status(400).send({ error: err.message });
        }
    });
}

module.exports = apiChangeUsernameRoute;
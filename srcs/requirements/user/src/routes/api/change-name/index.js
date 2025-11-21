'use strict';
const db = require("../../../db.js");
const jwt = require('jsonwebtoken');
const privateKey = "secret123123";

async function apiChangeUsernameRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //change username in db
        const { username, newUsername} = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "missing credentials" });
        }
        try {
            const prepUserAvatar = db.prepare('SELECT avatar from users where username = ?');
            const getUserAvatar = prepUserAvatar.get(username);
            const stmt = db.prepare('UPDATE users SET username = ? WHERE username = ?');
            stmt.run(newUsername, username);
            const token = jwt.sign(
                { newUsername, avatar: getUserAvatar },
                privateKey,
                { expiresIn: '1h' }
            );
            reply.status(200).send({ message: "avatar modifie avec succes", token});
        }
        catch (err) {
            return reply.status(400).send({ error: err.message });
        }
    });
}

module.exports = apiChangeUsernameRoute;
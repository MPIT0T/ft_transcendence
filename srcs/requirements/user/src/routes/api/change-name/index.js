'use strict';
const db = require("../../../db.js");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../../../utils.js");
const {errorToken} = require("../../../utils");
const fs = require('fs');
const SERVER_SECRET = fs.readFileSync('/run/secrets/server_key', 'utf8').trim();

async function apiChangeUsernameRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        //change username in db
        const { username, newUsername} = req.body || {};
        if (!username)
            return reply.status(400).send({ error: "missing credentials" });
        if (errorToken(req.headers['authorization'], username))
            return reply.status(401).send({error: "Token manquant ou invalide"});
        try {
            const prepUserInfo = db.prepare('SELECT * from users where username = ?');
            const allUserInfo = prepUserInfo.get(username);
            const stmt = db.prepare('UPDATE users SET username = ? WHERE username = ?');
            stmt.run(newUsername, username);
            const token = jwt.sign(
                { username: newUsername, avatar: allUserInfo.avatar, elo: allUserInfo.elo},
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            const res = await fetch('https://upload:3000/change-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newUsername, oldUsername: username, secret: SERVER_SECRET}),
            });
            if (!res.ok)
            {
                const resData = await res.json();
                return reply.status(res.status).send({ error: resData.error });
            }
            reply.status(200).send({ message: "nom d'utilisateur modifie avec succes", token});
        }
        catch (err) {
            return reply.status(400).send({ error: err.message });
        }
    });
}

module.exports = apiChangeUsernameRoute;
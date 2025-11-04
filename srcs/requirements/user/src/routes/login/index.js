'use strict'
const db = require("../../db.js");
const bcrypt = require('bcrypt');
const privateKey = "secret123123";
const jwt = require('jsonwebtoken');


function getUserbyUsername(username)
{
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    let user = null;

    user = stmt.get(username);
    return user;
}

async function loginRoute(fastify, options) {
    fastify.post('/', async (request, reply) => {
        const {username, password} = request.body;

        if (!username || !password)
            return reply.status(400).send({ error: 'Missing credentials' });


        const user =  await getUserbyUsername(username);
        if (!user) {
            return reply.status(401).send({ error: 'Invalid username or password' });
        }
        bcrypt.compare(user.password, password, function(err, res) {
        if (err){
            return reply.status(500).send({ error: 'Database error' });
        }
        if (res) {
            const payload = {
                username: username,
                avatar: user.avatar
            };
            const token = jwt.sign(payload, privateKey, {expiresIn: '1h'});
            return reply.send({ success: true, message: 'Connection effectué avec succès !', token});
        } else {
            return reply.status(401).send({ error: 'Invalid username or password' });
        }
        });
    });
}

module.exports = loginRoute;

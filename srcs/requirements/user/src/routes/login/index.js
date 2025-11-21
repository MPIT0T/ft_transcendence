'use strict'
const db = require("../../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {getUserbyUsername, JWT_SECRET} = require("../../utils.js");

async function loginRoute(fastify, options) {

    fastify.post('/', async (req, reply) => {
        const {username, password} = req.body;

        if (!username || !password)
            return reply.status(400).send({ error: 'Missing credentials' });
        if (password === 'gitacc')
            return reply.status(401).send({ error: 'Invalid username or password' });
        const user =  await getUserbyUsername(username);
        if (!user) {
            return reply.status(401).send({ error: 'Invalid username or password'});
        }
        const res = await bcrypt.compare(password, user.password);
        if (res) {
            const token = jwt.sign(
                { username, avatar: user.avatar },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
            const stmt = db.prepare("UPDATE users SET online = ? WHERE id = ?");
            stmt.run(1, user.id);
            return reply.send({
                success: true,
                message: 'Connection effectué avec succès !',
                token
            });
        } else {
            return reply.status(401).send({ error: 'Invalid username or password' });
        }
    });
}

module.exports = loginRoute;

'use strict'
const db = require('./db');

async function loginRoute(fastify, options) {
    fastify.post('/login', async (request, reply) => {
        const { username, password } = request.body;

        if (!username || !password) {
            return reply.status(400).send({ error: 'Missing credentials' });
        }

        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
            if (err) {
                console.error(err);
                return reply.status(500).send({ error: 'Database error' });
            }

            if (!user) {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }
            if (password !== user.password) {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }

            return reply.send({ success: true, message: 'Login successful' });
        });
    });
}

module.exports = loginRoute;
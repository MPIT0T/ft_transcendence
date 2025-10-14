'use strict'
const db = require('../../db');
const bcrypt = require('bcrypt');

async function loginGithub(fastify, options) {
    const {loginToken} = request.body;

    if (!token)
        return reply.status(400).send({ error: 'Missing credentials' });

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            console.error(err);
            return reply.status(500).send({ error: 'Database error' });
        }

        if (!user) {
            return reply.status(401).send({ error: 'Invalid username or password' });
        }
        bcrypt.compare(user.password, password, function(err, res) {
            if (err){
                return reply.status(500).send({ error: 'Database error' });
            }
            if (res) {
                return reply.send({ success: true, message: user.token});
            } else {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }
        });
    });
}

async function loginRoute(fastify, options) {
    fastify.post('/login', async (request, reply) => {
        const {username, password} = request.body;

        if (!username || !password)
            return reply.status(400).send({ error: 'Missing credentials' });

        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
            if (err) {
                console.error(err);
                return reply.status(500).send({ error: 'Database error' });
            }

            if (!user) {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }
            bcrypt.compare(user.password, password, function(err, res) {
            if (err){
                return reply.status(500).send({ error: 'Database error' });
            }
            if (res) {
                return reply.send({ success: true, message: user.token});
            } else {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }
            });
        });
    });
}

module.exports = loginRoute;

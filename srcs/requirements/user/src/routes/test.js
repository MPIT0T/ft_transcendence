'use strict'

const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function payload(username, avatar) {
    this.sub = username;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = Math.floor(Date.now() / 1000) + (60 * 60);
    this.avatar = avatar;
};
async function registerRoute(fastify, options)
{
    fastify.post('/register', async (request, reply) => {
        const {username, password} = request.body;

        if (!username || !password)
            return reply.status(400).send({ error: 'Missing credentials' });
        let payloadObject = new payload(username, "alien.png");
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
            if (err) {
                console.error(err);
                return reply.status(500).send({ error: 'Database error' });
            }
            if (user)
                return reply.status(401).send({ error: 'User already registred' });
        });
        db.run(`INSERT INTO users (username, password, token) VALUES (?, ?, ?)`, [username, password, token], function (err) {
            if (err)
            {
                console.error(err);
                return reply.status(500).send({error: 'Database error'});
            }
        });
        return reply.send({success: true, message: token});
    });
}
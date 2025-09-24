'use strict'
const db = require('./db');

async function loginRoute(fastify, options) {
    fastify.post('/login', async (request, reply) => {
        const { username, password } = request.body;

        if (!username || !password) {
            return reply.status(400).send({ error: 'Missing credentials' });
        }

        const addUser = `INSERT INTO users (username, password) VALUES (?, ?)`;

        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
            if (err) {
                console.error(err);
                return reply.status(500).send({ error: 'Database error' });
            }
            if (user)
            {
                return reply.status(401).send({ error: 'User already registred' });
            }

            db.run(addUser, [username, password], function (err) {
               if (err)
               {
                   console.error(err);
                   return reply.status(500).send({ error: 'Database error' });
               }
            });
            return reply.send({ success: true, message: 'Register successful' });
        });
    });
}

module.exports = loginRoute;
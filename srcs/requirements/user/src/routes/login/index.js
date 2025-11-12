'use strict'
const db = require("../../db.js");
const bcrypt = require('bcrypt');
const privateKey = "secret123123";
const jwt = require('jsonwebtoken');


function getUserbyUsername(username) {
    const stmt = db.prepare(`SELECT *
                             FROM users
                             WHERE username = ?`);
    let user = null;

    user = stmt.get(username);
    return user;
}

function sqliteCurrentTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function loginRoute(fastify, options) {
    fastify.post('/', async (request, reply) => {
        const {username, password} = request.body;

        if (!username || !password)
            return reply.status(400).send({ error: 'Missing credentials' });
        if (password === 'gitacc')
            return reply.status(401).send({ error: 'Invalid username or password' });
        const user =  await getUserbyUsername(username);
        if (!user) {
            return reply.status(401).send({error: 'Invalid username or password'});
        }
        const res = await bcrypt.compare(password, user.password);
        if (res) {
            const token = jwt.sign(
                { username, avatar: user.avatar },
                privateKey,
                { expiresIn: '1h' }
            );

            return reply.send({
                success: true,
                message: 'Connection effectué avec succès !',
                token
            });
        } else {
            return reply.status(401).send({ error: 'Invalid username or password' });
        }
    });

    fastify.post('/ping', async (req, reply) => {
        const updateStmt = db.prepare('UPDATE users SET last_ping = ? WHERE username = ?');
        const result = await updateStmt.run(sqliteCurrentTimestamp(), req.body.username);
        if (result.changes === 0)
            return reply.status(404).send({ error: 'Utilisateur non trouvé' });
        return reply.ok();
    });

}

module.exports = {
    loginRoute,
    getUserbyUsername
};

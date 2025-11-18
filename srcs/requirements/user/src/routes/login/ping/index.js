'use strict'
const db = require("../../../db.js");

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

async function loginPingRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        const updateStmt = db.prepare('UPDATE users SET last_ping = ? WHERE username = ?');
        const result = await updateStmt.run(sqliteCurrentTimestamp(), req.body.username);
        if (result.changes === 0)
            return reply.status(404).send({error: 'Utilisateur non trouvé'});
        return reply.status(200).send({message:'Ok'});
    });
}

let is_started = false;

async function setOnlineRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        if (is_started)
            return reply.status(200).send({message: 'Ok'});
        setInterval(async () => {
        }, 31000);
        is_started = true;
        return reply.status(200).send({message: 'Ok'});
    });
}


module.exports = loginPingRoute;
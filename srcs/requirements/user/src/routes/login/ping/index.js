'use strict'
const db = require("../../../db.js");
const {sqliteCurrentTimestamp} = require("../../../utils.js");

async function loginPingRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        const updateStmt = db.prepare('UPDATE users SET last_ping = ? WHERE username = ?');
        const result = await updateStmt.run(sqliteCurrentTimestamp(), req.body.username);
        if (result.changes === 0)
            return reply.status(404).send({error: 'Utilisateur non trouvé'});
        return reply.status(200).send({message:'Ok'});
    });
}



module.exports = loginPingRoute;
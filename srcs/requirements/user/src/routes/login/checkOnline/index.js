'use strict'
const db = require("../../../db.js");
const {getUserbyId, sqliteCurrentTimestamp} = require("../../../utils.js");

let is_started = false;

async function setOnlineRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        if (is_started)
            return reply.status(200).send({message: 'Ok'});
        setInterval(async () => {
            let user = null;
            for (let i = 0; (user = getUserbyId(i)); i++)
            {
                const msDiff = Math.abs(user.last_ping - sqliteCurrentTimestamp());
                if (msDiff < 30000)
                    user.online = 1;
                else
                    user.online = 0;
                const stmt = db.prepare('UPDATE users SET online = ? WHERE id = ?');
                stmt.run(user.online, user.id);
            }
        }, 10000);
        is_started = true;
        return reply.status(200).send({message: 'Ok'});
    });
}
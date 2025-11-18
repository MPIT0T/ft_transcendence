'use strict';
const db = require("../../../db");

async function inviteRequestRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        // send a friend request
        const { author, invited } = req.body || {};
        if (!author || !invited || author === invited) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        try {
            const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
            const uinvited = stmt.get(invited);
            const uauthor = stmt.get(author);
            if (!uinvited || !uauthor) {
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            }
            let invites = uinvited.invites_id ? uinvited.invites_id.split(',') : [];
            let friends = uinvited.friends_id ? uinvited.friends_id.split(',') : [];
            if (invites.includes(String(uauthor.id)) || friends.includes(String(uauthor.id)))
                return reply.status(403).send({ error: "demande deja envoyée" });
            invites.push(uauthor.id);
            const newInvites = invites.join(',');
            const updateStmt = db.prepare('UPDATE users SET invites_id = ? WHERE id = ?');
            updateStmt.run(newInvites, uinvited.id);
            return reply.status(200).send({"demande envoyée" });
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = inviteRequestRoute;
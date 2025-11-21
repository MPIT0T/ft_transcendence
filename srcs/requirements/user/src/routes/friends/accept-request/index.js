'use strict';
const db = require("../../../db");

async function acceptRequestRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        // accept a friend request
        const { author, accepted } = req.body || {};
        if (!author) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        try {
            const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
            const uaccepted = stmt.get(accepted);
            const uauthor = stmt.get(author);
            if (!uaccepted || !uauthor) {
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            }
            const invites = (uauthor.invites_id || "").split(',').filter(x => x);
            if (!invites.includes(String(uaccepted.id)))
                return reply.status(404).send({error: "l'utilisateur ne vous a pas demandé en ami"})
            uauthor.friends_id += (uauthor.friends_id) ? ("," + uaccepted.id) : uaccepted.id;
            uaccepted.friends_id += (uaccepted.friends_id) ? ("," + uauthor.id) : uauthor.id;
            uauthor.invites_id = uauthor.invites_id.replace(uaccepted.id, "");
            uauthor.invites_id = uauthor.invites_id.replace(",,", ",");
            const updateFriends = db.prepare('UPDATE users SET friends_id = ? WHERE id = ?');
            updateFriends.run(uauthor.friends_id, uauthor.id);
            updateFriends.run(uaccepted.friends_id, uaccepted.id);
            const updateInvited = db.prepare('UPDATE users SET invites_id = ? WHERE id = ?');
            updateInvited.run(uauthor.invites_id, uauthor.id);
            return reply.status(200).send({ message: "demande acceptée" });
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = acceptRequestRoute;
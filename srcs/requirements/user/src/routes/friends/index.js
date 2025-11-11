'use strict';
const db = require("../../db.js");

function getUserFromId(friendsIds) {
	const friendsNames = [];
	const stmt = db.prepare('SELECT username FROM users WHERE id = ?');
	
	for (const id of friendsIds) {
		const user = stmt.get(id);
		if (user) {
			friendsNames.push(user.username);
		}
	}
	return friendsNames;
}

async function friendsHandling(fastify, options) {
	fastify.post('/get_friend_request', async (req, reply) => {
    // sending all your friends requests
		const { username } = req.body || {};
		if (!username) {
			return reply.status(400).send({ error: "nom d'utilisateur requis" });
		}
		try {
			const stmt = db.prepare('SELECT invites_id FROM users WHERE username = ?');
			const user = stmt.get(username);
			if (!user) {
				return reply.status(404).send({ error: "utilisateur non trouvé" });
			}
			const invites = JSON.parse(user.invites_id);
			const invitesNames = await getUserFromId(invites);
			return reply.status(200).send({ invites: invitesNames });
		}
		catch (err) {
			return reply.status(500).send({ error: 'Erreur serveur' });
		}
  });

	fastify.post('/get_friends', async (req, reply) => {
		// sending all your friends
		const { username } = req.body || {};
		if (!username) {
			return reply.status(400).send({ error: "nom d'utilisateur requis" });
		}
		try {
			const stmt = db.prepare('SELECT friends_id FROM users WHERE username = ?');
			const user = stmt.get(username);
			if (!user) {
				return reply.status(404).send({ error: "utilisateur non trouvé" });
			}
			const friends = JSON.parse(user.friends_id);
			const friendsNames = await getUserFromId(friends);
			return reply.status(200).send({ friends: friendsNames });
		}
		catch (err) {
			return reply.status(500).send({ error: 'Erreur serveur' });
		}
  });

	fastify.post('/invite_request', async (req, reply) => {
		// send a friend request
		const { author, invited } = req.body || {};
		if (!author) {
			return reply.status(400).send({ error: "nom d'utilisateur requis" });
		}
		try {
			const stmt = db.prepare('SELECT friends_id FROM users WHERE username = ?');
			const uinvited = stmt.get(invited);
			const uauthor = stmt.get(author);
			if (!uinvited || !uauthor) {
				return reply.status(404).send({ error: "utilisateur non trouvé" });
			}
			const invites = JSON.parse(uinvited.invites_id);
			if (invites.includes(author)) {
				return reply.status(400).send({ error: "demande déjà envoyée" });
			}
			invites.push(author);
			const updateStmt = db.prepare('UPDATE users SET invites_id = ? WHERE username = ?');
			updateStmt.run(JSON.stringify(invites), invited);
			return reply.status(200).send({ message: "demande envoyée" });
		}
		catch (err) {
			return reply.status(500).send({ error: 'Erreur serveur' });
		}
  });
}

module.exports = friendsHandling;
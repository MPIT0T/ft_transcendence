/*
'use strict';
const db = require("../../db.js");
const { getUserbyUsername } = require("../login");

function create_matchHistory(is_winner, scores, second)
{
    return {
        "Winner": is_winner,
        "Score": scores,
        "Versus": second,
    };
}

async function apiUserRoute(fastify, options) {

    fastify.post('/post-match', async (req, reply) => {
        //set all post matches info like elo and match history
        const {usernames, winner, scores} = req.body || {};

        if (!usernames || !scores)
            return reply.status(400).send({error: 'Missing credentials'});
        const userWinner = await getUserbyUsername(usernames[winner]);
        const userLooser = await getUserbyUsername(usernames[1 - winner]);
        if (!userWinner || !userLooser)
            return reply.status(400).send({ error: 'Account not found' });
        userWinner.match_history = userWinner.match_history || "";
        userLooser.match_history = userLooser.match_history || "";
        userWinner.match_history += JSON.stringify(create_matchHistory(true, scores, userLooser.username)) + '\n';
        userLooser.match_history += JSON.stringify(create_matchHistory(false, scores, userWinner.username)) + '\n';
        const updateMatchH = db.prepare('UPDATE users SET match_history = ? WHERE id = ?');
        updateMatchH.run(userWinner.match_history, userWinner.id);
        updateMatchH.run(userLooser.match_history, userLooser.id);
        const updateElo = db.prepare('UPDATE users SET elo = ? WHERE id = ?');
        updateElo.run(userWinner.elo, userWinner.id);
        updateElo.run(userLooser.elo, userLooser.id);
        return reply.status(200).send({ message: "demande envoyée" });
    });

    fastify.post('/get-match-history', async (req, reply) => {
        //send match history from a user via username search
        const { username } = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        try {
            const stmt = db.prepare('SELECT match_history FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            }
            return reply.status(200).send({ matchHistory: user.match_history });
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });

    fastify.post('/get-elo', async (req, reply) => {
        //send elo from a user via username search
        const { username } = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        try {
            const stmt = db.prepare('SELECT elo FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            }
            return reply.status(200).send({ elo: user.elo });
        }
        catch (err) {
            return reply.status(500).send({ error: 'Erreur serveur' });
        }
    });
}

module.exports = apiUserRoute;
*/
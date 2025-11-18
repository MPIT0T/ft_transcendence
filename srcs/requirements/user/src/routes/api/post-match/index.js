'use strict';
const db = require("../../../db.js");
const { getUserbyUsername } = require("../../../utils.js");

function create_matchHistory(is_winner, scores, second, elo)
{
    return {
        "Winner": is_winner,
        "Score": scores,
        "Versus": second,
        "Elo": elo,
    };
}

function calculElo(winner, looser)
{
    let k = 40;

    if ((winner.elo + looser.elo) / 2 > 2500)
        k = 30;
    const Ea = 1 / (1 + Math.pow(10, (looser.elo - winner.elo) / 400));
    winner.elo = winner.elo + k * (1 - Ea);
    looser.elo = looser.elo + k * (Ea - 1);
}

async function apiPostMatchRoute(fastify, options) {
    fastify.post('/', async (req, reply) => {
        //set all post matches info like elo and match history
        const {usernames, winner, scores} = req.body || {};

        if (!usernames || !scores)
            return reply.status(400).send({error: 'Missing credentials'});
        const userWinner = await getUserbyUsername(usernames[winner - 1]);
        const userLooser = await getUserbyUsername(usernames[2 - winner]);
        if (!userWinner || !userLooser)
            return reply.status(400).send({ error: 'Account not found' });
        userWinner.match_history = userWinner.match_history || "";
        userLooser.match_history = userLooser.match_history || "";
        await calculElo(userWinner, userLooser);
        userWinner.match_history += JSON.stringify(create_matchHistory(true, scores, userLooser.username, userWinner.elo)) + '\n';
        userLooser.match_history += JSON.stringify(create_matchHistory(false, scores, userWinner.username, userLooser.elo)) + '\n';
        const updateMatchH = db.prepare('UPDATE users SET match_history = ? WHERE id = ?');
        updateMatchH.run(userWinner.match_history, userWinner.id);
        updateMatchH.run(userLooser.match_history, userLooser.id);
        const updateElo = db.prepare('UPDATE users SET elo = ? WHERE id = ?');
        updateElo.run(userWinner.elo, userWinner.id);
        updateElo.run(userLooser.elo, userLooser.id);
        return reply.status(200).send({ message: "demande envoyée" });
    });
}

module.exports = apiPostMatchRoute;
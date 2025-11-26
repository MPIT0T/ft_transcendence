'use strict';
const fs = require('fs');
const db = require("../../../db.js");
const { getUserbyId } = require("../../../utils.js");
const SERVER_SECRET = fs.readFileSync('/run/secrets/server_key', 'utf8').trim(); 

function create_matchHistory(is_winner, scores, second_id, gamemode, duration)
{
    const score = scores.player1 + '-' + scores.player2;

    return {
        "winner": is_winner,
        "score": score,
        "versus": second_id,
        "gamemode": gamemode,
        "date": new Date(Date.now()).toLocaleString('fr-FR'),
        "duration": duration,
    };
}

async function calculElo(winner, looser)
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
        const {ids, winner, scores, gameMode, secret, duration} = req.body || {};

        if (!gameMode || SERVER_SECRET !== secret)
            return reply.status(400).send({error: 'Missing credentials'});

        let userWinner;
        let userLooser;

        try {
            userWinner = await getUserbyId(ids[winner - 1]);
            userLooser = await getUserbyId(ids[2 - winner]);
        }
        catch (e)
        {
            return reply.status(404).send({error: 'winner: ' + ids[winner - 1] + ' looser: '+ids[2 - winner] + ' user not found'});
        }
        try {
            if (!userWinner || !userLooser)
                return reply.status(400).send({ error: 'Account not found' });
            userWinner.match_history = userWinner.match_history || "";
            userLooser.match_history = userLooser.match_history || "";
            if (gameMode === 'ranked')
                await calculElo(userWinner, userLooser);
            userWinner.match_history += JSON.stringify(create_matchHistory(true, scores, userLooser.id, gameMode, duration)) + '\n';
            userLooser.match_history += JSON.stringify(create_matchHistory(false, scores, userWinner.id, gameMode, duration)) + '\n';
            const updateMatchH = db.prepare('UPDATE users SET match_history = ? WHERE id = ?');
            updateMatchH.run(userWinner.match_history, userWinner.id);
            updateMatchH.run(userLooser.match_history, userLooser.id);
            const updateElo = db.prepare('UPDATE users SET elo = ? WHERE id = ?');
            updateElo.run(userWinner.elo, userWinner.id);
            updateElo.run(userLooser.elo, userLooser.id);
            return reply.status(200).send({ message: "demande envoyée" });
        } catch (e)
        {
            return reply.status(500).send({ error: e.message });
        }
    });
}

module.exports = apiPostMatchRoute;
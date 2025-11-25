'use strict';
const db = require("../../../db.js");
const {errorToken} = require("../../../utils");

function getUserInfoMatch(match) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const getInfoSecondPlayer = stmt.get(match.versus);

    if (!getInfoSecondPlayer) {
        return {
            winner: match.winner,
            score: match.score,
            versus: "undifined",
            gamemode: match.gamemode,
            date: match.date,
            avatar: "anonymous.png",
            duration: match.duration,
        };
    }

    return {
        winner: match.winner,
        score: match.score,
        versus: getInfoSecondPlayer.username,
        gamemode: match.gamemode,
        date: match.date,
        avatar: getInfoSecondPlayer.avatar,
        duration: match.duration
    };
}

async function apiMatchHistoRoute(fastify, options) {
    
    fastify.post('/', async (req, reply) => {
        const { username } = req.body || {};
        if (!username) {
            return reply.status(400).send({ error: "nom d'utilisateur requis" });
        }
        if (errorToken(req.headers['authorization'], username)) {
            return reply.status(401).send({ error: "Token manquant ou invalide" });
        }

        try {
            const stmt = db.prepare('SELECT match_history FROM users WHERE username = ?');
            const user = stmt.get(username);
            if (!user) {
                return reply.status(404).send({ error: "utilisateur non trouvé" });
            }
            if (!user.match_history)
                return reply.status(200).send({matchHistory: null});
            const parseMatchHisto = user.match_history
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => {
                    try {
                        const match = JSON.parse(line);
                        return getUserInfoMatch(match);
                    } catch (e) {
                        console.error('Failed to parse matchHistory entry:', line, e);
                        return null;
                    }
                })
                .filter(entry => entry !== null);
            return reply.status(200).send({ matchHistory: parseMatchHisto });
        } catch (err) {
            return reply.status(500).send({ error: err.message });
        }
    });
}

module.exports = apiMatchHistoRoute;
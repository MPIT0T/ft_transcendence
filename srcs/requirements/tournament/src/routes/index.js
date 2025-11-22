'use strict'
const Games = require('./games');

const g_Games = new Games();

module.exports = async function (fastify, opts) {

	await fastify.register(require('@fastify/websocket'));


	fastify.register(async function (fastify) {

		fastify.get('/ws', { websocket: true }, (socket, request) => {

			const clientId = g_Games.createClient(socket)

			socket.on('message', async (message) => {
				try {
					const data = JSON.parse(message.toString());
					switch (data.method) {
						case 'user':
							await handleUser(socket, data);
							break;
						case 'tournaments':
							await handleGetTournaments(socket, data);
							break;
						case 'readyT':
							await handleReadyTournament(socket, data);
							break;
						case 'joinT':
							await handleJoinTournament(socket, data);
							break;
						case 'createT':
							await handleCreateTournaments(socket, data);
							break;
						case 'moveT':
							await handleTournamentMove(socket, data);
							break;
						case 'leave':
							leave(clientId);
							break;
						default:
							socket.send(JSON.stringify({
								method: 'error',
								message: 'Unknown method: ' + data.method
							}));
					}
				} catch (error) {
					console.error('Error handling message:', error);
					socket.send(JSON.stringify({
						method: 'error',
						message: error.message || error.toString() || 'Invalid JSON format'
					}));
				}
			});



			socket.on('error', (error) => {
				console.error('WebSocket error for client', clientId, error);
			});

			socket.on('close', (code, reason) => {
				removeClient(clientId);
				console.log('Client disconnected:', clientId);
			});
		});

	});
}

function removeClient(clientId) {

	const client = g_Games.findClient(clientId);
	if (!client) {
		return;
	}

	g_Games._tournaments.removeClientsTournament(clientId);
	g_Games.removeClient(clientId);

}

function leave(clientId) {

	const client = g_Games.findClient(clientId);
	if (!client) {
		return;
	}

	g_Games._tournaments.removeClientsTournament(clientId);

}

function getEloFromJwt(token) {

	if (!token) {
		return 0;
	}
	const payloadBase64 = token.split('.')[1];
	const payloadJson = atob(payloadBase64);
	const payload = JSON.parse(payloadJson);
	return payload.elo;
}

function handleUser(socket, data) {
	const client = g_Games.findClient(data.clientId);
	if (client === undefined)
		throw "Client id not good";
	client._token = data.token;
	client._elo = getEloFromJwt(data.token);
	client._name = data.username;
}



function handleGetTournaments(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";

	const availableTournaments = Object.values(g_Games._tournaments._tournaments)
		.filter(tournament => tournament.clients.length < 8)
		.filter(tournament => tournament.state === "waiting")
		.map(tournament => ({
			tournamentId: tournament.tournamentId,
			tournamentName: tournament.tournamentName,
			players: `${tournament.clients.length}/8`,
			gameMode: tournament.gameMode,
			gamePoint: tournament.gamePoint
		}));

	socket.send(JSON.stringify({
		method: 'tournaments',
		tournaments: availableTournaments
	}));
}

async function handleJoinTournament(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";
	const tournament = g_Games.findTournament(data.tournamentId);

	if (tournament.clients.length >= 8) {
		socket.send(JSON.stringify({
			method: 'joinT',
			status: 'error',
			message: 'Failed to join the tournament.'
		}));
		return;
	}

	const tournaments = Object.values(g_Games._tournaments._tournaments);
	for (const t of tournaments) {
		const clientIndex = t.clients.findIndex(c => c._clientId === data.clientId);
		if (clientIndex !== -1) {
			socket.send(JSON.stringify({
				method: 'joinT',
				status: 'error',
				message: 'Client already in a tournament'
			}));
			return;
		}
	}

	tournament.join(g_Games.findClient(data.clientId), socket);
}

function handleCreateTournaments(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";

	const tournaments = Object.values(g_Games._tournaments._tournaments);
	for (const tournament of tournaments) {
		const clientIndex = tournament.clients.findIndex(c => c._clientId === data.clientId);
		if (clientIndex !== -1) {
			socket.send(JSON.stringify({
				method: 'joinT',
				status: 'error',
				message: 'Client already in the tournament'
			}));
			return;
		}
	}

	g_Games.createTournament(socket, data.gameMode, data.gamePoint, data.tournamentName);
}

function handleTournamentMove(socket, data) {
	// Trouver le tournoi qui contient cette room
	// g_Games._tournaments est l'objet Tournaments, qui contient _tournaments (les tournois)
	const tournamentsObj = g_Games._tournaments._tournaments || {};
	let tournament = null;

	// Parcourir tous les tournois pour trouver celui qui contient cette room
	for (const tournamentId in tournamentsObj) {
		const t = tournamentsObj[tournamentId];
		if (t.rooms && t.rooms.findRoom(data.roomId)) {
			tournament = t;
			break;
		}
	}

	if (!tournament) {
		console.error('Tournament not found for room:', data.roomId);
		return;
	}

	tournament.handleMove(socket, data);
}

async function handleReadyTournament(socket, data) {
	const client = g_Games.findClient(data.clientId);
	const tournament = g_Games.findTournament(data.tournamentId);

	// Ignorer silencieusement si le client ou tournoi n'existe plus
	if (!client || !tournament) {
		return;
	}

	const state = data.state;

	if (state === 1) {
		client.isReady = true;
	} else {
		client.isReady = false;
	}

	await tournament.updatePlayerR(state);

}

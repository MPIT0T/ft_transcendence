'use strict'
const Games = require('./games');
const { SERVER_SECRET } = require('./config.js');

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
		fastify.get('/status', function handler(request, reply) {
			reply.code(200).header('Content-Type', 'text/plain').send('OK');
		});
		fastify.get('/statusPlayer', function handler(request, reply) {
			reply.code(200).header('Content-Type', 'text/plain').send(getPlayer());
		});
	});
}

function getPlayer() {
	return Object.keys(g_Games._clients._clients).length.toString();
}

function removeClient(clientId) {

	const client = g_Games.findClient(clientId);
	if (!client) {
		return;
	}

	g_Games._tournaments.removeClientsTournament(clientId);
	g_Games.removeClient(clientId);

}

function checkClient(clientId, socket) {

	const client = g_Games.findClient(clientId);
	if (!client)
		return false;
	if (client._conection !== socket)
		return false;
	return true;
}

function leave(clientId) {

	const client = g_Games.findClient(clientId);
	if (!client) {
		return;
	}

	g_Games._tournaments.removeClientsTournament(clientId);

}

function isClientInAnyRoom(clientId) {
	const tournaments = Object.values(g_Games._tournaments._tournaments);
	const joiningClient = g_Games.findClient(clientId);
	for (const tournament of tournaments) {
		if (tournament.clients.some(c => c._clientId === clientId && c.isActive === true) || 
			tournament.clients.some(c => c._dbId === joiningClient?._dbId && c.isActive === true)) {
			return true;
		}
	}
	return false;
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

async function getDbId(username, token) {
	let dbId = null;

	const bodyPayload = { username, secret: SERVER_SECRET };

	try {
		const res = await fetch('https://user_handling:3003/api/get-id-server', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(bodyPayload),
		});

		const bodyText = await res.text().catch(() => '');

		if (!res.ok) {
			console.log('getDbId - error response:', {
				status: res.status,
				statusText: res.statusText,
				body: bodyText,
				username
			});
		} else {
			try {
				const parsed = JSON.parse(bodyText);
				dbId = parsed.id || parsed.dbId || parsed.userId || null;
			} catch (parseErr) {
				console.log('getDbId - JSON parse error:', parseErr);
			}
		}
	} catch (err) {
		console.log('getDbId - fetch error:', err);
	}

	return dbId;
}

async function handleUser(socket, data) {
	const client = g_Games.findClient(data.clientId);
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";
	client._token = data.token || null;
	client._elo = getEloFromJwt(data.token);
	client._name = data.username || null;
	// Only fetch dbId if username is provided
	if (data.username) {
		client._dbId = await getDbId(data.username, data.token);
	} else {
		client._dbId = null;
	}
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


	if (isClientInAnyRoom(data.clientId)) {
		socket.send(JSON.stringify({
			method: 'joinT',
			status: 'error',
			message: 'Client already in a tournament'
		}));
		return;
	}



tournament.join(g_Games.findClient(data.clientId), socket);
}

function handleCreateTournaments(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";

		if (isClientInAnyRoom(data.clientId)) {
			socket.send(JSON.stringify({
				method: 'joinT',
				status: 'error',
				message: 'Client already in the tournament'
			}));
			return;
		}

	g_Games.createTournament(socket, data.gameMode, data.gamePoint, data.tournamentName);
}

function handleTournamentMove(socket, data) {
	const tournamentsObj = g_Games._tournaments._tournaments || {};
	let tournament = null;

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

	if (!checkClient(data.clientId, socket) || !tournament) {
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

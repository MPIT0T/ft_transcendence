'use strict'
const Games = require('./games');

const g_Games = new Games();

module.exports = async function (fastify, opts) {
	// Route WebSocket pour le jeu Pong

	await fastify.register(require('@fastify/websocket'));


	fastify.register(async function (fastify) {

		fastify.get('/ws', { websocket: true }, (socket, request) => {

			const clientId = g_Games.createClient(socket)

			socket.on('message', (message) => {
				try {
					const data = JSON.parse(message.toString());
					switch (data.method) {
						case 'rooms':
							handleGetRooms(socket, data);
							break;
						case 'tournaments':
							handleGetTournaments(socket, data);
							break;
						case 'ready':
							handleReady(socket, data);
							break;
						case 'readyT':
							handleReadyTournament(socket, data);
							break;
						case 'join':
							handleJoinGame(socket, data);
							break;
						case 'joinT':
							handleJoinTournament(socket, data);
							break;
					case 'createR':
						handleCreateRoom(socket, data);
						break;
					case 'createT':
						handleCreateTournaments(socket, data);
						break;
					case 'move':
						handleGameMove(socket, data);
						break;
					case 'moveT':
						handleTournamentMove(socket, data);
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

function removeClient(clientId) {

	const client = g_Games.findClient(clientId);
	if (!client) {
		return;
	}

	if (g_Games.isClientInMatchMaking(clientId)) {
		g_Games.removeClientsList(client);
	}

	const rooms = Object.values(g_Games._rooms._rooms);
	for (const room of rooms) {
		const clientIndex = room.clients.findIndex(c => c._clientId === clientId);
		if (clientIndex !== -1) {
			room.clients.splice(clientIndex, 1);
			if (room.clients.length === 0) {
				g_Games.removeRoom(room.roomId);
			}
			break;
		}
	}

	g_Games.removeClient(clientId);
}

function getPlayer() {
	return Object.keys(g_Games._clients._clients).length.toString();
}

function leave(clientId) {

	const client = g_Games.findClient(clientId);
	if (!client) {
		return;
	}

	if (g_Games.isClientInMatchMaking(clientId)) {
		g_Games.removeClientsList(client);
	}

	const rooms = Object.values(g_Games._rooms._rooms);
	for (const room of rooms) {
		const clientIndex = room.clients.findIndex(c => c._clientId === clientId);
		if (clientIndex !== -1) {
			room.clients.splice(clientIndex, 1);
			if (room.clients.length === 0) {
				g_Games.removeRoom(room.roomId);
			}
			break;
		}
	}
}


function handleGetRooms(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";

	const availableRooms = Object.values(g_Games._rooms._rooms)
		.filter(room => room.clients.length < 2)
		.filter(room => room.state === "waiting")
		.map(room => ({
			roomId: room.roomId,
			roomName: room.roomName,
			players: `${room.clients.length}/2`,
			gameMode: room.gameMode,
			gamePoint: room.gamePoint
		}));

	socket.send(JSON.stringify({
		method: 'rooms',
		rooms: availableRooms
	}));
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

function handleJoinTournament(socket, data) {
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

async function handleJoinGame(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";
	const roomId = data.roomId;

	if (roomId === "ranked") {

		if (g_Games.isClientInMatchMaking(data.clientId)) {
			socket.send(JSON.stringify({
				method: 'join',
				status: 'error',
				message: 'Already in matchmaking'
			}));
			return;

		}
		g_Games.createWaitingP(g_Games.findClient(data.clientId));
		await g_Games.matchMaquing();

		return;
	}

	if (g_Games.findRoom(data.roomId) === undefined)
		throw "Room id not good";

	const room = g_Games.findRoom(data.roomId);

	if (room.clients.length >= 2) {
		socket.send(JSON.stringify({
			method: 'join',
			status: 'error',
			message: 'Failed to join the game room.'
		}));
		return;
	}

	const rooms = Object.values(g_Games._rooms._rooms);
	for (const room of rooms) {
		const clientIndex = room.clients.findIndex(c => c._clientId === data.clientId);
		if (clientIndex !== -1) {
			socket.send(JSON.stringify({
				method: 'join',
				status: 'error',
				message: 'Client already in a room'
			}));
			return;
		}
	}

	room.join(g_Games.findClient(data.clientId), socket);
}

function handleCreateRoom(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";

	const rooms = Object.values(g_Games._rooms._rooms);
	for (const room of rooms) {
		const clientIndex = room.clients.findIndex(c => c._clientId === data.clientId);
		if (clientIndex !== -1) {
			socket.send(JSON.stringify({
				method: 'join',
				status: 'error',
				message: 'Client already in the room'
			}));
			return;
		}
	}

	g_Games.createRoom(socket, data.gameMode, data.gamePoint, data.roomName);
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

function handleGameMove(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";
	const room = g_Games.findRoom(data.roomId)
	if (room === undefined)
		throw "Room id not good";
	room.updatePlayer(socket, data);
}

async function handleReady(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";
	if (g_Games.findRoom(data.roomId) === undefined)
		throw "Room id not good";

	const state = data.state;

	const room = g_Games.findRoom(data.roomId);

	await room.updatePlayerR(state);

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
	if (g_Games.findClient(data.clientId) === undefined)
		throw "Client id not good";
	if (g_Games.findTournament(data.tournamentId) === undefined)
		throw "Tournament id not good";

	const state = data.state;

	const tournament = g_Games.findTournament(data.tournamentId);

	await tournament.updatePlayerR(state);

}

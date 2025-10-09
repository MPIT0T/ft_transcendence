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
						case 'ready':
							handleReady(socket, data);
							break;
						case 'join':
							handleJoinGame(socket, data);
							break;
						case 'create':
							handleCreateRoom(socket, data);
							break;
						case 'move':
							handleGameMove(socket, data);
							break;
						default:
							socket.send(JSON.stringify({
								method: 'error',
								message: 'Unknown method: ' + data.method
							}));
					}
				} catch (error) {
					socket.send(JSON.stringify({
						method: 'error',
						message: 'Invalid JSON format'
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
		console.log('Client not found:', clientId);
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
	// if (room.clients.some(client => client._clientId === data.clientId)) {
	// 	socket.send(JSON.stringify({
	// 		method: 'join',
	// 		status: 'error',
	// 		message: 'Client already in the room'
	// 	}));
	// 	return;
	// }

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

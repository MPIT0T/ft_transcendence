'use strict'
const Games = require('./games');
const { SERVER_SECRET } = require('./config.js');

const g_Games = new Games();



module.exports = async function (fastify, opts) {
	// Route WebSocket pour le jeu Pong

	await fastify.register(require('@fastify/websocket'));


	fastify.register(async function (fastify) {

		fastify.get('/ws', { websocket: true }, (socket, request) => {

			const clientId = g_Games.createClient(socket)

			socket.on('message', async (message) => {
				try {
					const data = JSON.parse(message.toString());
					switch (data.method) {
						case 'page':
							await handleChangePage(socket, data);
							break;
						case 'user':
							await handleUser(socket, data);
							break;
						case 'rooms':
							await handleGetRooms(socket, data);
							break;
						case 'friends':
							await handleGetFriends(socket, data);
							break;
						case 'challenge':
							await handleChallenge(socket, data);
							break;
						case 'invite':
							await handleInvite(socket, data);
							break;
						case 'ready':
							await handleReady(socket, data);
							break;
						case 'join':
							await handleJoinGame(socket, data);
							break;
						case 'createR':
							await handleCreateRoom(socket, data);
							break;
						case 'move':
							await handleGameMove(socket, data);
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

function checkClient(clientId, socket) {

	const client = g_Games.findClient(clientId);
	if (!client)
		return false;
	if (client._conection !== socket)
		return false;
	return true;
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

function getEloFromJwt(token) {

	if (!token) {
		return 0;
	}
	const payloadBase64 = token.split('.')[1];
	const payloadJson = atob(payloadBase64);
	const payload = JSON.parse(payloadJson);
	return payload.elo;
}

function handleChangePage(socket, data) {
	const client = g_Games.findClient(data.clientId);
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";

	client._currentPage = data.currentPage || null;
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
	client._dbId = await getDbId(data.username, data.token);
}

function isClientInAnyRoom(clientId) {
	const rooms = Object.values(g_Games._rooms._rooms);
	const joiningClient = g_Games.findClient(clientId);
	for (const room of rooms) {
		if (room.clients.some(c => c._clientId === clientId) || room.clients.some(c => c._dbId === joiningClient?._dbId)) {
			return true;
		}
	}
	if (g_Games.isClientInMatchMaking(clientId))
		return true;
	return false;
}

async function handleGetFriends(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";

	const client = g_Games.findClient(data.clientId);
	const token = client?._token;
	const username = client?._name;

	const bodyPayload = { username };

	let friendsList = [];

	try {
		const res = await fetch('https://user_handling:3003/friends/get-friends', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(bodyPayload),
		});

		const bodyText = await res.text().catch(() => '');

		if (!res.ok) {
			console.log('handleGetFriends - error response:', {
				status: res.status,
				statusText: res.statusText,
				body: bodyText,
				clientId: data.clientId
			});
		} else {
			try {
				const parsed = JSON.parse(bodyText);
				// parsed.friends = [{ username: "Max" }, ...]
				if (Array.isArray(parsed.friends)) {
					friendsList = parsed.friends.map(f => f.username);
				}
			} catch (parseErr) {
				// console.log('handleGetFriends - JSON parse error:', parseErr);
			}
		}
	} catch (err) {
		console.log('handleGetFriends - fetch error:', err);
	}

	const onlineFriends = Object.values(g_Games._clients._clients)
		.filter(c => c._clientId !== data.clientId)
		.filter(c => friendsList.includes(c._name))
		.filter(c => !isClientInAnyRoom(c._clientId))
		.filter(c => c._currentPage === 'gameRoom')
		.map(c => ({
			username: c._name,
			elo: c._elo,
			online: true
		}));

	socket.send(JSON.stringify({
		method: 'friends',
		friends: onlineFriends
	}));
}

function handleGetRooms(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";

	const availableRooms = Object.values(g_Games._rooms._rooms)
		.filter(room => room.clients.length < 2)
		.filter(room => room.state === "waiting")
		.filter(room => room.gameMode === "1V1")
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

function handleChallenge(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";

	if (isClientInAnyRoom(data.clientId)) {
		socket.send(JSON.stringify({
			method: 'join',
			status: 'error',
			message: 'Client already in a room'
		}));
		return;
	}

	const points = (typeof data.gamePoint === 'number') ? data.gamePoint : parseInt(data.gamePoint, 10) || 8;
	const roomId = g_Games.createRoom(null, "challenge", points, "challenge");
	const room = g_Games.findRoom(roomId);

	const challenger = g_Games.findClient(data.clientId);
	room.join(challenger, challenger._conection);

	// Friend by name
	const friendClient = g_Games.findClientName(data.friend);
	if (!friendClient) {
		if (challenger._conection && typeof challenger._conection.send === 'function') {
			challenger._conection.send(JSON.stringify({
				method: 'challenge',
				status: 'error',
				message: 'Friend not found'
			}));
		}
		return;
	}

	const payLoad = {
		method: 'challenge',
		roomId: roomId,
		from: challenger._name
	};

	if (friendClient._conection && typeof friendClient._conection.send === 'function') {
		friendClient._conection.send(JSON.stringify(payLoad));
	}
}


function handleInvite(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";
	const roomId = data.roomId;

	if (g_Games.findRoom(data.roomId) === undefined)
		throw "Room id not good";

	const room = g_Games.findRoom(data.roomId);

	if (data.response === 'yes') {
		const joiningClient = g_Games.findClient(data.clientId);
		if (!joiningClient) {
			throw 'Joining client not found';
		}
		if (isClientInAnyRoom(data.clientId)) {
			if (joiningClient._conection && typeof joiningClient._conection.send === 'function') {
				joiningClient._conection.send(JSON.stringify({
					method: 'invite',
					status: 'error',
					message: 'Already in room'
				}));
			}
			return;
		}
		room.join(joiningClient, joiningClient._conection);
	} else if (data.response === 'no') {
		room.leave('Invitation refusée');
	}
}

async function handleJoinGame(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";
	const roomId = data.roomId;

	if (isClientInAnyRoom(data.clientId)) {
		socket.send(JSON.stringify({
			method: 'join',
			status: 'error',
			message: 'Client already in a room'
		}));
		return;
	}

	if (roomId === "ranked") {

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



	room.join(g_Games.findClient(data.clientId), socket);
}

function handleCreateRoom(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";


	if (isClientInAnyRoom(data.clientId)) {
		socket.send(JSON.stringify({
			method: 'join',
			status: 'error',
			message: 'Client already in the room'
		}));
		return;
	}

	g_Games.createRoom(socket, data.gameMode, data.gamePoint, data.roomName);
}

function handleGameMove(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";
	const room = g_Games.findRoom(data.roomId)
	if (room === undefined)
		throw "Room id not good";
	room.updatePlayer(socket, data);
}

async function handleReady(socket, data) {
	if (!checkClient(data.clientId, socket))
		throw "Client id not good";
	if (g_Games.findRoom(data.roomId) === undefined)
		throw "Room id not good";

	const state = data.state;

	const room = g_Games.findRoom(data.roomId);

	await room.updatePlayerR(state);

}

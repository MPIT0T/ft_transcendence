'use strict'
import Games from './games'

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
				remouveClient(clientId);
				console.log('Client disconnected:', clientId);
			});
		});
	});
}

function remouveClient(clientId){
}


// Fonctions de gestion des messages WebSocket

function handleGetRooms(socket, data) {
	if (g_Games.findClient(data.clientId) === undefined)
        throw "Client id not good";

    const availableRooms = Object.values(g_Games._rooms)
		.filter(g_Games => g_Games..length < 2)
		.filter(g_Games => game.state != "finish")
		.map(game => ({
			id: game.id,
			roomName: game.roomName || `Room ${game.id}`,
			players: `${game.clients.length}/2`,
			gameMode: game.gameMode || 'classic',
			gamePoint: game.gamePoint || 3
		}));
}

function handleJoinGame(socket, data) {
    
}

function handleCreateRoom(socket, data) {
    if (g_Games.findClient(data.clientId) === undefined)
        throw "Client id not good";

	g_Games.createRoom(socket, data.gameMode, data.gamePoint, data.roomName);

}

function handleGameMove(socket, data) {
	
}

function handleReady(socket, data) {
    if (g_Games.findClient(data.clientId) === undefined)
        throw "Client id not good";
    if (g_Games.findRoom(data.gameId) === undefined)
        throw "Room id not good";
	const state = data.state;
    
    const room = g_Games.findRoom(data.gameId);

    room.updatePlayerR(state);

}

function updateGameState(){

    //{"gameid", fasdfsf}
    for (const g of Object.keys(games)) {
        const game = games[g]
		if (game.state == "playing-game")
		{
			const payLoad = {
				"method": "update",
				"game": game
			}
			
			game.clients.forEach(c=> {
				clients[c.clientId].connection.send(JSON.stringify(payLoad))
			})
			}
    }

    setTimeout(updateGameState, 500);
}
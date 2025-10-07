// 'use strict'
// const Games = require('./games');

// const g_Games = new Games();

// module.exports = async function (fastify, opts) {
// 	// Route WebSocket pour le jeu Pong

// 	await fastify.register(require('@fastify/websocket'));
	
	
// 	fastify.register(async function (fastify) {

// 		fastify.get('/ws', { websocket: true }, (socket, request) => {
			
// 			const clientId = g_Games.createClient(socket)

// 			socket.on('message', (message) => {
// 				try {
// 					const data = JSON.parse(message.toString());
// 					switch (data.method) {
// 						case 'rooms':
// 							handleGetRooms(socket, data);
// 							break;
// 						case 'ready':
// 							handleReady(socket, data);
// 							break;
// 						case 'join':
// 							handleJoinGame(socket, data);
// 							break;
// 						case 'create':
// 							handleCreateRoom(socket, data);
// 							break;
// 						case 'move':
// 							handleGameMove(socket, data);
// 							break;
// 						default:
// 							socket.send(JSON.stringify({
// 								method: 'error',
// 								message: 'Unknown method: ' + data.method
// 							}));
// 					}
// 				} catch (error) {
// 					socket.send(JSON.stringify({
// 						method: 'error',
// 						message: 'Invalid JSON format'
// 					}));
// 				}
// 			});


			
// 			socket.on('error', (error) => {
// 				console.error('WebSocket error for client', clientId, error);
// 			});
			
// 			socket.on('close', (code, reason) => {
// 				remouveClient(clientId);
// 				console.log('Client disconnected:', clientId);
// 			});
// 		});
// 	});
// }

// function remouveClient(clientId){
// }


// // Fonctions de gestion des messages WebSocket

// function handleGetRooms(socket, data) {
// 	if (g_Games.findClient(data.clientId) === undefined)
//         throw "Client id not good";

// 	const availableRooms = Object.values(g_Games._rooms)
// 		.filter(room => room.state === 'waiting' && room.players.length < room.maxPlayers); // filtre: salles en attente et non pleines
// 	const roomsInfo = availableRooms.map(room => ({
// 		roomId: room.roomId,
// 		roomName: room.roomName,
// 		gameMode: room.gameMode,
// 		gamePoint: room.gamePoint,
// 		players: room.players.length,
// 		maxPlayers: room.maxPlayers,
// 		state: room.state
// 	}));

// 		socket.send(JSON.stringify({
// 			method: 'rooms',
// 			rooms: roomsInfo
// 		}));
// }

// function handleJoinGame(socket, data) {
//     if (g_Games.findClient(data.clientId) === undefined)
//         throw "Client id not good";
	
// 	const gameId = data.gameId;
	
// 	if (gameId === "ranked") {
// 		// Logique pour matchmaking ranked
//         socket.send(JSON.stringify({
// 			method: 'join',
//             status: 'success',
//             message: 'Searching for ranked match...',
//             gameType: 'ranked'
//         }));
//         return;
//     }
	
// 	if (g_Games.findRoom(data.gameId) === undefined)
// 		throw "Room id not good";

// 	room = g_Games.findRoom(data.gameId);

// 	if (room.clients.length >= 2) {
//         socket.send(JSON.stringify({
//             method: 'join',
//             status: 'error',
//             message: 'Game is full'
//         }));
//         return;
//     }

// 	room.join(g_Games.findClient(data.clientId));
// }

// function handleCreateRoom(socket, data) {
//     if (g_Games.findClient(data.clientId) === undefined)
//         throw "Client id not good";

// 	g_Games.createRoom(socket, data.gameMode, data.gamePoint, data.roomName);

// }

// function handleGameMove(socket, data) {
	
// }

// function handleReady(socket, data) {
//     if (g_Games.findClient(data.clientId) === undefined)
//         throw "Client id not good";
//     if (g_Games.findRoom(data.gameId) === undefined)
//         throw "Room id not good";
// 	const state = data.state;
    
//     const room = g_Games.findRoom(data.gameId);

//     room.updatePlayerR(state);

// }

// function updateGameState(){

//     //{"gameid", fasdfsf}
//     for (const g of Object.keys(games)) {
//         const game = games[g]
// 		if (game.state == "playing-game")
// 		{
// 			const payLoad = {
// 				"method": "update",
// 				"game": game
// 			}
			
// 			game.clients.forEach(c=> {
// 				clients[c.clientId].connection.send(JSON.stringify(payLoad))
// 			})
// 			}
//     }

//     setTimeout(updateGameState, 500);
// }


// 'use strict'

// const Games = require('./games');

// const g_Games = new Games();

// const clients = {};
// const games = {};

// module.exports = async function (fastify, opts) {
// 	// Route WebSocket pour le jeu Pong

// 	await fastify.register(require('@fastify/websocket'));
	
	
// 	fastify.register(async function (fastify) {

// 		fastify.get('/ws', { websocket: true }, (socket, request) => {
			
// 			// Générer un ID client unique
// 			const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
			
// 			clients[clientId] = {
// 				"connection":  socket
// 			}

// 			g_Games.createClient(socket)

// 			// Envoyer l'ID au client
// 			socket.send(JSON.stringify({
// 				method: 'connect',
// 				clientId: clientId
// 			}));


// 			socket.on('message', (message) => {
// 				try {
// 					const data = JSON.parse(message.toString());
// 					switch (data.method) {
// 						case 'rooms':
// 							handleGetRooms(socket, data);
// 							break;
// 						case 'ready':
// 							handleReady(socket, data);
// 							break;
// 						case 'join':
// 							handleJoinGame(socket, data);
// 							break;
// 						case 'create':
// 							handleCreateRoom(socket, data);
// 							break;
// 						case 'move':
// 							handleGameMove(socket, data);
// 							break;
// 						default:
// 							socket.send(JSON.stringify({
// 								method: 'error',
// 								message: 'Unknown method: ' + data.method
// 							}));
// 					}
// 				} catch (error) {
// 					socket.send(JSON.stringify({
// 						method: 'error',
// 						message: 'Invalid JSON format'
// 					}));
// 				}
// 			});


			
// 			socket.on('error', (error) => {
// 				console.error('WebSocket error for client', clientId, error);
// 			});
			
// 			socket.on('close', (code, reason) => {
// 				remouveClient(clientId);
// 				console.log('Client disconnected:', clientId);
// 			});
// 		});
// 	});
// }

// function remouveClient(clientId){
// 	if (clients[clientId]) {
// 		// Remove client from all games
// 		for (const gameId in games) {
// 			const game = games[gameId];
// 			game.clients = game.clients.filter(c => c.clientId !== clientId);
// 			if (game.state == "playing-game"){
// 				game.state = "finish"

// 				const payLoad = {
// 				"method": "finish",
// 				"game": game
// 				}
				
// 				game.clients.forEach(c=> {
// 					clients[c.clientId].connection.send(JSON.stringify(payLoad))
// 				})

// 			}
// 			game.playerR -= 1;
// 			if (game.clients.length == 0)
// 			{
// 				delete games[gameId];
// 			}
// 		}
// 		// Remove client from clients list
// 		delete clients[clientId];
// 	}
// }


// // Fonctions de gestion des messages WebSocket

// function handleGetRooms(socket, data) {
// 	const clientId = data.clientId;

// 	const availableRooms = Object.values(games)
// 		.filter(game => game.clients.length < 2)
// 		.filter(game => game.state != "finish")
// 		.map(game => ({
// 			id: game.id,
// 			roomName: game.roomName || `Room ${game.id}`,
// 			players: `${game.clients.length}/2`,
// 			gameMode: game.gameMode || 'classic',
// 			gamePoint: game.gamePoint || 3
// 		}));

// 	socket.send(JSON.stringify({
// 		method: 'rooms',
// 		rooms: availableRooms,
// 		timestamp: Date.now()
// 	}));
// }

// function handleJoinGame(socket, data) {
//     const clientId = data.clientId;
//     const gameId = data.gameId;
    
//     if (gameId === "ranked") {
//         // Logique pour matchmaking ranked
//         socket.send(JSON.stringify({
//             method: 'join',
//             status: 'success',
//             message: 'Searching for ranked match...',
//             gameType: 'ranked'
//         }));
//         return;
//     }
    
//     if (!games[gameId]) {
//         socket.send(JSON.stringify({
//             method: 'join',
//             status: 'error',
//             message: 'Game not found'
//         }));
//         return;
//     }
    
//     const game = games[gameId];
    
//     if (game.clients.length >= 2) {
//         socket.send(JSON.stringify({
//             method: 'join',
//             status: 'error',
//             message: 'Game is full'
//         }));
//         return;
//     }

// 	const playerNumber = game.clients.length + 1;
    
// 	// Add element to stack
//     game.clients.push({
//         clientId: clientId,
//         joinedAt: Date.now(),
// 		player: playerNumber
//     });
// 	const roomUrl = `/gameOnline?gameId=${gameId}`;
    
// 	if (game.clients.length === 2) {
// 			game.state = 'playing';
			
// 			game.clients.forEach(client => {
// 				if (clients[client.clientId] && clients[client.clientId].connection) {
// 					clients[client.clientId].connection.send(JSON.stringify({
// 						method: 'join',
// 						status: 'success',
// 						message: 'Successfully joined the game, waiting for player to get READY...',
// 						gameId: gameId,
// 						url: roomUrl,
// 						game: game,
// 						yourPlayer: client.player
// 					}));
// 				}
// 			});
// 		} else {
// 			socket.send(JSON.stringify({
// 				method: 'join',
// 				status: 'success',
// 				message: 'Successfully joined the game, waiting for another player...',
// 				gameId: gameId,
// 				url: roomUrl,
// 				game: game,
// 				yourPlayer: playerNumber
// 			}));
// 		}
// }

// function handleCreateRoom(socket, data) {
// 	const clientId = data.clientId;
// 	const gameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// 	const ball={
// 		x: 450,
// 		y: 300,
// 		width: 8,
// 		height: 8,
// 		vel_x: 6,
// 		vel_y: 4
// 	}

// 	const player1 = {
// 			x: 20,           // Position horisontale
// 			y: 260,           // Position verticale
// 			width: 10,      // Largeur de la raquete
// 			height: 100,    // Hauteur de la raquete
// 			vel_y: 0        // Velocite verticale
// 		};

// 	const player2 = {
// 			x: 872,
// 			y: 260,
// 			width: 8,
// 			height: 80,
// 			vel_y: 0
// 		};

// 	games[gameId] = {
//         id: gameId,
//         roomName: data.roomName || `${clientId}'s Room`,
//         gamePoint: data.gamePoint || 3,
//         gameMode: data.gameMode || 'classic',
//         ball: ball,
//         player1: player1,
//         player2: player2,
//         clients: [],
//         state: 'waiting',
// 		playerR: 0,
//         createdAt: Date.now()
//     };

// 	const payLoad = {
// 		"method": "create",
// 		"game" : games[gameId]
// 	}
// 	const con = clients[clientId].connection;
// 	con.send(JSON.stringify(payLoad));
// }

// function handleGameMove(socket, data) {
// 	const gameId = data.gameId;
// 	const player = data.player;
// 	const vel = data.vel;

// 	let game = games[gameId];
	
// 	if(player === 1)
// 		game[player1].vel_y = vel;
// 	if(player === 2)
// 		game[player2].vel_y = vel;
// }

// function handleReady(socket, data) {
// 	const gameId = data.gameId;
// 	const state = data.state;

// 	let game = games[gameId];
// 	game.playerR += state;
// 	console.log("State = "+ game.playerR);


// 	if (game.playerR === 2)
// 	{
// 		game.state = "playing-game";
// 		const payLoad = {
//             "method": "Start",
//             "game": game
//         }

//         game.clients.forEach(c=> {
//             clients[c.clientId].connection.send(JSON.stringify(payLoad))
//         })
// 		updateGameState();
// 	}
// }


// function updateGameState(){

//     //{"gameid", fasdfsf}
//     for (const g of Object.keys(games)) {
//         const game = games[g]
// 		if (game.state == "playing-game")
// 		{
// 			const payLoad = {
// 				"method": "update",
// 				"game": game
// 			}
			
// 			game.clients.forEach(c=> {
// 				clients[c.clientId].connection.send(JSON.stringify(payLoad))
// 			})
// 			}
//     }

//     setTimeout(updateGameState, 500);
// }
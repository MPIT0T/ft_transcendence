'use strict'

const clients = {};
const games = {};

module.exports = async function (fastify, opts) {
	// Route WebSocket pour le jeu Pong

	await fastify.register(require('@fastify/websocket'));
	
	
	fastify.register(async function (fastify) {
		// Vérifier si fastify.authenticate existe avant de l'utiliser
		if (typeof fastify.authenticate === 'function') {
			fastify.addHook('preHandler', fastify.authenticate);
		} else {
			console.log('Authentication middleware not available, continuing without auth');
		}
		
		fastify.get('/ws', { websocket: true }, (socket, request) => {
			
			socket.on("open", () => console.log("opened!"))
			
			// Générer un ID client unique
			const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
			
			clients[clientId] = {
				"connection":  socket
			}

			// Envoyer l'ID au client
			socket.send(JSON.stringify({
				method: 'connect',
				clientId: clientId
			}));


			socket.on('message', (message) => {
				try {
					const data = JSON.parse(message.toString());
					switch (data.method) {
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
				console.log('Client disconnected:', clientId, 'Code:', code, 'Reason:', reason?.toString());
			});
		});
	});
}


// Fonctions de gestion des messages WebSocket

function handleJoinGame(socket, data) {
	const clientId = data.clientId;
	const gameId = data.gameId;
	const game = games[gameId];

	if (game.clients.length >= 2) 
		return;
	
	if (game.clients.length === 1){
		const player = 1;
	} else{
		const player = 2;
	}

	game.clients.push({
		"clientId": clientId,
		"player": player
	})

	if (game.clients.length === 2) updateGameState();

	const payLoad = {
		"method": 'join',
		"status": 'success',
		"message": 'Successfully joined the game',
		"game": game
	}

	game.clients.forEach(c => {
		clients[c.clientId].socket.send(JSON.stringify(payLoad));
	});
}


function handleCreateRoom(socket, data) {
	const clientId = data.clientId;
	const gameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

	const ball={
		x: 450,
		y: 300,
		width: 8,
		height: 8,
		vel_x: 6,
		vel_y: 4
	}

	const player1 = {
			x: 0,           // Position horizontale
			y: 0,           // Position verticale
			width: 10,      // Largeur de la raquette
			height: 100,    // Hauteur de la raquette
			vel_y: 0        // Vélocité verticale
		};

	const player2 = {
			x: 872,
			y: 260,
			width: 8,
			height: 80,
			vel_y: 0
		};

	games[gameId] = {
		"id": gameId,
		"ball": ball,
		"player1":player1,
		"player2":player2,
		"clients": []
	}

	const payLoad = {
		"method": "create",
		"game" : games[gameId]
	}
	const con = clients[clientId].connection;
	con.send(JSON.stringify(payLoad));
}

function handleGameMove(socket, data) {
	const gameId = data.gameId;
	const player = data.player;
	const vel = data.vel;

	let state = games[gameId].state;
	if (!state)
		state = {}
	
	if(player === 1)
		state[player1].vel_y = vel;
	if(player === 2)
		state[player2].vel_y = vel;
	
	games[gameId].state = state;
}

function updateGameState(){

    //{"gameid", fasdfsf}
    for (const g of Object.keys(games)) {
        const game = games[g]
        const payLoad = {
            "method": "update",
            "game": game
        }

        game.clients.forEach(c=> {
            clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
    }

    setTimeout(updateGameState, 500);
}
const Player = require('./player.js');
const Ball = require('./ball.js');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}


class Room {
	constructor(roomId, gameMode, gamePoint, roomName) {
		this.roomId = roomId;
		this.ball = new Ball();
		this.roomName = roomName;
		this.playerR = 0;
		this.gameMode = gameMode;
		this.state = "waiting";
		this.gamePoint = gamePoint;
		this.p1Score = 0;
		this.p2Score = 0;
		this.player1 = new Player(1);
		this.player2 = new Player(2);
		this.clients = [];
		this.startTime = 0;
		this.endTime = 0;

		// Constantes du jeu
		this.CANVAS_WIDTH = 900;
		this.CANVAS_HEIGHT = 600;
		this.TICK_RATE = 60; // 60 FPS
		this.TICK_INTERVAL = 1000 / this.TICK_RATE;
	}

	join(client, socket) {

		if (this.clients.length === 0)
			client._player = 1;
		else
			client._player = 2;

		this.clients.push(client);

		// const roomUrl = `/gameOnline?gameId=${this.roomId}`;
		const roomUrl = `/gameOnline`;

		socket.send(JSON.stringify({
			method: 'join',
			status: 'success',
			message: 'Successfully joined the game, waiting for another player...',
			roomId: this.roomId,
			url: roomUrl,
			room: this.toJsonJoin()
		}));

		const notifyPayload = {
			method: 'playerJoined',
			status: 'success',
			message: 'Un joueur a rejoint la salle.',
			room: this.toJsonJoin(),
			player: client._name
		};

		this.clients.forEach(c => {
			if (c._clientId !== client._clientId && c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify(notifyPayload));
			}
		});


	}

	leave(reason = 'Room closed') {
		const payLoad = {
			method: 'leave',
			status: 'success',
			message: reason,
			roomId: this.roomId
		};

		this.clients.forEach(c => {
			if (c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify(payLoad));
			}
		});

		this.state = 'ended';
		this.clients = [];
	}

	remove(clientId) {
		const idx = this.clients.findIndex(c => c.clientId === clientId);
		if (idx !== -1) {
			this.clients.splice(idx, 1);

			if (this.state === "playing-game") {
				this.state = "ended";
			}

			return true;
		}
		return false;
	}




	async updatePlayerR(int) {

		this.playerR += int;
		if (this.playerR === 2) {
			this.state = "playing-game";

			const payLoad = {
				"method": "Start",
				"room": this.toJSON()
			};

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				} else {
					console.error("Client socket non défini pour", c);
				}
			});

			await sleep(3000); // Délai de 3 secondes avant de commencer
			await this.gameLoop();
		}
	}

	find(clientId) {
		return this.clients.find(c => c.clientId === clientId);
	}


	updatePlayer(socket, data) {
		this.clients.forEach(c => {
			if (c._conection && c._conection === socket) {
				const player = c._player === 1 ? this.player1 : this.player2;

				if (data.type === "UP") {
					if (data.key === "KeyW" || data.key === "ArrowUp") {
						player.setVelocity(-8); // Monter
					} else if (data.key === "KeyS" || data.key === "ArrowDown") {
						player.setVelocity(8); // Descendre
					}
				} else if (data.type === "DOWN") {
					player.setVelocity(0);
				}
			}
		});
	}

	async gameLoop() {
		let lastTime = Date.now();
		this.startTime = Date.now();

		while (this.state === "playing-game") {
			const currentTime = Date.now();
			const deltaTime = currentTime - lastTime;

			// Vérifier qu'il y a toujours 2 clients connectés
			if (this.clients.length !== 2) {
				this.state = "gameEnd";
			}

			await this.updateGamePhysics();

			const payLoad = {
				"method": "update",
				"room": this.toJsonUpdate()
			};

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				} else {
					console.error("Client socket non défini pour", c);
				}
			});

			lastTime = currentTime;

			//(16.67ms pour 60 FPS)
			await sleep(this.TICK_INTERVAL);
		}

		this.sendGameEnd();
	}

	async updateGamePhysics() {
		this.player1.updatePosition(this.CANVAS_HEIGHT);
		this.player2.updatePosition(this.CANVAS_HEIGHT);

		this.ball.updatePosition();

		this.ball.checkWallCollision(this.CANVAS_HEIGHT);

		this.ball.checkPaddleCollision(this.player1);
		this.ball.checkPaddleCollision(this.player2);

		const scorer = this.ball.checkScoring(this.CANVAS_WIDTH);
		if (scorer === 1) {
			this.p1Score++;
			this.ball.reset(1);
			this.player1.reset();
			this.player2.reset();
		} else if (scorer === 2) {
			this.p2Score++;
			this.ball.reset(-1);
			this.player1.reset();
			this.player2.reset();
		}

		if (scorer === 1 || scorer === 2) {
            let payLoad;
            if (this.p1Score >= this.gamePoint || this.p2Score >= this.gamePoint) {
                payLoad = {
                    "method": "update",
                    "room": this.toJsonGoal(),
                    "isGoal": true,
                    "isLastGoal": true,
                };
            } else {
                payLoad = {
                    "method": "update",
                    "room": this.toJsonGoal(),
                    "isGoal": true,
                };
            }

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				} else {
					console.error("Client socket non défini pour", c);
				}
			});


			await sleep(3000);
		}

		// 6. Vérifier la condition de victoire
		if (this.p1Score >= this.gamePoint || this.p2Score >= this.gamePoint) {

			const payLoad = {
				"method": "update",
				"room": this.toJsonUpdate(),
			};

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				} else {
					console.error("Client socket non défini pour", c);
				}
			});


			this.state = "ended";
		}
	}

	async sendGameEnd() {

		this.endTime = Date.now();
        const winner = this.p1Score > this.p2Score ? 1 : this.p1Score < this.p2Score ? 2 : 0;
        const winnerName = winner === 1 ? this.clients[0].name : winner === 2 ? this.clients[1].name : "No one";

        const payLoad = {
			"method": "gameEnd",
			"winner": winner,
			"winnerName": winnerName,
			"finalScore": {
				"player1": this.p1Score,
				"player2": this.p2Score
			},
			"room": this.toJSON()
		};

		this.clients.forEach(c => {
			if (c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify(payLoad));
			}
		});


		const clients = this.clients.map(client => client.id || client)

		const tokens = [];
		const usernames = [];

		usernames.push(clients[0]._name);
		usernames.push(clients[1]._name);
		tokens.push(clients[0]._token);
		tokens.push(clients[1]._token);

		const bodyPayload = {
			winner: winner,
			gameMode: this.gameMode,
			scores: {
				player1: this.p1Score,
				player2: this.p2Score,
			},
			tokens: tokens,
			usernames: usernames,
			duration: Math.floor((this.endTime - this.startTime) / 1000), // Duration in seconds
		};
       
		try {
			// Internal call should omit external nginx prefix '/user/'
			const res = await fetch('https://user_handling:3003/api/post-match', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bodyPayload),
			});
			if (!res.ok) {
				const bodyText = await res.text().catch(() => '');
				console.log('sendGameEnd - failed posting game result:', res.status, res.statusText, bodyText);
			}
		} catch (err) {
			console.log('sendGameEnd - fetch error:', err);
		}
	}

	toJSON() {
		return {
			roomId: this.roomId,
			ball: this.ball?.toJSON ? this.ball.toJSON() : this.ball,
			roomName: this.roomName,
			playerR: this.playerR,
			gameMode: this.gameMode,
			state: this.state,
			p1Score: this.p1Score,
			p2Score: this.p2Score,
			gamePoint: this.gamePoint,
			clients: this.clients.map(client => client.id || client),
			player1: this.player1?.toJSON ? this.player1.toJSON() : this.player1,
			player2: this.player2?.toJSON ? this.player2.toJSON() : this.player2,
		};
	}

	toJsonUpdate() {
		return {
			ball: this.ball?.toJSON ? this.ball.toJSON() : this.ball,
			player1: this.player1?.toJsonMove ? this.player1.toJsonMove() : this.player1,
			player2: this.player2?.toJsonMove ? this.player2.toJsonMove() : this.player2,
		};
	}

	toJsonGoal() {
		return {
			ball: this.ball?.toJSON ? this.ball.toJSON() : this.ball,
			p1Score: this.p1Score,
			p2Score: this.p2Score,
			player1: this.player1?.toJsonMove ? this.player1.toJsonMove() : this.player1,
			player2: this.player2?.toJsonMove ? this.player2.toJsonMove() : this.player2,
		};
	}

	toJsonJoin() {
		return {
			roomId: this.roomId,
			roomName: this.roomName,
			playerR: this.playerR,
			gameMode: this.gameMode,
			state: this.state,
			gamePoint: this.gamePoint,
		};
	}
}

module.exports = Room;

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

		const roomUrl = `/gameOnline?gameId=${this.roomId}`;

		socket.send(JSON.stringify({
			method: 'join',
			status: 'success',
			message: 'Successfully joined the game, waiting for another player...',
			roomId: this.roomId,
			url: roomUrl,
			room: this.toJSON()
		}));
	}

	remove(clientId) {
		const idx = this.clients.findIndex(c => c.clientId === clientId);
		if (idx !== -1) {
			this.clients.splice(idx, 1);

			// Arrêter le jeu si un joueur part
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

		while (this.state === "playing-game") {
			const currentTime = Date.now();
			const deltaTime = currentTime - lastTime;

			this.updateGamePhysics();

			const payLoad = {
				"method": "update",
				"room": this.toJSON()
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

	updateGamePhysics() {
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

		// 6. Vérifier la condition de victoire
		if (this.p1Score >= this.gamePoint || this.p2Score >= this.gamePoint) {
			
			const payLoad = {
				"method": "update",
				"room": this.toJSON()
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

	sendGameEnd() {
		const winner = this.p1Score >= this.gamePoint ? 1 : 2;

		const payLoad = {
			"method": "gameEnd",
			"winner": winner,
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
			player1: this.player1?.toJSON ? this.player1.toJSON() : this.player1,
			player2: this.player2?.toJSON ? this.player2.toJSON() : this.player2,
			clients: this.clients.map(c => c.toJSON())
		};
	}
}

module.exports = Room;

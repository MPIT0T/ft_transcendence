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
			return true;
		}
		return false;
	}

	async updatePlayerR(int) {
		this.playerR += int;

		console.log("playerR = " + this.playerR);


		if (this.playerR === 2) {
			this.state = "playing-game";

			const payLoad = {
				"method": "Start",
				"room": this.toJSON()
			}

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				} else {
					console.error("Client socket non défini pour", c);
				}
			});
			await this.gameLoop();
		}
	}

	find(clientId) { return this.clients.find(c => c.clientId === clientId); }

	updatePlayer(socket, data) {

		this.clients.forEach(c => {
			if (c.connection && c.connection.readyState === c.connection.OPEN && c.connection === socket) {
				const player = c._player
				if (player === 1) {
					if (data.type === "UP") {
						if (e.code === "KeyW" || e.code === "ArrowUp") {
							this.player1._vel_y = 4;
						}

						if (e.code === "ArrowDown" || e.code === "KeyS") {
							this.player1._vel_y = -4;
						}
					} else if (data.type === "DOWN") {
						if (e.code === "KeyW" || e.code === "KeyS") {
							this.player1._vel_y = 0;

						}
						if (e.code === "ArrowUp" || e.code === "ArrowDown") {
							this.player1._vel_y = 0;

						}
					}
				} else if (player === 2) {
					if (data.type === "UP") {
						if (e.code === "KeyW" || e.code === "ArrowUp") {
							this.player2._vel_y = 4;
						}

						if (e.code === "ArrowDown" || e.code === "KeyS") {
							this.player2._vel_y = -4;
						}
					} else if (data.type === "DOWN") {
						if (e.code === "KeyW" || e.code === "KeyS") {
							this.player2._vel_y = 0;

						}
						if (e.code === "ArrowUp" || e.code === "ArrowDown") {
							this.player2._vel_y = 0;

						}
					}
				}



			}

		});
		console.log()
	}

	// mathLoop() {
		
	// }

	async gameLoop() {
		while (this.state === "playing-game") {

			// mathLoop();

			const payLoad = {
				"method": "update",
				"room": this.toJSON()
			}

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				} else {
					console.error("Client socket non défini pour", c);
				}
			});
			await sleep(500)
		}
	}

	// Sérialiser la room pour l'envoyer au front
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

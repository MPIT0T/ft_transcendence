const Player = require('./player.js');

class Room {
	constructor({ roomId, player1, player2 } = {}) {
		this.roomId = roomId;
		this.ball = new Ball();
		this.player1 = new Player(1);
		this.player2 = new Player(2);
		this.clients = [];
	}

	join(client) {
		this.clients.push(client);
	}

	remove(clientId) {
		const idx = this.clients.findIndex(c => c.clientId === clientId);
		if (idx !== -1) {
			this.clients.splice(idx, 1);
			return true;
		}
		return false;
	}

	find(clientId) {return this.clients.find(c => c.clientId === clientId);}

	async gameLoop(){

	}

	// Sérialiser la room pour l'envoyer au front
	toJSON() {
		return {
			roomId: this.roomId,
			ball: this.ball.toJSON ? this.ball.toJSON() : this.ball,
			player1: this.player1 ? this.player1.toJSON ? this.player1.toJSON() : this.player1 : null,
			player2: this.player2 ? this.player2.toJSON ? this.player2.toJSON() : this.player2 : null,
			clients: this.clients.map(c => c.toJSON ? c.toJSON() : c)
		};
	}
}

module.exports = Room;
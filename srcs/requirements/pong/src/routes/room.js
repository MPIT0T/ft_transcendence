import Player from './player.js';
import Ball from './ball.js';

class Room {
	constructor(roomId, gameMode, gamePoint, roomName) {
		this.roomId = roomId;
		this.ball = new Ball();
		this.roomName = roomName;
		this.playerR = 0;
		this.gameMode = gameMode;
		this.state = "waiting";
		this.gamePoint = gamePoint;
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
		
		console.log("wa 3")
		socket.send(JSON.stringify({
			method: 'join',
			status: 'success',
			message: 'Successfully joined the game, waiting for another player...',
			roomId: this.roomId,
			url: roomUrl,
			game: this.toJSON()
		}));
		console.log("wa 4")
		
	}

	remove(clientId) {
		const idx = this.clients.findIndex(c => c.clientId === clientId);
		if (idx !== -1) {
			this.clients.splice(idx, 1);
			return true;
		}
		return false;
	}

	async updatePlayerR(int){
		this.playerR += int;

		console.log("playerR = "+ this.playerR);
		if(this.playerR === 2){
			this.state = "playing-game";

			const payLoad = {
			"method": "Start",
			"room": this.JSON()
			}
			this.clients.forEach(c=> {
				clients[c.clientId].connection.send(JSON.stringify(payLoad))
			})
			await this.gameLoop();
		}
	}

	find(clientId) {return this.clients.find(c => c.clientId === clientId);}

	async gameLoop(){
		console.log("wawawawawww\n");
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
				gamePoint: this.gamePoint,
				player1: this.player1?.toJSON ? this.player1.toJSON() : this.player1,
				player2: this.player2?.toJSON ? this.player2.toJSON() : this.player2,
				clients: this.clients.map(c => c?.toJSON ? c.toJSON() : c)
		};
	}
}

export default Room;
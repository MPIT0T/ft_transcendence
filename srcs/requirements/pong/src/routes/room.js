import Player from './player.js';
import Ball from './ball.js';

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

	async updatePlayerR(int){
		this.playerR += int;

		console.log("playerR = "+ this.playerR);


		if(this.playerR === 2){
			this.state = "playing-game";

			const payLoad = {
			"method": "Start",
			"room": this.toJSON()
			}
			this.clients.forEach(c => {
				if (c.connection && c.connection.readyState === c.connection.OPEN) {
					c.connection.send(JSON.stringify(payLoad));
				}
			});
			await this.gameLoop();
		}
	}

	find(clientId) {return this.clients.find(c => c.clientId === clientId);}

	

	async gameLoop(){
		while(this.state === "playing-game"){
			console.log("wawawawawww\n");
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
				gamePoint: this.gamePoint,
				player1: this.player1?.toJSON ? this.player1.toJSON() : this.player1,
				player2: this.player2?.toJSON ? this.player2.toJSON() : this.player2,
				clients: this.clients.map(c => c.JSON)
		};
	}
}

export default Room;
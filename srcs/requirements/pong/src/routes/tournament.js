const Clients = require('./clients.js');
const Rooms = require('./rooms.js');

class Tournament {
	constructor(tournamentId, gameMode, gamePoint, tournamentName) {
		this.tournamentId = tournamentId;
		this.gameMode = gameMode;
		this.gamePoint = gamePoint;
		this.tournamentName = tournamentName;
		this.rooms = new Rooms();
		this.clients = [];
		this.state = "waiting";
	}

	createRoom(roomName, p1, p2) {
		const roomId = 'game_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

		this.rooms.createRoom(roomId, this.gameMode, this.gamePoint, roomName)

		const room = this.findRoom(roomId);
		room.join(p1, p1._conection);
		room.join(p2, p2._conection);
		return roomId;
	}

	join(client, socket) {

		this.clients.push(client);

		const tournamentUrl = `/tournamentOnline?gameId=${this.tournamentId}`;

		socket.send(JSON.stringify({
			method: 'join',
			status: 'success',
			message: 'Successfully joined the tournament, waiting for another player...',
			tournamentId: this.tournamentId,
			url: tournamentUrl,
		}));
	}



	toJSON() {
		return {
			tournamentId: this.tournamentId,
			gameMode: this.gameMode,
			gamePoint: this.gamePoint,
			tournamentName: this.tournamentName,
			state: this.state,
			clients: this.clients.map(client => client.id || client),
			rooms: this.rooms.toJSON ? this.rooms.toJSON() : this.rooms,
		};
	}


}

module.exports = Tournament;

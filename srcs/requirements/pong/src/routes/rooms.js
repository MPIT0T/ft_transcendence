const Room = require('./room.js');

class Rooms {
	constructor() {
		this._rooms = {};
	}

	createRoom(roomId, gameMode, gamePoint, roomName) {
		const room = new Room(roomId, gameMode, gamePoint, roomName);
		this._rooms[roomId] = room;
	}

	remove(roomId) {
		if (this._rooms[roomId]) {
			// Arrêter le jeu si en cours
			const room = this._rooms[roomId];
			if (room.state === "playing-game") {
				room.state = "ended";
			}
			delete this._rooms[roomId];
			return true;
		}
		return false;
	}

	findRoom(roomId) {
		return this._rooms[roomId];
	}

	findClient(clientId) {
		for (const roomId in this._rooms) {
			const room = this._rooms[roomId];
			if (room.find(clientId)) {
				return room;
			}
		}
		return null;
	}

	getAllRooms() {return this._room;}

	count() {return this._room.length;}

}

module.exports = Rooms;

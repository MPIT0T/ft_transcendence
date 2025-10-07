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
		const index = this._room.findIndex(c => c.roomId === roomId);
		if (index !== -1) {
			this._room.splice(index, 1);
			return true;
		}
		return false;
	}

	findRoom(roomId) {
		return this._rooms[roomId];
	}

	getAllRooms() {return this._room;}

	count() {return this._room.length;}

}

module.exports = Rooms;

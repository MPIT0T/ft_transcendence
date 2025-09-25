const Room = require('./room.js');

class Rooms {
	constructor() {
		this._rooms = [];
	}

	createClient(roomId) {
		const room = new Room(roomId);
		this._rooms.push(room);
	}

	remove(roomId) {
		const index = this._room.findIndex(c => c.roomId === roomId);
		if (index !== -1) {
			this._room.splice(index, 1);
			return true;
		}
		return false;
	}

	find(roomId) {
		return this._room.find(c => c.roomId === roomId);
	}

	getAllRooms() {return this._room;}

	count() {return this._room.length;}

}

module.exports = Rooms;
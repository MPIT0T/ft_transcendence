const Clients = require('./clients.js');
const Rooms = require('./rooms.js');

function canMatch(p1, p2) {
	// Don't match same player (same dbId or same username)
	if (p1._client._dbId && p2._client._dbId && p1._client._dbId === p2._client._dbId)
		return false;
	if (p1._client._name && p2._client._name && p1._client._name === p2._client._name)
		return false;
	
	if (p1.elo < p2.elo - (300 * Math.log2(1 + p2.wait / 60)) || p1.elo > p2.elo + (300 * Math.log2(1 + p2.wait / 60)))
		return false
	if (p2.elo < p1.elo - (300 * Math.log2(1 + p1.wait / 60)) || p2.elo > p1.elo + (300 * Math.log2(1 + p1.wait / 60)))
		return false
	return true
}

class waitingP {
	constructor(client) {
		this._client = client;
		this.wait = 0;
	}
}

class Games {
	constructor() {
		this._clients = new Clients();
		this._rooms = new Rooms();

		this._clientsList = [];
	}

	createClient(socket) {
		const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
		this._clients.createClient(clientId, socket);

		socket.send(JSON.stringify({
			method: 'connect',
			clientId: clientId
		}));

		return clientId;
	}

	createRoom(socket, gameMode, gamePoint, roomName) {
		const roomId = 'game_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

		this._rooms.createRoom(roomId, gameMode, gamePoint, roomName)

		const room = this._rooms.findRoom(roomId);

		if (socket) {
			socket.send(JSON.stringify({
				"method": "create",
				"room": room.toJSON()
			}));
		}



		return roomId;
	}

	createWaitingP(clients) {
		this._clientsList.push(new waitingP(clients));
	}


	findClient(id) {
		const client = this._clients.findClient(id);
		return client;
	}

	findClientName(name) {
		return Object.values(this._clients.getAllClients()).find(c => c && c._name === name);
	}


	findRoom(id) {
		const room = this._rooms.findRoom(id);
		return room;
	}

	removeClient(id) { return this._clients.remove(id); }
	removeRoom(id) { return this._rooms.remove(id); }

	isClientInMatchMaking(clientId) {

		const joiningClient = this.findClient(clientId);
		if (!joiningClient) return false;
		if (this._clientsList.some(c => c._client._clientId === clientId) || this._clientsList.some(c => c._client._dbId === joiningClient._dbId)) {
			return true;
		}
		return false;
	}


	removeClientsList(client) {
		const index = this._clientsList.findIndex(c => c._client === client)
		if (index !== -1) {
			this._clientsList.splice(index, 1)
		}
	}



	async matchMaquing() {
		for (const c1 of this._clientsList) {
			c1.wait += 1
			for (const c2 of this._clientsList) {
				if (c1 === c2 || !canMatch(c1, c2))
					continue;
				const roomId = this.createRoom(null, "ranked", 10, "ranked");
				const room = this.findRoom(roomId);
				room.join(c1._client, c1._client._conection);
				room.join(c2._client, c2._client._conection);
				this.removeClientsList(c1._client);
				this.removeClientsList(c2._client);
				break;
			}
		}

		if (this._clientsList.length !== 0)
			setTimeout(() => this.matchMaquing(), 1000)
	}



}

module.exports = Games;

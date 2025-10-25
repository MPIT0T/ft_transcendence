const Client = require('./client.js')

class Clients {
	constructor() {
		this._clients = {};
	}

	createClient(clientId, socket) {

		const client = new Client(clientId, socket);
		this._clients[clientId]= client;
		

	}

	remove(clientId) {
		if (this._clients[clientId]) {
			delete this._clients[clientId];
			return true;
		}
		return false;
	}

	findClient(clientId) {
		return this._clients[clientId];
	}

	getAllClients() {return this._clients;}

	

	count() {return this._clients.length;}

}

module.exports = Clients;

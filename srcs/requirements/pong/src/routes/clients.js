const Client = require('./client.js');

class Clients {
	constructor() {
		this._clients = [];
	}

	createClient(clientId) {
		const client = new Client(clientId);
		this._clients.push(client);
		// return client;
	}

	remove(clientId) {
		const index = this._clients.findIndex(c => c.clientId === clientId);
		if (index !== -1) {
			this._clients.splice(index, 1);
			return true;
		}
		return false;
	}

	find(clientId) {
		return this._clients.find(c => c.clientId === clientId);
	}

	getAllClients() {return this._clients;}

	count() {return this._clients.length;}

}

module.exports = Clients;
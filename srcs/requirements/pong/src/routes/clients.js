import Client from './client.js';

class Clients {
	constructor() {
		this._clients = {};
	}

	createClient(clientId, socket) {

		const client = new Client(clientId, socket);
		this._clients[clientId]= client;

		
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

	findClient(clientId) {
		return this._clients[clientId];
	}

	getAllClients() {return this._clients;}

	count() {return this._clients.length;}

}

export default Clients;
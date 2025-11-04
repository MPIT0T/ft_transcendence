class Client {
	constructor(clientId, socket) {
		this._clientId = clientId;
		this._dbId = null;
		this._name = `Player_${Math.floor(Math.random() * 100000)}`;
		this._player = null;
		this._elo = 1000;
		this._conection = socket;
		this.isReady = false; // Initialiser le statut ready à false
	}

	toJSON() {
		return {
				name: this._name,
				elo: this._elo,
		};
	}

}

module.exports = Client;
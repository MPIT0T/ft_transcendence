class Client {
	constructor(clientId, socket) {
		this._clientId = clientId;
		this._dbId = null;
		this._name = null;
		this._player = null;
		this._elo = 1000;
		this._conection = socket;
	}

	toJSON() {
		return {
				clientId: this._clientId,
				name: this._name,
				player: this._player,
				elo: this._elo,
		};
	}

}

module.exports = Client;
class Client {
	constructor(clientId, socket) {
		this._clientId = clientId;
		this._dbId = null;
		this._name = `Player_${Math.floor(Math.random() * 100000)}`;
		this._player = null;
		this._elo = 1000;
		this._conection = socket;
		this._currentPage = null;
	}

	toJSON() {
		return {
				name: this._name,
				elo: this._elo,
                player: this._player,
		};
	}
}

module.exports = Client;
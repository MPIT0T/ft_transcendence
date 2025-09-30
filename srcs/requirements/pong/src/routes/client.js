class Client {
	constructor({id , socket} = {}) {
		this._clientId = id;
		this._dbId = null;
		this._name = null;
		this.player = null;
		this.elo = 1000;
		this.conection = socket;
	}

	toJSON() {
		return {
			player:{
				clientId: this._clientId,
				name: this._name,
				player: this.player,
				elo: this.elo,
			}
		};
	}

}

module.exports = Client;
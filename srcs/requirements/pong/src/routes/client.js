class Client {
	constructor({id, player} = {}) {
		this._clientId = id;
		this._dbId = '';
		this._name = '';
		this.player = player;
		this.elo = 1000;
	}

	// Getters
	get clientId() {
		return this._clientId;
	}

	get dbId() {
		return this._dbId;
	}

	get name() {
		return this._name;
	}

	get player() {
		return this._player;
	}

	get elo() {
		return this._elo;
	}

	// Setters
	set dbId(value) {
		this._dbId = value;
	}

	set name(value) {
		this._name = value;
	}

	set player(value) {
		this._player = value;
	}

	set elo(value) {
		this._elo = value;
	}

	move(dy) {
		this._y += dy;
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
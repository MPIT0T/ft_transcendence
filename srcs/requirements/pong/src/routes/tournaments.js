const Tournament = require('./tournament.js');

class Tournaments {
	constructor() {
		this._tournaments = {};
	}

	createTournament(tournamentId, gameMode, gamePoint, tournamentName) {
		const tournament = new Tournament(tournamentId, gameMode, gamePoint, tournamentName);
		this._tournaments[tournamentId] = tournament;
	}

	remove(tournamentId) {
		if (this._tournaments[tournamentId]) {
			const tournament = this._tournaments[tournamentId];
			if (tournament.state === "playing-game") {
				tournament.state = "ended";
			}
			delete this._tournaments[tournamentId];
			return true;
		}
		return false;
	}

	findTournament(tournamentId) {
		return this._tournaments[tournamentId];
	}



}

module.exports = Tournaments;

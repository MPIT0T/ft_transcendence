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

	removeClientsTournament(clientId) {
		for (const tournamentId in this._tournaments) {
			const tournament = this._tournaments[tournamentId];
			
			if (tournament.state === "waiting") {
				const removed = tournament.remove(clientId);
				if (removed) {
					console.log(`Client ${clientId} retiré du tournoi ${tournamentId}`);
					
					// Si le tournoi est vide, le supprimer
					if (tournament.clients.length === 0) {
						delete this._tournaments[tournamentId];
						console.log(`Tournoi ${tournamentId} supprimé (aucun client restant)`);
					}
				}
			}
			// Si le tournoi est déjà lancé (playing-game), ne rien faire
			else if (tournament.state === "playing-game") {
				console.log(`Client ${clientId} ne peut pas être retiré du tournoi ${tournamentId} (partie en cours)`);
			}
		}
	}

}

module.exports = Tournaments;

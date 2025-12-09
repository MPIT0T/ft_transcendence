const Tournament = require('./tournament.js');

class Tournaments {
	constructor() {
		this._tournaments = {};
	}

	createTournament(tournamentId, gameMode, gamePoint, tournamentName) {
		const onTournamentEnd = (id) => {
			this.remove(id);
		};
		const tournament = new Tournament(tournamentId, gameMode, gamePoint, tournamentName, onTournamentEnd);
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
				const removed = tournament.leave(clientId);
				if (removed) {
					tournament.playerR -= 1;
					// Si le tournoi est vide, le supprimer
					if (tournament.clients.length === 0) {
						delete this._tournaments[tournamentId];
					}
				}
			}
			// Si le tournoi est déjà lancé (playing-tournament), ne rien faire
			else if (tournament.state === "playing-tournament") {
				tournament.disconnect(clientId);
				
			}
			else if (tournament.state === "finished") {
				const removed = tournament.remove(clientId);
				if (removed) {
					tournament.playerR -= 1;
					if (tournament.clients.length === 0) {
						delete this._tournaments[tournamentId];
					}
				}
			}
		}
	}

}

module.exports = Tournaments;

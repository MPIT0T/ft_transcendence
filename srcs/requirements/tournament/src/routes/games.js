const Clients = require('./clients.js');
const Tournaments = require('./tournaments.js');

class Games {
	constructor() {
		this._clients = new Clients();
		this._tournaments = new Tournaments();
	}

	createClient(socket) {
		const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
		this._clients.createClient(clientId, socket);

		socket.send(JSON.stringify({
			method: 'connect',
			clientId: clientId
		}));

		return clientId;
	}

	createTournament(socket, gameMode, gamePoint, tournamentName) {
		const tournamentId = 'tournament_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

		this._tournaments.createTournament(tournamentId, gameMode, gamePoint, tournamentName)

		const tournament = this._tournaments.findTournament(tournamentId);

		if (socket) {
			socket.send(JSON.stringify({
				"method": "create",
				"tournament": tournament.toJSON()
			}));
		}

		return tournamentId;
	}

	findClient(id) {
		const client = this._clients.findClient(id);
		return client;
	}

	findTournament(id) {
		const tournament = this._tournaments.findTournament(id);
		return tournament;
	}


	removeClient(id) { return this._clients.remove(id); }
	removeTournament(id) { return this._tournaments.remove(id); }

}

module.exports = Games;

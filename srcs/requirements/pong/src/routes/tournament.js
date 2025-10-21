const Clients = require('./clients.js');
const Rooms = require('./rooms.js');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class Tournament {
	constructor(tournamentId, gameMode, gamePoint, tournamentName) {
		this.tournamentId = tournamentId;
		this.gameMode = gameMode;
		this.gamePoint = gamePoint;
		this.tournamentName = tournamentName;
		this.rooms = new Rooms();
		this.clients = [];
		this.playerR = 0;
		this.state = "waiting";
	}

	createRoom(roomName, p1, p2) {
		const roomId = 'game_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

		this.rooms.createRoom(roomId, this.gameMode, this.gamePoint, roomName)

		const room = this.findRoom(roomId);
		room.join(p1, p1._conection);
		room.join(p2, p2._conection);
		return roomId;
	}

	join(client, socket) {

		this.clients.push(client);

		const tournamentUrl = `/tournamentOnline?gameId=${this.tournamentId}`;

		socket.send(JSON.stringify({
			method: 'joinT',
			status: 'success',
			message: 'Successfully joined the tournament.',
			tournamentId: this.tournamentId,
			url: tournamentUrl,
		}));

		const payLoad = {
			method: 'playerJoinTournament',
			status: 'success',
			message: ''+client._name+' a rejoint la salle.',
			playerName: client._name,
			playerCount: this.clients.length,
			clients: this.clients.map(c => ({
				id: c.id || c._clientId,
				name: c._name || 'Unknown',
				elo: c.elo || 1000
			})),

		};

		this.clients.forEach(c => {
			if (c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify(payLoad));
			}
		});
	}

	async updatePlayerR(int) {
		
		this.playerR += int;
		if (this.playerR === 8) {
			this.state = "playing-tournament";

			const payLoad = {
				"method": "Start",
				"tournament": this.toJSON()
			};

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify(payLoad));
				}
			});

			await sleep(3000);
			await this.tournamentLoop();
		}
	}

	async tournamentLoop() {

		// Round 1: Quarter Finals (8 players -> 4 winners)
		const quarterFinals = [];
		for (let i = 0; i < this.clients.length; i += 2) {
			if (i + 1 < this.clients.length) {
				quarterFinals.push({
					player1: this.clients[i],
					player2: this.clients[i + 1],
					roomName: `Quarter Final ${(i / 2) + 1}`
				});
			}
		}

		// Notify all clients about quarter finals matchups
		this.clients.forEach(c => {
			if (c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify({
					method: 'tournamentRound',
					round: 'Quarter Finals',
					matches: quarterFinals.map(m => ({
						player1: m.player1._name,
						player2: m.player2._name,
						roomName: m.roomName
					}))
				}));
			}
		});

		// Create and play quarter final matches
		const semiFinalPlayers = [];
		const quarterResults = [];
		for (const match of quarterFinals) {
			
			const roomId = this.createRoom(match.roomName, match.player1, match.player2);
			const room = this.rooms.findRoom(roomId);
			
			// Wait for the game to finish
			await room.gameLoop();
			
			// Determine winner (player with highest score)
			const winner = room.p1Score > room.p2Score ? match.player1 : match.player2;
			const loser = room.p1Score > room.p2Score ? match.player2 : match.player1;
			semiFinalPlayers.push(winner);
			
			quarterResults.push({
				player1: match.player1._name,
				player2: match.player2._name,
				score1: room.p1Score,
				score2: room.p2Score,
				winner: winner._name
			});
			
			
			// Notify match result
			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify({
						method: 'matchResult',
						round: 'Quarter Finals',
						match: match.roomName,
						player1: match.player1._name,
						player2: match.player2._name,
						score1: room.p1Score,
						score2: room.p2Score,
						winner: winner._name
					}));
				}
			});
		}

		await sleep(2000);

		// Round 2: Semi Finals (4 players -> 2 winners)
		const semiFinals = [];
		for (let i = 0; i < semiFinalPlayers.length; i += 2) {
			if (i + 1 < semiFinalPlayers.length) {
				semiFinals.push({
					player1: semiFinalPlayers[i],
					player2: semiFinalPlayers[i + 1],
					roomName: `Semi Final ${(i / 2) + 1}`
				});
			}
		}

		// Notify about semi finals
		this.clients.forEach(c => {
			if (c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify({
					method: 'tournamentRound',
					round: 'Semi Finals',
					matches: semiFinals.map(m => ({
						player1: m.player1._name,
						player2: m.player2._name,
						roomName: m.roomName
					}))
				}));
			}
		});

		// Play semi finals
		const finalPlayers = [];
		const semiResults = [];
		for (const match of semiFinals) {
			
			const roomId = this.createRoom(match.roomName, match.player1, match.player2);
			const room = this.rooms.findRoom(roomId);
			
			await room.gameLoop();
			
			const winner = room.p1Score > room.p2Score ? match.player1 : match.player2;
			finalPlayers.push(winner);
			
			semiResults.push({
				player1: match.player1._name,
				player2: match.player2._name,
				score1: room.p1Score,
				score2: room.p2Score,
				winner: winner._name
			});
			
			
			// Notify match result
			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify({
						method: 'matchResult',
						round: 'Semi Finals',
						match: match.roomName,
						player1: match.player1._name,
						player2: match.player2._name,
						score1: room.p1Score,
						score2: room.p2Score,
						winner: winner._name
					}));
				}
			});
		}

		await sleep(2000);

		// Round 3: Final (2 players -> 1 winner)
		if (finalPlayers.length === 2) {
			const finalMatch = {
				player1: finalPlayers[0],
				player2: finalPlayers[1],
				roomName: 'Final'
			};

			// Notify about final
			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify({
						method: 'tournamentRound',
						round: 'Final',
						matches: [{
							player1: finalMatch.player1._name,
							player2: finalMatch.player2._name,
							roomName: finalMatch.roomName
						}]
					}));
				}
			});

			
			const roomId = this.createRoom(finalMatch.roomName, finalMatch.player1, finalMatch.player2);
			const room = this.rooms.findRoom(roomId);
			
			await room.gameLoop();
			
			const champion = room.p1Score > room.p2Score ? finalMatch.player1 : finalMatch.player2;
			

			// Notify match result
			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify({
						method: 'matchResult',
						round: 'Final',
						match: 'Final',
						player1: finalMatch.player1._name,
						player2: finalMatch.player2._name,
						score1: room.p1Score,
						score2: room.p2Score,
						winner: champion._name
					}));
				}
			});

			await sleep(2000);

			// Notify all clients about the champion
			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify({
						method: 'tournamentWinner',
						winner: champion._name,
						championId: champion._clientId,
						finalScore1: room.p1Score,
						finalScore2: room.p2Score
					}));
				}
			});

			this.state = "finished";
		}

	}

	findRoom(roomId) {
		return this.rooms.findRoom(roomId);
	}

	toJSON() {
		return {
			tournamentId: this.tournamentId,
			gameMode: this.gameMode,
			gamePoint: this.gamePoint,
			tournamentName: this.tournamentName,
			state: this.state,
			clients: this.clients.map(client => ({
				id: client.id || client._clientId,
				name: client._name || 'Unknown'
			})),
			playerCount: this.clients.length,
			rooms: this.rooms.toJSON ? this.rooms.toJSON() : this.rooms,
		};
	}


}

module.exports = Tournament;

const Rooms = require('./rooms.js');

/**
 * 🏆 SYSTÈME DE TOURNOI AVEC PRÉ-GÉNÉRATION DES ROOMS
 * 
 * Pour un tournoi de 8 joueurs :
 * - 4 Quarter Finals (QF1, QF2, QF3, QF4)
 * - 2 Semi Finals (SF1, SF2)
 * - 1 Final
 * 
 * TOUTES les rooms sont créées au début du tournoi (vides) et stockées dans `allTournamentRooms[]`
 * 
 * Structure d'une room pré-générée :
 * {
 *   roomId: 'tournamentId_quarter_1',
 *   roomName: 'Quarter Final 1',
 *   round: 'Quarter Finals',
 *   matchNumber: 1,
 *   player1: null,           // Assigné plus tard
 *   player2: null,           // Assigné plus tard
 *   winner: null,            // Déterminé après le match
 *   score1: null,            // Mis à jour après le match
 *   score2: null,            // Mis à jour après le match
 *   status: 'waiting'        // 'waiting' | 'ready' | 'completed'
 * }
 * 
 * MÉTHODES DISPONIBLES :
 * - generateAllTournamentRooms() : Crée toutes les 7 rooms vides au début
 * - getTournamentRoom(round, matchNumber) : Récupère une room spécifique
 * - assignPlayersToRoom(round, matchNumber, p1, p2) : Assigne des joueurs à une room
 * 
 * UTILISATION :
 * 1. Le tournoi génère toutes les rooms dès que 8 joueurs sont prêts
 * 2. Les joueurs sont assignés aux rooms au fur et à mesure
 * 3. Vous pouvez accéder/modifier les rooms via `tournament.allTournamentRooms`
 */

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
		this.allTournamentRooms = [];
	}

	generateAllTournamentRooms() {
		this.allTournamentRooms = [];

		// 4 Quarter Finals
		for (let i = 1; i <= 4; i++) {
			const roomId = `${this.tournamentId}_quarter_${i}`;
			this.rooms.createRoom(roomId, this.gameMode, this.gamePoint, `Quarter Final ${i}`);
			this.allTournamentRooms.push({
				roomId: roomId,
				roomName: `Quarter Final ${i}`,
				round: 'Quarter Finals',
				matchNumber: i,
				player1: null,
				player2: null,
				winner: null,
				score1: null,
				score2: null,
				status: 'waiting'
			});
		}

		// 2 Semi Finals
		for (let i = 1; i <= 2; i++) {
			const roomId = `${this.tournamentId}_semi_${i}`;
			this.rooms.createRoom(roomId, this.gameMode, this.gamePoint, `Semi Final ${i}`);
			this.allTournamentRooms.push({
				roomId: roomId,
				roomName: `Semi Final ${i}`,
				round: 'Semi Finals',
				matchNumber: i,
				player1: null,
				player2: null,
				winner: null,
				score1: null,
				score2: null,
				status: 'waiting'
			});
		}

		// 1 Final
		const finalRoomId = `${this.tournamentId}_final`;
		this.rooms.createRoom(finalRoomId, this.gameMode, this.gamePoint, 'Final');
		this.allTournamentRooms.push({
			roomId: finalRoomId,
			roomName: 'Final',
			round: 'Final',
			matchNumber: 1,
			player1: null,
			player2: null,
			winner: null,
			score1: null,
			score2: null,
			status: 'waiting'
		});

		return this.allTournamentRooms;
	}

	getTournamentRoom(round, matchNumber) {
		return this.allTournamentRooms.find(
			r => r.round === round && r.matchNumber === matchNumber
		);
	}

	assignPlayersToRoom(round, matchNumber, player1, player2) {
		const roomData = this.getTournamentRoom(round, matchNumber);
		if (!roomData) {
			console.error(`❌ Room not found: ${round} match ${matchNumber}`);
			return null;
		}

		roomData.player1 = player1;
		roomData.player2 = player2;
		roomData.status = 'ready';

		const room = this.rooms.findRoom(roomData.roomId);
		if (room) {
			room.join(player1, player1._conection);
			room.join(player2, player2._conection);
		}

		return roomData;
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

		client.isReady = false;

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
			message: '' + client._name + ' a rejoint la salle.',
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

	getPlayerR() {
		// Compte le nombre de clients qui ont isReady = true
		let count = 0;
		this.clients.forEach(client => {
			if (client.isReady === true) {
				count++;
			}
		});
		return count;
	}

	async updatePlayerR(int) {

		this.playerR = this.getPlayerR();
		console.log(`[Tournament] playerR: ${this.playerR}, clients.length: ${this.clients.length}`);

		if (this.state === "playing-tournament" && this.allTournamentRooms.length > 0) {
			this.broadcastTournamentState();
			return;
		}

		// Vérifier qu'il y a exactement 8 joueurs connectés avant de lancer
		if (this.playerR === 8 && this.clients.length === 8) {
			console.log('[Tournament] Starting tournament with 8 players!');
			this.state = "playing-tournament";

			this.generateAllTournamentRooms();

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

	broadcastTournamentState() {
		const payload = {
			method: 'tournamentState',
			allMatches: this.allTournamentRooms.map(r => ({
				roomId: r.roomId,
				roomName: r.roomName,
				round: r.round,
				matchNumber: r.matchNumber,
				player1: r.player1 ? r.player1._name : null,
				player2: r.player2 ? r.player2._name : null,
				score1: r.score1,
				score2: r.score2,
				winner: r.winner ? r.winner._name : null,
				status: r.status
			}))
		};

		this.clients.forEach(c => {
			if (c._conection && typeof c._conection.send === 'function') {
				c._conection.send(JSON.stringify(payload));
			}
		});
	}

	async tournamentLoop() {

		// Round 1: Quarter Finals (8 players -> 4 winners)
		for (let i = 0; i < this.clients.length; i += 2) {
			if (i + 1 < this.clients.length) {
				const matchNumber = (i / 2) + 1;
				this.assignPlayersToRoom('Quarter Finals', matchNumber, this.clients[i], this.clients[i + 1]);
			}
		}

		const quarterFinalRooms = this.allTournamentRooms.filter(r => r.round === 'Quarter Finals');

		this.broadcastTournamentState();

		const semiFinalPlayers = [];
		const quarterPromises = quarterFinalRooms.map(async (roomData) => {
			const room = this.rooms.findRoom(roomData.roomId);

			// Vérifier les connexions des joueurs
			const p1Connected = roomData.player1 && roomData.player1._conection && roomData.player1._conection.readyState === 1;
			const p2Connected = roomData.player2 && roomData.player2._conection && roomData.player2._conection.readyState === 1;

			let winner;

			// Si les deux sont déconnectés, choisir un au hasard
			if (!p1Connected && !p2Connected) {
				winner = Math.random() < 0.5 ? roomData.player1 : roomData.player2;
				roomData.score1 = 0;
				roomData.score2 = 0;
				roomData.winner = winner;
				roomData.status = 'completed';
				console.log(`[Tournament] Both players disconnected in ${roomData.roomName}, random winner: ${winner._name}`);
				this.broadcastTournamentState();
				return winner;
			}

			// Si seul player1 est déconnecté, player2 gagne
			if (!p1Connected && p2Connected) {
				winner = roomData.player2;
				roomData.score1 = 0;
				roomData.score2 = 3;
				roomData.winner = winner;
				roomData.status = 'completed';
				console.log(`[Tournament] Player1 disconnected in ${roomData.roomName}, ${winner._name} wins by forfeit`);
				if (p2Connected) {
					roomData.player2._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
				this.broadcastTournamentState();
				return winner;
			}

			// Si seul player2 est déconnecté, player1 gagne
			if (p1Connected && !p2Connected) {
				winner = roomData.player1;
				roomData.score1 = 3;
				roomData.score2 = 0;
				roomData.winner = winner;
				roomData.status = 'completed';
				console.log(`[Tournament] Player2 disconnected in ${roomData.roomName}, ${winner._name} wins by forfeit`);
				if (p1Connected) {
					roomData.player1._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
				this.broadcastTournamentState();
				return winner;
			}

			// Les deux sont connectés, envoyer les messages de début de match
			if (p1Connected) {
				const roomUrl = `/gameOnlineTournament?gameId=${roomData.roomId}`;
				roomData.player1._conection.send(JSON.stringify({
					method: "startMatch",
					roomId: roomData.roomId,
					roomUrl: roomUrl,
					opponent: roomData.player2._name,
					matchRound: roomData.roomName
				}));
			}
			if (p2Connected) {
				const roomUrl = `/gameOnlineTournament?gameId=${roomData.roomId}`;
				roomData.player2._conection.send(JSON.stringify({
					method: "startMatch",
					roomId: roomData.roomId,
					roomUrl: roomUrl,
					opponent: roomData.player1._name,
					matchRound: roomData.roomName
				}));
			}
			
			await sleep(1000);

			room.state = "playing-game";
			await room.gameLoop();

			winner = room.p1Score > room.p2Score ? roomData.player1 : roomData.player2;

			roomData.score1 = room.p1Score;
			roomData.score2 = room.p2Score;
			roomData.winner = winner;
			roomData.status = 'completed';

			if (roomData.player1 && roomData.player1._conection && roomData.player1._conection.readyState === 1) {
				roomData.player1._conection.send(JSON.stringify({
					method: "returnToBracket",
					tournamentId: this.tournamentId
				}));
			}
			if (roomData.player2 && roomData.player2._conection && roomData.player2._conection.readyState === 1) {
				roomData.player2._conection.send(JSON.stringify({
					method: "returnToBracket",
					tournamentId: this.tournamentId
				}));
			}

			await sleep(2000);

			this.broadcastTournamentState();

			return winner;
		});

		const quarterWinners = await Promise.all(quarterPromises);
		semiFinalPlayers.push(...quarterWinners);

		await sleep(2000);

		// Round 2: Semi Finals (4 players -> 2 winners)
		for (let i = 0; i < semiFinalPlayers.length; i += 2) {
			if (i + 1 < semiFinalPlayers.length) {
				const matchNumber = (i / 2) + 1;
				this.assignPlayersToRoom('Semi Finals', matchNumber, semiFinalPlayers[i], semiFinalPlayers[i + 1]);
			}
		}

		const semiFinalRooms = this.allTournamentRooms.filter(r => r.round === 'Semi Finals');

		this.broadcastTournamentState();

		const semiPromises = semiFinalRooms.map(async (roomData) => {
			const room = this.rooms.findRoom(roomData.roomId);

			// Vérifier les connexions des joueurs
			const p1Connected = roomData.player1 && roomData.player1._conection && roomData.player1._conection.readyState === 1;
			const p2Connected = roomData.player2 && roomData.player2._conection && roomData.player2._conection.readyState === 1;

			let winner;

			// Si les deux sont déconnectés, choisir un au hasard
			if (!p1Connected && !p2Connected) {
				winner = Math.random() < 0.5 ? roomData.player1 : roomData.player2;
				roomData.score1 = 0;
				roomData.score2 = 0;
				roomData.winner = winner;
				roomData.status = 'completed';
				console.log(`[Tournament] Both players disconnected in ${roomData.roomName}, random winner: ${winner._name}`);
				this.broadcastTournamentState();
				return winner;
			}

			// Si seul player1 est déconnecté, player2 gagne
			if (!p1Connected && p2Connected) {
				winner = roomData.player2;
				roomData.score1 = 0;
				roomData.score2 = 3;
				roomData.winner = winner;
				roomData.status = 'completed';
				console.log(`[Tournament] Player1 disconnected in ${roomData.roomName}, ${winner._name} wins by forfeit`);
				if (p2Connected) {
					roomData.player2._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
				this.broadcastTournamentState();
				return winner;
			}

			// Si seul player2 est déconnecté, player1 gagne
			if (p1Connected && !p2Connected) {
				winner = roomData.player1;
				roomData.score1 = 3;
				roomData.score2 = 0;
				roomData.winner = winner;
				roomData.status = 'completed';
				console.log(`[Tournament] Player2 disconnected in ${roomData.roomName}, ${winner._name} wins by forfeit`);
				if (p1Connected) {
					roomData.player1._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
				this.broadcastTournamentState();
				return winner;
			}

			// Les deux sont connectés, envoyer les messages de début de match
			if (p1Connected) {
				const roomUrl = `/gameOnlineTournament?gameId=${roomData.roomId}`;
				roomData.player1._conection.send(JSON.stringify({
					method: "startMatch",
					roomId: roomData.roomId,
					roomUrl: roomUrl,
					opponent: roomData.player2._name,
					matchRound: roomData.roomName
				}));
			}
			if (p2Connected) {
				const roomUrl = `/gameOnlineTournament?gameId=${roomData.roomId}`;
				roomData.player2._conection.send(JSON.stringify({
					method: "startMatch",
					roomId: roomData.roomId,
					roomUrl: roomUrl,
					opponent: roomData.player1._name,
					matchRound: roomData.roomName
				}));
			}

			await sleep(1000);

			room.state = "playing-game";
			await room.gameLoop();

			winner = room.p1Score > room.p2Score ? roomData.player1 : roomData.player2;

			roomData.score1 = room.p1Score;
			roomData.score2 = room.p2Score;
			roomData.winner = winner;
			roomData.status = 'completed';

			if (roomData.player1 && roomData.player1._conection && roomData.player1._conection.readyState === 1) {
				roomData.player1._conection.send(JSON.stringify({
					method: "returnToBracket",
					tournamentId: this.tournamentId
				}));
			}
			if (roomData.player2 && roomData.player2._conection && roomData.player2._conection.readyState === 1) {
				roomData.player2._conection.send(JSON.stringify({
					method: "returnToBracket",
					tournamentId: this.tournamentId
				}));
			}

			await sleep(2000);

			this.broadcastTournamentState();

			return winner;
		});

		const finalPlayers = await Promise.all(semiPromises);

		await sleep(2000);

		// Round 3: Final (2 players -> 1 winner)
		if (finalPlayers.length === 2) {
			this.assignPlayersToRoom('Final', 1, finalPlayers[0], finalPlayers[1]);

			const finalRoomData = this.getTournamentRoom('Final', 1);

			this.broadcastTournamentState();

			const room = this.rooms.findRoom(finalRoomData.roomId);

			// Vérifier les connexions des joueurs
			const p1Connected = finalRoomData.player1 && finalRoomData.player1._conection && finalRoomData.player1._conection.readyState === 1;
			const p2Connected = finalRoomData.player2 && finalRoomData.player2._conection && finalRoomData.player2._conection.readyState === 1;

			let champion;

			// Si les deux sont déconnectés, choisir un au hasard
			if (!p1Connected && !p2Connected) {
				champion = Math.random() < 0.5 ? finalRoomData.player1 : finalRoomData.player2;
				finalRoomData.score1 = 0;
				finalRoomData.score2 = 0;
				finalRoomData.winner = champion;
				finalRoomData.status = 'completed';
				console.log(`[Tournament] Both players disconnected in Final, random winner: ${champion._name}`);
			}
			// Si seul player1 est déconnecté, player2 gagne
			else if (!p1Connected && p2Connected) {
				champion = finalRoomData.player2;
				finalRoomData.score1 = 0;
				finalRoomData.score2 = 3;
				finalRoomData.winner = champion;
				finalRoomData.status = 'completed';
				console.log(`[Tournament] Player1 disconnected in Final, ${champion._name} wins by forfeit`);
				if (p2Connected) {
					finalRoomData.player2._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
			}
			// Si seul player2 est déconnecté, player1 gagne
			else if (p1Connected && !p2Connected) {
				champion = finalRoomData.player1;
				finalRoomData.score1 = 3;
				finalRoomData.score2 = 0;
				finalRoomData.winner = champion;
				finalRoomData.status = 'completed';
				console.log(`[Tournament] Player2 disconnected in Final, ${champion._name} wins by forfeit`);
				if (p1Connected) {
					finalRoomData.player1._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
			}
			// Les deux sont connectés, jouer le match normalement
			else {
				if (p1Connected) {
					const roomUrl = `/gameOnlineTournament?gameId=${finalRoomData.roomId}`;
					finalRoomData.player1._conection.send(JSON.stringify({
						method: "startMatch",
						roomId: finalRoomData.roomId,
						roomUrl: roomUrl,
						opponent: finalRoomData.player2._name,
						matchRound: finalRoomData.roomName
					}));
				}
				if (p2Connected) {
					const roomUrl = `/gameOnlineTournament?gameId=${finalRoomData.roomId}`;
					finalRoomData.player2._conection.send(JSON.stringify({
						method: "startMatch",
						roomId: finalRoomData.roomId,
						roomUrl: roomUrl,
						opponent: finalRoomData.player1._name,
						matchRound: finalRoomData.roomName
					}));
				}
				
				await sleep(1000);

				room.state = "playing-game";
				await room.gameLoop();

				champion = room.p1Score > room.p2Score ? finalRoomData.player1 : finalRoomData.player2;

				finalRoomData.score1 = room.p1Score;
				finalRoomData.score2 = room.p2Score;
				finalRoomData.winner = champion;
				finalRoomData.status = 'completed';

				if (finalRoomData.player1 && finalRoomData.player1._conection && finalRoomData.player1._conection.readyState === 1) {
					finalRoomData.player1._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
				if (finalRoomData.player2 && finalRoomData.player2._conection && finalRoomData.player2._conection.readyState === 1) {
					finalRoomData.player2._conection.send(JSON.stringify({
						method: "returnToBracket",
						tournamentId: this.tournamentId
					}));
				}
			}

			await sleep(2000);

			this.broadcastTournamentState();

			await sleep(2000);

			this.clients.forEach(c => {
				if (c._conection && typeof c._conection.send === 'function') {
					c._conection.send(JSON.stringify({
						method: 'tournamentWinner',
						winner: champion._name,
						championId: champion._clientId,
						finalScore1: finalRoomData.score1,
						finalScore2: finalRoomData.score2
					}));
				}
			});

			this.state = "finished";
		}

	}

	remove(clientId) {
		const idx = this.clients.findIndex(c => c._clientId === clientId);
		if (idx !== -1) {
			const removed = this.clients.splice(idx, 1)[0];
			const playerName = removed ? (removed._name || 'Unknown') : 'Unknown';
			
			// Notifier les autres clients de la room
			const payLoad = {
				method: 'playerLeaveTournament',
				status: 'success',
				message: `${playerName} a quitté le tournoi.`,
				playerName: playerName,
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
			
			return true;
		}
		return false;
	}

	findRoom(roomId) {
		return this.rooms.findRoom(roomId);
	}

	handleMove(socket, data) {
		const room = this.rooms.findRoom(data.roomId);
		if (!room) {
			console.error('Room not found in tournament:', data.roomId);
			return;
		}
		room.updatePlayer(socket, data);
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

import type { TournamentPage } from "../interface/gameInterface";

interface Player {
	id: string;
	name: string;
}

interface Match {
	id: string;
	player1: Player | null;
	player2: Player | null;
	winner: Player | null;
	round: number;
	position: number;
}

export const TournamentOnline: TournamentPage = {
	render() {
		return `
<div class="text-white text-center">
Hello World
</div>
		`;
	},

  render4players(): string {
    return `
<div class="border-1 border-gray-50">

</div>
    `;
  },

  render8players(): string {
    return ``;
  },

  mount(root: HTMLElement): void {
		const players: Player[] = [];
		const matches: Match[] = [];
		let currentRound = 1;
		let matchIdCounter = 0;

		const playerNameInput = root.querySelector('#player-name-input') as HTMLInputElement;
		const addPlayerBtn = root.querySelector('#add-player-btn') as HTMLButtonElement;
		const playerList = root.querySelector('#player-list') as HTMLDivElement;
		const startTournamentBtn = root.querySelector('#start-tournament-btn') as HTMLButtonElement;
		const tournamentSetup = root.querySelector('#tournament-setup') as HTMLDivElement;
		const tournamentBracket = root.querySelector('#tournament-bracket') as HTMLDivElement;
		const resetTournamentBtn = root.querySelector('#reset-tournament-btn') as HTMLButtonElement;

		// Add player
		const addPlayer = () => {
			const name = playerNameInput.value.trim();
			if (name && players.length < 8) {
				const player: Player = {
					id: `player-${Date.now()}`,
					name: name
				};
				players.push(player);
				playerNameInput.value = '';
				updatePlayerList();
				updateStartButton();
			}
		};

		addPlayerBtn.addEventListener('click', addPlayer);
		playerNameInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				addPlayer();
			}
		});

		// Update player list
		const updatePlayerList = () => {
			playerList.innerHTML = players.map((player, index) => `
				<div class="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
					<span class="font-semibold">${index + 1}. ${player.name}</span>
					<button 
						class="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm transition-colors"
						data-player-id="${player.id}"
					>
						Remove
					</button>
				</div>
			`).join('');

			// Add remove event listeners
			playerList.querySelectorAll('button[data-player-id]').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const target = e.target as HTMLButtonElement;
					const playerId = target.dataset.playerId;
					const index = players.findIndex(p => p.id === playerId);
					if (index !== -1) {
						players.splice(index, 1);
						updatePlayerList();
						updateStartButton();
					}
				});
			});
		};

		// Update start button
		const updateStartButton = () => {
			if (players.length >= 4 && [4, 8].includes(players.length)) {
				startTournamentBtn.disabled = false;
				startTournamentBtn.textContent = `Start Tournament with ${players.length} players`;
			} else if (players.length < 4) {
				startTournamentBtn.disabled = true;
				startTournamentBtn.textContent = `Start Tournament (Need at least 4 players)`;
			} else {
				startTournamentBtn.disabled = true;
				startTournamentBtn.textContent = `Need exactly 4 or 8 players (currently ${players.length})`;
			}
		};

		// Create match card
		const createMatchCard = (match: Match, roundNumber: number): string => {
			const canPlay = match.player1 && match.player2 && !match.winner;
			return `
				<div class="bg-slate-800/90 backdrop-blur-sm border-2 ${match.winner ? 'border-green-500' : 'border-slate-600'} rounded-lg p-4 w-64 shadow-xl">
					<!-- Player 1 -->
					<div class="flex items-center justify-between p-3 mb-2 rounded ${match.winner?.id === match.player1?.id ? 'bg-green-700' : 'bg-slate-700'} ${match.player1 ? '' : 'opacity-50'}">
						<span class="font-semibold">${match.player1?.name || 'TBD'}</span>
						${match.winner?.id === match.player1?.id ? '<span class="text-yellow-400">👑</span>' : ''}
					</div>
					
					<div class="text-center text-slate-400 text-sm my-2">VS</div>
					
					<!-- Player 2 -->
					<div class="flex items-center justify-between p-3 mb-3 rounded ${match.winner?.id === match.player2?.id ? 'bg-green-700' : 'bg-slate-700'} ${match.player2 ? '' : 'opacity-50'}">
						<span class="font-semibold">${match.player2?.name || 'TBD'}</span>
						${match.winner?.id === match.player2?.id ? '<span class="text-yellow-400">👑</span>' : ''}
					</div>
					
					<!-- Play/Result -->
					${canPlay ? `
						<div class="flex gap-2">
							<button 
								class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors text-sm select-winner-btn"
								data-match-id="${match.id}"
								data-winner-id="${match.player1?.id}"
							>
								${match.player1?.name} Wins
							</button>
						</div>
						<div class="flex gap-2 mt-2">
							<button 
								class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors text-sm select-winner-btn"
								data-match-id="${match.id}"
								data-winner-id="${match.player2?.id}"
							>
								${match.player2?.name} Wins
							</button>
						</div>
					` : match.winner ? `
						<div class="text-center py-2 bg-green-600 rounded font-bold">
							Winner: ${match.winner.name}
						</div>
					` : `
						<div class="text-center py-2 bg-slate-600 rounded text-slate-400">
							Waiting...
						</div>
					`}
				</div>
			`;
		};

		// Render bracket
		const renderBracket = () => {
			const rounds = [1, 2, 3];
			rounds.forEach(roundNum => {
				const roundContainer = root.querySelector(`#round-${roundNum}`) as HTMLDivElement;
				if (roundContainer) {
					const roundMatches = matches.filter(m => m.round === roundNum);
					roundContainer.innerHTML = roundMatches.map(m => createMatchCard(m, roundNum)).join('');
				}
			});

			// Add event listeners for winner selection
			root.querySelectorAll('.select-winner-btn').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const target = e.target as HTMLButtonElement;
					const matchId = target.dataset.matchId!;
					const winnerId = target.dataset.winnerId!;
					selectWinner(matchId, winnerId);
				});
			});

			// Display winner if tournament is complete
			displayWinner();
		};

		// Select winner
		const selectWinner = (matchId: string, winnerId: string) => {
			const match = matches.find(m => m.id === matchId);
			if (!match || match.winner) return;

			const winner = [match.player1, match.player2].find(p => p?.id === winnerId);
			if (!winner) return;

			match.winner = winner;

			// Advance winner to next round
			if (match.round < 3) {
				const nextRound = match.round + 1;
				const nextMatchPosition = Math.floor(match.position / 2);
				const nextMatch = matches.find(m => m.round === nextRound && m.position === nextMatchPosition);
				
				if (nextMatch) {
					if (match.position % 2 === 0) {
						nextMatch.player1 = winner;
					} else {
						nextMatch.player2 = winner;
					}
				}
			}

			renderBracket();
		};

		// Display winner
		const displayWinner = () => {
			const finalMatch = matches.find(m => m.round === 3);
			const winnerContainer = root.querySelector('#winner-container') as HTMLDivElement;
			
			if (finalMatch?.winner) {
				winnerContainer.innerHTML = `
					<div class="bg-gradient-to-br from-yellow-600 to-yellow-700 border-4 border-yellow-400 rounded-lg p-8 text-center shadow-2xl transform scale-110">
						<div class="text-6xl mb-4">🏆</div>
						<div class="text-3xl font-bold mb-2">${finalMatch.winner.name}</div>
						<div class="text-lg text-yellow-200">Champion!</div>
					</div>
				`;
			} else {
				winnerContainer.innerHTML = `
					<div class="bg-slate-800 border-2 border-slate-600 rounded-lg p-8 text-center">
						<div class="text-4xl mb-4 opacity-50">🏆</div>
						<div class="text-slate-400">TBD</div>
					</div>
				`;
			}
		};

		// Start tournament
		startTournamentBtn.addEventListener('click', () => {
			if (players.length < 4) return;

			// Shuffle players
			const shuffled = [...players].sort(() => Math.random() - 0.5);

			// Create matches
			matches.length = 0;
			matchIdCounter = 0;

			if (shuffled.length === 4) {
				// Semi-finals (Round 2)
				for (let i = 0; i < 2; i++) {
					matches.push({
						id: `match-${matchIdCounter++}`,
						player1: shuffled[i * 2],
						player2: shuffled[i * 2 + 1],
						winner: null,
						round: 2,
						position: i
					});
				}
			} else if (shuffled.length === 8) {
				// Quarter-finals (Round 1)
				for (let i = 0; i < 4; i++) {
					matches.push({
						id: `match-${matchIdCounter++}`,
						player1: shuffled[i * 2],
						player2: shuffled[i * 2 + 1],
						winner: null,
						round: 1,
						position: i
					});
				}
				// Semi-finals (Round 2)
				for (let i = 0; i < 2; i++) {
					matches.push({
						id: `match-${matchIdCounter++}`,
						player1: null,
						player2: null,
						winner: null,
						round: 2,
						position: i
					});
				}
			}

			// Final (Round 3)
			matches.push({
				id: `match-${matchIdCounter++}`,
				player1: null,
				player2: null,
				winner: null,
				round: 3,
				position: 0
			});

			// Hide setup, show bracket
			tournamentSetup.classList.add('hidden');
			tournamentBracket.classList.remove('hidden');
			
			renderBracket();
		});

		// Reset tournament
		resetTournamentBtn.addEventListener('click', () => {
			players.length = 0;
			matches.length = 0;
			currentRound = 1;
			updatePlayerList();
			updateStartButton();
			tournamentSetup.classList.remove('hidden');
			tournamentBracket.classList.add('hidden');
		});
	}
};
export default TournamentPage;

import type { Page } from "../interface/gameInterface.js"
import { ws } from "./TournamentRoom.js";

export const TournamentOnline: Page = {
	render() {
		return `
		<div class="flex gap-16 p-6 pt-24 items-start justify-center">
			<!-- Boîte Message Server à gauche -->
			<div class="flex-shrink-0 mt-8" style="width: 400px;">
				<div class="backdrop-blur-2xs border-2 border-gray-300 shadow-xl p-6 h-[750px] flex flex-col">
					<h3 class="text-2xl font-semibold text-center mb-4 text-gray-50 drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">Server Log</h3>
					<div id="server-messages" class="space-y-2 overflow-y-auto flex-1">
						<div class="text-lg text-gray-400">Waiting for updates...</div>
					</div>
				</div>
			</div>

			<!-- Contenu principal (center) -->
			<div class="flex-1 backdrop-blur-xs text-white max-w-5xl">
				<!-- Header avec style arcade -->
				<div class="mx-auto mb-8">
					<div class="flex items-center justify-center mb-4 border-4 border-white p-4 bg-black">
						<h1 class="text-5xl font-bold text-white tracking-wider" style="font-family: 'Courier New', monospace; text-shadow: 0 0 10px #fff, 0 0 20px #fff;">
							◈ TOURNAMENT ◈
						</h1>
					</div>
					
				</div>

				<!-- Tournament Bracket avec style rétro Pong -->
				<div class="mx-auto">
					<div class="flex justify-center items-start gap-8">
						<!-- Round 1: Quarter Finals -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">ROUND 1</h3>
							</div>
							<div class="flex flex-col gap-6">
								<!-- Match 1 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="quarter-1">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="0">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 2 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="quarter-2">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="3">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 3 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="quarter-3">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="4">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="5">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 4 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="quarter-4">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="6">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="7">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 2: Semi Finals -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">ROUND 2</h3>
							</div>
							<div class="flex flex-col gap-32 mt-24">
								<!-- Semi 1 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="semi-1">
									<div class="p-2 mb-1 border-2 border-white bg-black/50" data-player="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="p-2 border-2 border-white bg-black/50" data-player="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>

								<!-- Semi 2 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="semi-2">
									<div class="p-2 mb-1 border-2 border-white bg-black/50" data-player="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="p-2 border-2 border-white bg-black/50" data-player="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 3: Final -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">FINAL</h3>
							</div>
							<div class="flex flex-col justify-center min-h-[600px]">
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs" data-match="final">
									<div class="p-2 mb-1 border-2 border-white bg-black/50" data-player="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="p-2 border-2 border-white bg-black/50" data-player="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Winner -->
						<div class="flex flex-col gap-8" style="min-width: 200px; max-width: 250px;">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">★ WINNER ★</h3>
							</div>
							<div class="flex flex-col justify-center min-h-[600px]">
								<div class="border-4 border-white p-4 text-center bg-black/70 backdrop-blur-xs w-full">
									<div class="text-5xl mb-3 text-white">🏆</div>
									<div class="text-gray-400 text-sm break-words overflow-hidden" style="font-family: 'Courier New', monospace; max-height: 80px;">TBD</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Leave Button -->
				<div class="text-center mt-8">
					<button 
						id="leave-tournament-btn"
						class="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
					>
						Leave Tournament
					</button>
				</div>
			</div>

			<!-- Boîte Player à droite -->
			<div class="flex-shrink-0 mt-8" style="width: 400px;">
				<div class="backdrop-blur-2xs border-2 border-gray-300 shadow-xl p-6 h-[750px] flex flex-col">
					<h3 class="text-2xl font-semibold text-center mb-4 text-gray-50 drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">Players</h3>
					<p class="text-xl text-gray-400 text-center mb-4" id="player-info">0/8</p>
					<div id="players-list" class="space-y-2 overflow-y-auto flex-1">
						<div class="bg-pink-200 rounded-2xl p-3 border-2 border-red-300 text-center">
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	},

	mount(root: HTMLElement): void {
		const tournamentId = localStorage.getItem('tournamentId');
		const clientId = localStorage.getItem('clientId');

		const tournamentNameEl = root.querySelector('#tournament-name') as HTMLElement;
		const playerCountEl = root.querySelector('#player-count') as HTMLElement;
		const playersListEl = root.querySelector('#players-list') as HTMLElement;
		const serverMessagesEl = root.querySelector('#server-messages') as HTMLElement;
		const playerInfoEl = root.querySelector('#player-info') as HTMLElement;
		const currentPlayerNameEl = root.querySelector('#current-player-name') as HTMLElement;
		const leaveTournamentBtn = root.querySelector('#leave-tournament-btn') as HTMLButtonElement;

		// Fonction pour ajouter un message du serveur
		const addServerMessage = (message: string) => {
			if (!serverMessagesEl) return;
			
			const timestamp = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			const messageEl = document.createElement('div');
			messageEl.className = 'text-lg text-gray-300 mb-2 leading-relaxed';
			messageEl.innerHTML = `<span class="text-gray-200">[${timestamp}]</span> ${message}`;
			
			serverMessagesEl.appendChild(messageEl);
			serverMessagesEl.scrollTop = serverMessagesEl.scrollHeight;
			
			while (serverMessagesEl.children.length > 30) {
				serverMessagesEl.removeChild(serverMessagesEl.firstChild as Node);
			}
		};

		const payLoad = {
			  "method": "readyT",
			  "clientId": clientId,
			  "tournamentId": tournamentId,
			  "state": 1
			}
			if (ws)
			  ws.send(JSON.stringify(payLoad));

		 if (ws) {
			  ws.onmessage = message => {
		
				const response = JSON.parse(message.data);
		
				if (response.method === "playerJoinTournament") {
					if (playerCountEl) playerCountEl.textContent = `${response.playerCount}/8 PLAYERS`;
					if (playerInfoEl) playerInfoEl.textContent = `${response.playerCount}/8`;
					
					addServerMessage(`${response.playerName} joined! (${response.playerCount}/8)`);
					
					if (response.clients && Array.isArray(response.clients)) {
						response.clients.forEach((client: any, index: number) => {
							const slot = root.querySelector(`[data-slot="${index}"]`);
							if (slot) {
								const nameEl = slot.querySelector('.player-name');
								if (nameEl) {
									nameEl.textContent = client.name || `Player ${index + 1}`;
									nameEl.classList.remove('text-gray-400');
									nameEl.classList.add('text-white');
								}
							}
						});
					}

					// Mettre à jour la liste des joueurs (sidebar droite)
					if (playersListEl && response.clients) {
						playersListEl.innerHTML = response.clients.map((client: { name: string, elo: number }, index: number) => `
							<div class="backdrop-blur-xs border border-gray-400 p-3 text-center shadow">
								<p class="text-sm font-semibold text-gray-50">${client.name}</p>
								<p class="text-xs text-gray-400 mt-1">ELO: ${client.elo}</p>
							</div>
						`).join('');
					}
				}

				// Quand le tournoi commence
				if (response.method === "Start") {
					addServerMessage(`🎮 Tournament is starting!`);
					addServerMessage(`All players are ready. Good luck!`);
					if (tournamentNameEl) tournamentNameEl.textContent = 'QUARTER FINALS';
				}

				// Mise à jour des rounds (Quarter Finals, Semi Finals, Final)
				if (response.method === "tournamentRound") {
					addServerMessage(`⚔️ ${response.round} starting!`);
					
					response.matches.forEach((match: any, index: number) => {
						addServerMessage(`Match ${index + 1}: ${match.player1} vs ${match.player2}`);
					});

					// Mettre à jour l'en-tête avec le round actuel
					if (tournamentNameEl) {
						tournamentNameEl.textContent = response.round.toUpperCase();
					}

					// Mettre à jour les cases du bracket selon le round
					if (response.round === "Quarter Finals") {
						// Les noms devraient déjà être là depuis playerJoinTournament
						// Mais on peut les vérifier/mettre à jour
						response.matches.forEach((match: any, index: number) => {
							const matchId = `quarter-${index + 1}`;
							const matchBox = root.querySelector(`[data-match="${matchId}"]`);
							if (matchBox) {
								const slots = matchBox.querySelectorAll('[data-slot]');
								const name1 = slots[0]?.querySelector('.player-name');
								const name2 = slots[1]?.querySelector('.player-name');
								
								if (name1) {
									name1.textContent = match.player1;
									name1.classList.remove('text-gray-400');
									name1.classList.add('text-white');
								}
								if (name2) {
									name2.textContent = match.player2;
									name2.classList.remove('text-gray-400');
									name2.classList.add('text-white');
								}
							}
						});
					} else if (response.round === "Semi Finals") {
						// Mettre à jour les 2 matchs de semi-finales
						response.matches.forEach((match: any, index: number) => {
							const matchId = `semi-${index + 1}`;
							const matchBox = root.querySelector(`[data-match="${matchId}"]`);
							if (matchBox) {
								const player1Name = matchBox.querySelector('[data-player="1"] .player-name');
								const player2Name = matchBox.querySelector('[data-player="2"] .player-name');
								
								if (player1Name) {
									player1Name.textContent = match.player1;
									player1Name.classList.remove('text-gray-400');
									player1Name.classList.add('text-white');
								}
								if (player2Name) {
									player2Name.textContent = match.player2;
									player2Name.classList.remove('text-gray-400');
									player2Name.classList.add('text-white');
								}
							}
						});
					} else if (response.round === "Final") {
						// Mettre à jour le match final
						if (response.matches[0]) {
							const finalBox = root.querySelector('[data-match="final"]');
							if (finalBox) {
								const player1Name = finalBox.querySelector('[data-player="1"] .player-name');
								const player2Name = finalBox.querySelector('[data-player="2"] .player-name');
								
								if (player1Name) {
									player1Name.textContent = response.matches[0].player1;
									player1Name.classList.remove('text-gray-400');
									player1Name.classList.add('text-white');
								}
								if (player2Name) {
									player2Name.textContent = response.matches[0].player2;
									player2Name.classList.remove('text-gray-400');
									player2Name.classList.add('text-white');
								}
							}
						}
					}
				}

				// Résultats de match avec scores
				if (response.method === "matchResult") {
					addServerMessage(`✅ ${response.match} result: ${response.player1} ${response.score1} - ${response.score2} ${response.player2}`);
					addServerMessage(`Winner: ${response.winner}!`);
					
					console.log('matchResult received:', response);
					
					// Trouver le match correspondant et afficher le score
					let matchBox = null;
					
					if (response.round === "Quarter Finals") {
						// Chercher dans tous les Quarter Finals
						const allQuarters = root.querySelectorAll('[data-match^="quarter-"]');
						console.log('Found quarter boxes:', allQuarters.length);
						
						allQuarters.forEach((box) => {
							const slots = box.querySelectorAll('[data-slot]');
							const name1 = slots[0]?.querySelector('.player-name')?.textContent?.trim();
							const name2 = slots[1]?.querySelector('.player-name')?.textContent?.trim();
							
							console.log(`Checking match: ${name1} vs ${name2} against ${response.player1} vs ${response.player2}`);
							
							if (name1 === response.player1 && name2 === response.player2) {
								matchBox = box;
								console.log('Found matching quarter box!');
							}
						});
					} else if (response.round === "Semi Finals") {
						// Chercher dans les Semi Finals
						const allSemis = root.querySelectorAll('[data-match^="semi-"]');
						console.log('Found semi boxes:', allSemis.length);
						
						allSemis.forEach((box) => {
							const name1 = box.querySelector('[data-player="1"] .player-name')?.textContent?.trim();
							const name2 = box.querySelector('[data-player="2"] .player-name')?.textContent?.trim();
							
							console.log(`Checking match: ${name1} vs ${name2} against ${response.player1} vs ${response.player2}`);
							
							if (name1 === response.player1 && name2 === response.player2) {
								matchBox = box;
								console.log('Found matching semi box!');
							}
						});
					} else if (response.round === "Final") {
						matchBox = root.querySelector('[data-match="final"]');
						console.log('Found final box:', matchBox);
					}
					
					// Mettre à jour les scores et highlight winner
					if (matchBox) {
						console.log('Updating match box with scores');
						const score1El = matchBox.querySelector('.score-1');
						const score2El = matchBox.querySelector('.score-2');
						
						console.log('Score elements found:', score1El, score2El);
						
						// Trouver les slots de joueurs
						let player1Slot, player2Slot;
						if (response.round === "Quarter Finals") {
							const slots = matchBox.querySelectorAll('[data-slot]');
							player1Slot = slots[0];
							player2Slot = slots[1];
						} else {
							player1Slot = matchBox.querySelector('[data-player="1"]');
							player2Slot = matchBox.querySelector('[data-player="2"]');
						}
						
						// Afficher les scores à côté de VS
						if (score1El) score1El.textContent = response.score1;
						if (score2El) score2El.textContent = response.score2;
						
						// Highlight winner
						if (response.winner === response.player1) {
							player1Slot?.classList.add('bg-green-900', 'border-green-400');
							player1Slot?.classList.remove('bg-black/50');
						} else {
							player2Slot?.classList.add('bg-green-900', 'border-green-400');
							player2Slot?.classList.remove('bg-black/50');
						}
						
						console.log('Match box updated successfully');
					} else {
						console.log('ERROR: Match box not found!');
					}
				}

				// Annonce du gagnant du tournoi
				if (response.method === "tournamentWinner") {
					addServerMessage(`🏆 CHAMPION: ${response.winner}!`);
					addServerMessage(`Congratulations to the winner!`);
					
					console.log('Tournament winner:', response.winner);
					
					if (tournamentNameEl) {
						tournamentNameEl.textContent = '🏆 TOURNAMENT FINISHED 🏆';
					}

					// Afficher le gagnant dans la zone Winner
					// Chercher le div avec le trophée (maintenant text-5xl au lieu de text-6xl)
					const trophyDiv = root.querySelector('.text-5xl.mb-3.text-white');
					console.log('Trophy div found:', trophyDiv);
					
					if (trophyDiv && trophyDiv.parentElement) {
						const winnerNameDiv = trophyDiv.nextElementSibling;
						console.log('Winner name div found:', winnerNameDiv);
						
						if (winnerNameDiv) {
							winnerNameDiv.textContent = response.winner;
							winnerNameDiv.classList.remove('text-gray-400', 'text-sm');
							winnerNameDiv.classList.add('text-white', 'text-lg', 'font-bold', 'break-words');
							console.log('Winner name updated to:', response.winner);
						} else {
							console.log('ERROR: Winner name div not found');
						}
					} else {
						console.log('ERROR: Trophy div not found');
					}
				}

			}
		}

		// Bouton pour quitter le tournoi
		if (leaveTournamentBtn) {
			leaveTournamentBtn.addEventListener('click', () => {
				window.location.hash = '#/home';
			});
		}
	}
};


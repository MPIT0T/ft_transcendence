import type { Page } from "../interface/gameInterface.js"
import { ws } from "./TournamentRoom.js";

export const TournamentOnline: Page = {
	render() {
		return `
		<div class="flex gap-16 p-6 pt-24 items-start justify-center">
			<!-- Contenu principal (center) -->
			<div class="flex-1  text-white max-w-5xl">
				<!-- Header avec style arcade -->
				<div class="mx-auto mb-8">
					<div class="flex items-center justify-center mb-4 border-4 border-white p-4 backdrop-blur-xs">
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
							<div class="text-center mb-4 border-2 border-white p-2 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">ROUND 1</h3>
							</div>
							<div class="flex flex-col gap-6">
								<!-- Match 1 -->
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="quarter-1">
									<div class="player-slot p-2 mb-1 border-2 border-white backdrop-blur-xs" data-slot="0">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white backdrop-blur-xs" data-slot="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 2 -->
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="quarter-2">
									<div class="player-slot p-2 mb-1 border-2 border-white backdrop-blur-xs" data-slot="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white backdrop-blur-xs" data-slot="3">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 3 -->
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="quarter-3">
									<div class="player-slot p-2 mb-1 border-2 border-white backdrop-blur-xs" data-slot="4">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white backdrop-blur-xs" data-slot="5">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 4 -->
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="quarter-4">
									<div class="player-slot p-2 mb-1 border-2 border-white backdrop-blur-xs" data-slot="6">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border-2 border-white backdrop-blur-xs" data-slot="7">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 2: Semi Finals -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">ROUND 2</h3>
							</div>
							<div class="flex flex-col gap-32 mt-24">
								<!-- Semi 1 -->
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="semi-1">
									<div class="p-2 mb-1 border-2 border-white backdrop-blur-xs" data-player="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="p-2 border-2 border-white backdrop-blur-xs" data-player="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>

								<!-- Semi 2 -->
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="semi-2">
									<div class="p-2 mb-1 border-2 border-white backdrop-blur-xs" data-player="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="p-2 border-2 border-white backdrop-blur-xs" data-player="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 3: Final -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">FINAL</h3>
							</div>
							<div class="flex flex-col justify-center min-h-[600px]">
								<div class="border-4 border-white p-3 w-64 backdrop-blur-xs" data-match="final">
									<div class="p-2 mb-1 border-2 border-white backdrop-blur-xs" data-player="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3" style="font-family: 'Courier New', monospace;">
										<span class="score-1 text-yellow-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-yellow-400 font-bold"></span>
									</div>
									<div class="p-2 border-2 border-white backdrop-blur-xs" data-player="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Winner -->
						<div class="flex flex-col gap-8" style="min-width: 200px; max-width: 250px;">
							<div class="text-center mb-4 border-2 border-white p-2 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">★ WINNER ★</h3>
							</div>
							<div class="flex flex-col justify-center min-h-[600px]">
								<div class="border-4 border-white p-4 text-center backdrop-blur-xs w-full">
									<div class="text-5xl mb-3 text-white">🏆</div>
									<div class="text-gray-400 text-sm wrap-break-word overflow-hidden" style="font-family: 'Courier New', monospace; max-height: 80px;">TBD</div>
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
		</div>
		`;
	},

	mount(root: HTMLElement): void {
		const tournamentId = sessionStorage.getItem('tournamentId');
		const clientId = sessionStorage.getItem('clientId');

		const tournamentNameEl = root.querySelector('#tournament-name') as HTMLElement;
		const playerCountEl = root.querySelector('#player-count') as HTMLElement;
		const currentPlayerNameEl = root.querySelector('#current-player-name') as HTMLElement;
		const leaveTournamentBtn = root.querySelector('#leave-tournament-btn') as HTMLButtonElement;

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

				if (response.method === "playerLeaveTournament") {
					// Mettre à jour le compteur et le sidebar
					if (playerCountEl) playerCountEl.textContent = `${response.playerCount}/8 PLAYERS`;

					// Mettre à jour les slots du bracket (quarter-finals)
					const slots = root.querySelectorAll('[data-slot]');
					slots.forEach((slot, index) => {
						const nameEl = slot.querySelector('.player-name');
						if (!nameEl) return;

						const client = response.clients && Array.isArray(response.clients) ? response.clients[index] : null;
						if (client) {
							nameEl.textContent = client.name || `Player ${index + 1}`;
							nameEl.classList.remove('text-gray-400');
							nameEl.classList.add('text-white');
						} else {
							nameEl.textContent = '█ WAITING...';
							nameEl.classList.remove('text-white');
							nameEl.classList.add('text-gray-400');
							// retirer les éventuels styles de gagnant
							slot.classList.remove('bg-green-900', 'border-green-400');
						}
					});
				}

				if (response.method === "playerJoinTournament") {
					if (playerCountEl) playerCountEl.textContent = `${response.playerCount}/8 PLAYERS`;

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
				}

				// Quand le tournoi commence
				if (response.method === "Start") {
					sessionStorage.setItem('gamestate', 'playing-game');
					if (tournamentNameEl) tournamentNameEl.textContent = 'QUARTER FINALS';
				}

				// 📊 Recevoir l'état complet du tournoi (tous les matchs)
				if (response.method === "tournamentState") {
					const allMatches = response.allMatches;

					// Déterminer le round actuel basé sur les matchs en cours
					let currentRound = 'QUARTER FINALS';
					const hasCompletedQuarters = allMatches.filter((m: any) => m.round === 'Quarter Finals' && m.status === 'completed').length;
					const hasCompletedSemis = allMatches.filter((m: any) => m.round === 'Semi Finals' && m.status === 'completed').length;

					if (hasCompletedSemis === 2) {
						currentRound = 'FINAL';
					} else if (hasCompletedQuarters === 4) {
						currentRound = 'SEMI FINALS';
					}

					if (tournamentNameEl) {
						tournamentNameEl.textContent = currentRound;
					}

					// Mettre à jour tous les matchs
					allMatches.forEach((match: any) => {
						let matchBox = null;

						// Trouver la box correspondante
						if (match.round === 'Quarter Finals') {
							const matchId = `quarter-${match.matchNumber}`;
							matchBox = root.querySelector(`[data-match="${matchId}"]`);

							if (matchBox && match.player1 && match.player2) {
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

								// Si le match est terminé, afficher les scores
								if (match.status === 'completed') {
									const score1El = matchBox.querySelector('.score-1');
									const score2El = matchBox.querySelector('.score-2');

									if (score1El) score1El.textContent = match.score1;
									if (score2El) score2El.textContent = match.score2;

									// Highlight winner
									if (match.winner === match.player1) {
										slots[0]?.classList.add('bg-green-900', 'border-green-400');
									} else {
										slots[1]?.classList.add('bg-green-900', 'border-green-400');
									}
								}
							}
						} else if (match.round === 'Semi Finals') {
							const matchId = `semi-${match.matchNumber}`;
							matchBox = root.querySelector(`[data-match="${matchId}"]`);

							if (matchBox && match.player1 && match.player2) {
								const player1Slot = matchBox.querySelector('[data-player="1"]');
								const player2Slot = matchBox.querySelector('[data-player="2"]');
								const name1 = player1Slot?.querySelector('.player-name');
								const name2 = player2Slot?.querySelector('.player-name');

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

								// Si le match est terminé, afficher les scores
								if (match.status === 'completed') {
									const score1El = matchBox.querySelector('.score-1');
									const score2El = matchBox.querySelector('.score-2');

									if (score1El) score1El.textContent = match.score1;
									if (score2El) score2El.textContent = match.score2;

									// Highlight winner
									if (match.winner === match.player1) {
										player1Slot?.classList.add('bg-green-900', 'border-green-400');
									} else {
										player2Slot?.classList.add('bg-green-900', 'border-green-400');
									}
								}
							}
						} else if (match.round === 'Final') {
							matchBox = root.querySelector('[data-match="final"]');

							if (matchBox && match.player1 && match.player2) {
								const player1Slot = matchBox.querySelector('[data-player="1"]');
								const player2Slot = matchBox.querySelector('[data-player="2"]');
								const name1 = player1Slot?.querySelector('.player-name');
								const name2 = player2Slot?.querySelector('.player-name');

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

								// Si le match est terminé, afficher les scores
								if (match.status === 'completed') {
									const score1El = matchBox.querySelector('.score-1');
									const score2El = matchBox.querySelector('.score-2');

									if (score1El) score1El.textContent = match.score1;
									if (score2El) score2El.textContent = match.score2;

									// Highlight winner et afficher dans la winner box
									if (match.winner === match.player1) {
										player1Slot?.classList.add('bg-green-900', 'border-green-400');
									} else {
										player2Slot?.classList.add('bg-green-900', 'border-green-400');
									}

									// Afficher le champion
									const winnerBox = root.querySelector('.winner-box');
									if (winnerBox) {
										const winnerName = winnerBox.querySelector('.text-5xl.mb-3.text-white');
										if (winnerName) {
											winnerName.textContent = match.winner;
										}
									}
								}
							}
						}
					});
				}

				// 🎮 Redirection vers un match
				if (response.method === "startMatch") {
					// Sauvegarder les infos du match dans sessionStorage
					sessionStorage.setItem('matchRound', response.matchRound);
					sessionStorage.setItem('matchOpponent', response.opponent);

					// Rediriger vers la page de jeu après 1 seconde
					setTimeout(() => {
						// navigate using History API instead of hash
						const raw = response.roomUrl || '/';
						const p = raw.startsWith('#') ? raw.replace(/^#\/?/, '/') : (raw.startsWith('/') ? raw : '/' + raw);
						history.pushState(null, '', p);
						window.dispatchEvent(new PopStateEvent('popstate'));
					}, 1000);
				}				// 🔙 Retour au bracket après un match
				if (response.method === "returnToBracket") {
					// Rediriger vers le bracket après 2 secondes (History API)
					setTimeout(() => {
						const p = '/tournamentOnline';
						history.pushState(null, '', p);
						window.dispatchEvent(new PopStateEvent('popstate'));
					}, 2000);
				}

				// Annonce du gagnant du tournoi
				if (response.method === "tournamentWinner") {
					sessionStorage.setItem('gamestate', 'finished');

					if (tournamentNameEl) {
						tournamentNameEl.textContent = '🏆 TOURNAMENT FINISHED 🏆';
					}

					// Afficher le gagnant dans la zone Winner
					// Chercher le div avec le trophée (maintenant text-5xl au lieu de text-6xl)
					const trophyDiv = root.querySelector('.text-5xl.mb-3.text-white');

					if (trophyDiv && trophyDiv.parentElement) {
						const winnerNameDiv = trophyDiv.nextElementSibling;

						if (winnerNameDiv) {
							winnerNameDiv.textContent = response.winner;
							winnerNameDiv.classList.remove('text-gray-400', 'text-sm');
							winnerNameDiv.classList.add('text-white', 'text-lg', 'font-bold', 'break-words');
						}
					}
				}

			}
		}

		// Bouton pour quitter le tournoi
		if (leaveTournamentBtn) {
			leaveTournamentBtn.addEventListener('click', () => {
				const payLoad = {
					"method": "leave",
					"clientId": clientId
				}
				if (ws)
					ws.send(JSON.stringify(payLoad));
				if (sessionStorage.getItem('gamestate') === 'playing-game') {
					if (ws)
						ws.close();

					window.removeEventListener('popstate', popstateHandler);
					const p = '/';
					history.pushState(null, '', p);
					window.dispatchEvent(new PopStateEvent('popstate'));
					return ;
				}

				window.removeEventListener('popstate', popstateHandler);
				const p = '/tournamentRoom';
				history.pushState(null, '', p);
				window.dispatchEvent(new PopStateEvent('popstate'));
			});
		}

		const popstateHandler = (event: PopStateEvent) => {
			const path = window.location.pathname.toLowerCase();
			// If we're still on a tournament-related page (Tournament Online or Game Online), don't notify server about leaving
			if (path.includes('tournamentonline') || path.includes('gameonlinetournament')) {
				window.removeEventListener('popstate', popstateHandler);
				return;
			}
			const payLoad = {
				"method": "leave",
				"clientId": clientId
			}

			if (ws)
				ws.send(JSON.stringify(payLoad));

			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);
	}
};


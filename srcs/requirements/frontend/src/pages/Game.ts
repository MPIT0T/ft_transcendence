import type { Page } from "../interface/gameInterface.js"
import { GameComponent } from "../components/GameComponent.js";
import { createCountdown } from "../utils/countdown.js";

let currentGame: GameComponent | null = null;

// Vérifier si on est en mode tournoi
function isTournamentMode(): boolean {
	return window.location.search.includes('mode=tournament');
}

function getTournamentData(): any | null {
	const data = sessionStorage.getItem('localTournamentMatch');
	if (data) {
		try {
			return JSON.parse(data);
		} catch {
			return null;
		}
	}
	return null;
}

export const Game: Page = {
	render() {
		const tournamentData = getTournamentData();
		const isTournament = isTournamentMode() && tournamentData;
		
		const player1Name = isTournament ? tournamentData.player1 : 'Joueur 1';
		const player2Name = isTournament ? tournamentData.player2 : 'Joueur 2';
		
		return `
<div class="mt-24">
	${isTournament ? `
	<div class="text-center mb-4">
		<span class="text-2xl text-yellow-400 font-bold">🏆 Mode Tournoi</span>
	</div>
	` : ''}
	<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
		<div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
		<div class="relative z-10">
			<div class="flex items-center justify-between px-6 pt-2">
				<span id="player1-name" class="font-semibold text-5xl text-blue-400">${player1Name}</span>
				<span id="score" class="text-5xl font-extrabold tracking-wide"></span>
				<span id="player2-name" class="font-semibold text-5xl text-red-400">${player2Name}</span>
			</div>
			<div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
				<span>W/S</span>
				<span id="winning-score-info">Premier à <span id="winning-score-display" class="text-yellow-400 font-bold">5</span></span>
				<span>↑/↓</span>
			</div>
		</div>
	</div>
	<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
		<div id="game-container" class="mb-8">
		<!-- Game component will be mounted here -->
		</div>
		<div class="flex gap-4 items-center mb-8 z-100">
			<button
					id="start-btn"
					class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-green-500">
				Jouer
			</button>
			<button
					id="restart-btn"
					class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:border-blue-500 hover:bg-gray-700/50 ${isTournament ? 'hidden' : ''}">
				Recommencer
			</button>
			${isTournament ? `
			<button
					id="quit-tournament-btn"
					class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:border-red-500 hover:bg-gray-700/50">
				Quitter le tournoi
			</button>
			` : ''}
		</div>
	</div>
	<div id="start-modal" class="fixed inset-0 flex justify-center items-center z-75 hidden">
		<div id="start-modal-text" class="text-8xl font-bold text-gray-50 mb-4 ml-4 text-center px-16 py-16">
			- 3 -
		</div>
	</div>

	<!-- Modal de sélection du nombre de points (local 1v1) -->
	<div id="points-modal" class="fixed inset-0 flex justify-center items-center z-80 hidden bg-black/60">
		<div class="border border-gray-50 bg-gray-900/90 p-6 max-w-md w-full mx-4 text-center">
			<h3 class="text-2xl text-yellow-400 font-bold mb-4">Choisir le nombre de points</h3>
			<p class="text-gray-300 mb-4">Sélectionnez le score cible pour gagner la partie</p>
			<div class="flex gap-3 justify-center mb-6">
				<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="3">3</button>
				<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="5">5</button>
				<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="7">7</button>
				<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="11">11</button>
			</div>
			<div class="flex gap-3 justify-center">
				<button id="confirm-points-btn" class="px-6 py-3 font-bold border-2 border-green-500 text-green-400 disabled:opacity-40" disabled>Confirmer</button>
				<button id="cancel-points-btn" class="px-6 py-3 font-bold border border-gray-50 text-gray-50">Exit</button>
			</div>
		</div>
	</div>
	
	<!-- Modal fin de match tournoi -->
	<div id="tournament-winner-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4 text-center">
			<h3 class="text-3xl text-green-400 font-bold mb-4">🎉 Match terminé !</h3>
			<p class="text-gray-200 text-xl mb-2">Vainqueur :</p>
			<p id="match-winner-name" class="text-4xl text-yellow-400 font-bold mb-6"></p>
			<button 
				id="next-match-btn"
				class="w-full py-3 text-white border border-gray-50 hover:bg-gray-700/50 hover:border-green-500 transition-colors font-bold">
				➡️ Match suivant
			</button>
		</div>
	</div>
	
	<!-- Modal fin de tournoi -->
	<div id="tournament-end-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4 text-center">
			<h3 class="text-3xl text-yellow-400 font-bold mb-4">🏆 TOURNOI TERMINÉ 🏆</h3>
			<p class="text-gray-200 text-xl mb-2">Le champion est :</p>
			<p id="tournament-champion" class="text-4xl text-green-400 font-bold mb-6"></p>
			<button 
				id="finish-tournament-btn"
				class="w-full py-3 text-white border border-gray-50 hover:bg-gray-700/50 transition-colors font-bold">
				🔄 Retour au lobby
			</button>
		</div>
	</div>
</div>
		`;
	},

	mount(root) {
		// Disable the global layout login button while on the game page
		const layoutLoginBtn = document.querySelector('#login-btn') as HTMLButtonElement | null;
		let _prevLoginBtnClass: string | null = null;
		let _prevLoginBtnDisabled: boolean | null = null;
		if (layoutLoginBtn) {
			_prevLoginBtnClass = layoutLoginBtn.className;
			_prevLoginBtnDisabled = layoutLoginBtn.disabled;
			layoutLoginBtn.disabled = true;
			// visually indicate disabled state
			layoutLoginBtn.className = `${layoutLoginBtn.className} opacity-50 pointer-events-none`;
		}

		// When leaving the page (popstate), restore the login button
		const _restoreLoginBtn = () => {
			if (layoutLoginBtn) {
				if (_prevLoginBtnClass !== null) layoutLoginBtn.className = _prevLoginBtnClass;
				if (_prevLoginBtnDisabled !== null) layoutLoginBtn.disabled = _prevLoginBtnDisabled;
			}
		};

		const popstateHandler = (_event: PopStateEvent) => {
			_restoreLoginBtn();
			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);

		// Cleanup previous game if exists
		if (currentGame) {
			currentGame.destroy();
		}

		let canStart = false;

		const startBtn = root.querySelector('#start-btn') as HTMLButtonElement;
		const restartBtn = root.querySelector('#restart-btn') as HTMLButtonElement;
		const gameContainer = root.querySelector('#game-container') as HTMLElement;
		const score = root.querySelector('#score') as HTMLElement;
		
		const startModal = root.querySelector('#start-modal') as HTMLElement;
		const startModalText = root.querySelector('#start-modal-text') as HTMLElement;

		

		const countdown = createCountdown();

		if (startBtn && gameContainer && score) {
				// Tournament mode variables
				const isTournament = isTournamentMode();
				let tournamentData = getTournamentData();
				let winningScore = 5; // Score pour gagner un match (modifiable via modal)

				// Points modal elements
				const pointsModal = root.querySelector('#points-modal') as HTMLDivElement | null;
				const pointsOptions = root.querySelectorAll('.points-option');
				const confirmPointsBtn = root.querySelector('#confirm-points-btn') as HTMLButtonElement | null;
				const cancelPointsBtn = root.querySelector('#cancel-points-btn') as HTMLButtonElement | null;

				// If not tournament mode, show the points modal to let user choose match length
				if (!isTournament && pointsModal) {
					pointsModal.classList.remove('hidden');
					pointsModal.classList.add('flex');
					// While modal is open, disable the main start button to avoid conflicts
					if (startBtn) {
						startBtn.disabled = true;
						startBtn.classList.add('opacity-50', 'pointer-events-none');
					}

					let selectedScore: number | null = null;
					pointsOptions.forEach(btn => {
						btn.addEventListener('click', () => {
							pointsOptions.forEach(b => b.classList.remove('border-yellow-500', 'text-yellow-400', 'bg-yellow-500/20'));
							(btn as HTMLElement).classList.add('border-yellow-500', 'text-yellow-400', 'bg-yellow-500/20');
							selectedScore = parseInt((btn as HTMLElement).getAttribute('data-score') || '5');
							if (confirmPointsBtn) confirmPointsBtn.disabled = false;
						});
					});

					if (confirmPointsBtn) {
						confirmPointsBtn.addEventListener('click', async () => {
							if (selectedScore) {
								winningScore = selectedScore;
								const wsEl = root.querySelector('#winning-score-display') as HTMLElement | null;
								if (wsEl) wsEl.textContent = String(winningScore);
							}
							if (pointsModal) {
								pointsModal.classList.add('hidden');
								pointsModal.classList.remove('flex');
							}
							// Re-enable start button visually (we'll start the match automatically)
							if (startBtn) {
								startBtn.disabled = true; // keep disabled while countdown runs
								startBtn.classList.add('opacity-50', 'pointer-events-none');
							}
							// Start countdown and begin the match automatically
							try {
								await countdown.start(startModal, startModalText);
								canStart = true;
								if (currentGame) currentGame.setCanStart(true);
								// Update start button to Pause and enable it
								if (startBtn) {
									startBtn.disabled = false;
									startBtn.classList.remove('opacity-50', 'pointer-events-none');
									startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-red-500";
									startBtn.textContent = "Pause";
								}
								// Hide restart during active match
								if (restartBtn) restartBtn.classList.add('hidden');
							} catch (e: any) {
								if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
								// If aborted, keep everything paused and re-enable start button
								canStart = false;
								if (startBtn) {
									startBtn.disabled = false;
									startBtn.classList.remove('opacity-50', 'pointer-events-none');
									startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
									startBtn.textContent = "Jouer";
								}
							}
						});
					}

					if (cancelPointsBtn) {
						cancelPointsBtn.addEventListener('click', () => {
							// Exit to lobby
							history.pushState(null, '', '/localLobby');
							window.dispatchEvent(new PopStateEvent('popstate'));
						});
					}
				}

				// Hide restart button during an active match for local mode; show only at match end
				if (restartBtn && !isTournament) {
					restartBtn.classList.add('hidden');
				}

				// Initialize game component
				currentGame = new GameComponent(
					gameContainer,
					canStart,
					(p1, p2) => { 
					score.textContent = `${p1} : ${p2}`;
					
					// Vérifier si quelqu'un a gagné en mode tournoi
						if (isTournament && tournamentData) {
						if (p1 >= winningScore || p2 >= winningScore) {
							// Déterminer le vainqueur
							const winner = p1 >= winningScore ? tournamentData.player1 : tournamentData.player2;
							
							// Arrêter le jeu
							canStart = false;
							if (currentGame) currentGame.setCanStart(false);
							
							// Mettre à jour le bracket
							const bracket = tournamentData.bracket;
							const currentRound = tournamentData.round;
							const currentMatchIndex = tournamentData.matchIndex;
							
							if (bracket[currentRound] && bracket[currentRound].matches[currentMatchIndex]) {
								bracket[currentRound].matches[currentMatchIndex].winner = winner;
							}
							
							// Passer au match suivant
							let nextRound = currentRound;
							let nextMatchIndex = currentMatchIndex + 1;
							
							// Vérifier si on doit passer au round suivant
							if (nextMatchIndex >= bracket[currentRound].matches.length) {
								// Vérifier si c'est la finale
								if (bracket[currentRound].matches.length === 1) {
									// Tournoi terminé !
									const championEl = root.querySelector('#tournament-champion') as HTMLSpanElement;
									if (championEl) championEl.textContent = winner;
									
									const endModal = root.querySelector('#tournament-end-modal') as HTMLDivElement;
									if (endModal) {
										endModal.classList.remove('hidden');
										endModal.classList.add('flex');
									}
									
									// Nettoyer les données du tournoi
									sessionStorage.removeItem('localTournamentMatch');
									return;
								}
								
								// Générer le round suivant
								const winners = bracket[currentRound].matches.map((m: any) => m.winner).filter(Boolean);
								const nextRoundMatches: any[] = [];
								for (let i = 0; i < winners.length; i += 2) {
									nextRoundMatches.push({
										player1: winners[i],
										player2: winners[i + 1],
										winner: undefined
									});
								}
								if (nextRoundMatches.length > 0) {
									bracket.push({ round: bracket.length + 1, matches: nextRoundMatches });
								}
								
								nextRound = currentRound + 1;
								nextMatchIndex = 0;
							}
							
							// Préparer le prochain match
							const nextMatch = bracket[nextRound]?.matches[nextMatchIndex];
								if (nextMatch) {
								// Afficher le modal de victoire
								const winnerNameEl = root.querySelector('#match-winner-name') as HTMLSpanElement;
								if (winnerNameEl) winnerNameEl.textContent = winner;
								
								const winnerModal = root.querySelector('#tournament-winner-modal') as HTMLDivElement;
								if (winnerModal) {
									winnerModal.classList.remove('hidden');
									winnerModal.classList.add('flex');
								}
								
								// Sauvegarder les données pour le prochain match
								sessionStorage.setItem('localTournamentMatch', JSON.stringify({
									player1: nextMatch.player1,
									player2: nextMatch.player2,
									round: nextRound,
									matchIndex: nextMatchIndex,
									bracket: bracket,
									players: tournamentData.players
								}));
								}
						}
					} else {
						// Local (non-tournament) match end handling
						if (p1 >= winningScore || p2 >= winningScore) {
							// Stop the game and timer
							canStart = false;
							if (currentGame) currentGame.setCanStart(false);

							// Update start button to 'Jouer'
							startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
							startBtn.textContent = "Jouer";

							// Show the restart button so user can relaunch same-match with same winningScore
							if (restartBtn) restartBtn.classList.remove('hidden');
						}
					}
				},
				async (state: boolean) => {
					if (state) {
						// Do not run countdown if this goal ended the match
						const sc1 = currentGame?.getScoreP1() ?? 0;
						const sc2 = currentGame?.getScoreP2() ?? 0;
						if (sc1 >= winningScore || sc2 >= winningScore) {
							return;
						}
						try {
							await countdown.start(startModal, startModalText);
						} catch (e: any) {
							if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
						}
					}
				}
			);

			

			// Bouton "Match suivant" en mode tournoi
			const nextMatchBtn = root.querySelector('#next-match-btn') as HTMLButtonElement;
			if (nextMatchBtn) {
				nextMatchBtn.addEventListener('click', () => {
					// Recharger la page pour le prochain match
					history.replaceState(null, '', '/game?mode=tournament');
					window.location.reload();
				});
			}
			
			// Bouton "Retour au lobby" après fin de tournoi
			const finishTournamentBtn = root.querySelector('#finish-tournament-btn') as HTMLButtonElement;
			if (finishTournamentBtn) {
				finishTournamentBtn.addEventListener('click', () => {
					sessionStorage.removeItem('localTournamentMatch');
					history.pushState(null, '', '/gameLobby');
					window.dispatchEvent(new PopStateEvent('popstate'));
				});
			}
			
			// Bouton "Quitter le tournoi"
			const quitTournamentBtn = root.querySelector('#quit-tournament-btn') as HTMLButtonElement;
			if (quitTournamentBtn) {
				quitTournamentBtn.addEventListener('click', () => {
					if (confirm('Êtes-vous sûr de vouloir quitter le tournoi ?')) {
						sessionStorage.removeItem('localTournamentMatch');
						history.pushState(null, '', '/gameLobby');
						window.dispatchEvent(new PopStateEvent('popstate'));
					}
				});
			}

			// Start/Pause button
			startBtn.addEventListener('click', async () => {
				// If the local match is already finished, show points modal instead of toggling
				const isTournamentLocal = isTournamentMode();
				const localMatchOver = (currentGame?.getScoreP1() ?? 0) >= winningScore || (currentGame?.getScoreP2() ?? 0) >= winningScore;
				if (!isTournamentLocal && localMatchOver) {
					const pointsModalEl = root.querySelector('#points-modal') as HTMLDivElement | null;
					if (pointsModalEl) {
						pointsModalEl.classList.remove('hidden');
						pointsModalEl.classList.add('flex');
					}
					return;
				}

				// Toggle play/pause
				canStart = !canStart;

				// Update button appearance and run countdown when starting
				if (canStart) {
					startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-red-500";
					startBtn.textContent = "Pause";
					if (restartBtn) restartBtn.classList.add('hidden');
					try {
						await countdown.start(startModal, startModalText);
					} catch (e: any) {
						if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
						// If aborted, revert the canStart/UI state back to paused
						canStart = false;
						startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
						startBtn.textContent = "Jouer";
					}
				} else {
					startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
					startBtn.textContent = "Jouer";
					// Cancel any ongoing start animation
					countdown.abort();
				}

				// Update game state
				if (currentGame) {
					currentGame.setCanStart(canStart);
				}
			});

			// Restart button (only in non-tournament mode)
			if (restartBtn && !isTournament) {
				restartBtn.addEventListener('click', async () => {
					if (currentGame) {
						// Pause the game first and ensure ball is not moving
						canStart = false;
						currentGame.setCanStart(false);

						// Cancel any ongoing start animation
						countdown.abort();

						// Restart the game state (reset scores, ball, players)
						currentGame.restart();

						// Hide restart while countdown runs
						if (restartBtn) restartBtn.classList.add('hidden');

						// Update START button visually to 'Pause' while countdown runs
						startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-red-500";
						startBtn.textContent = "Pause";

						// Run the countdown animation then actually resume the game (ensure ball not launched before)
						try {
							await countdown.start(startModal, startModalText);
							canStart = true;
							if (currentGame) currentGame.setCanStart(true);
						} catch (e: any) {
							if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
							// If animation aborted, keep game paused
							canStart = false;
							if (currentGame) currentGame.setCanStart(false);
							startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
							startBtn.textContent = "Jouer";
						}
					}
				});
			}
		}
	}
}

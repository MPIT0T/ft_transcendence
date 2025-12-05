/**
 * @fileoverview Local 2-player game page component
 * Handles game setup, countdown, scoring, and match end logic
 */

import type { Page } from "../interface/gameInterface.js"
import { GameComponent } from "../components/GameComponent.js";
import { createCountdown } from "../utils/countdown.js";
import { t } from "../utils/i18n.js";

/** Current game instance */
let currentGame: GameComponent | null = null;

/**
 * Local game page component
 * Provides UI for playing a 2-player Pong match on the same device
 */
		export const Game: Page = {
		/**
		 * Renders the game page HTML
		 * @returns HTML string for the game page
		 */
		render() {
			const player1Name = t('game.player1');
			const player2Name = t('game.player2');
			return `
	<div class="mt-24">
		<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
			<div class="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 animate-gradientShift bg-[length:150%_150%] opacity-30"></div>
			<div class="relative z-10">
				<div class="flex items-center justify-between px-6 pt-2">
					<span id="player1-name" class="font-semibold text-5xl text-gray-50">${player1Name}</span>
					<span id="score" class="text-5xl font-extrabold tracking-wide">0 : 0</span>
					<span id="player2-name" class="font-semibold text-5xl text-gray-50">${player2Name}</span>
				</div>
				<div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
					<span>W/S</span>
					<span>
            <span id="winning-score-info" data-i18n="game.firstTo">Premier à</span>
            <span id="winning-score-display" class="text-yellow-400 font-bold">5</span>
          </span>
					<span>↑/↓</span>
				</div>
			</div>
		</div>
		<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
			<div id="game-container" class="mb-8"></div>
			<div class="flex gap-4 items-center mb-8 z-100">
				<button id="start-btn" class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-green-500" data-i18n="game.play">Jouer</button>
				<button id="restart-btn" class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:border-blue-500 hover:bg-gray-700/50" data-i18n="game.restart">Recommencer</button>
			</div>
		</div>
		<div id="start-modal" class="fixed inset-0 flex justify-center items-center z-75 hidden">
			<div id="start-modal-text" class="text-8xl font-bold text-gray-50 mb-4 ml-4 text-center px-16 py-16">- 3 -</div>
		</div>

		<!-- Match end modal -->
		<div id="match-end-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
			<div class="border border-gray-50 p-8 max-w-md w-full mx-4 text-center">
				<h3 class="text-2xl text-gray-300 font-bold mb-2" data-i18n="game.matchFinished">Match terminé !</h3>
				<p id="match-winner-name" class="text-4xl text-green-400 font-bold mb-2"></p>
				<p id="match-final-score" class="text-xl text-gray-400 mb-6"></p>
				<div class="flex gap-3">
					<button id="close-match-modal-btn" class="flex-1 py-3 text-white border border-gray-50 hover:bg-gray-700/50 hover:border-yellow-500 transition-colors font-bold" data-i18n="game.close">Fermer</button>
					<button id="leave-to-lobby-btn" class="flex-1 py-3 text-white border border-gray-50 hover:bg-gray-700/50 hover:border-red-500 font-bold" data-i18n="game.backToLobby">Retour au lobby</button>
				</div>
			</div>
		</div>

		<!-- Modal de sélection du nombre de points (local 1v1) -->
		<div id="points-modal" class="fixed inset-0 flex justify-center items-center z-80 hidden backdrop-blur-lg">
			<div class="border border-gray-50 p-6 max-w-md w-full mx-4 text-center">
				<h3 class="text-2xl text-yellow-400 font-bold mb-4" data-i18n="game.choosePoints">Choisir le nombre de points</h3>
				<p class="text-gray-300 mb-4" data-i18n="game.selectTarget">Sélectionnez le score cible pour gagner la partie</p>
				<div class="flex gap-3 justify-center mb-6">
					<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="3">3</button>
					<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="5">5</button>
					<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="10">10</button>
					<button class="points-option px-5 py-2 border border-gray-600 text-gray-400 hover:border-gray-50 hover:text-gray-50 transition-colors" data-score="15">15</button>
				</div>
				<div class="flex gap-3 justify-center">
					<button id="confirm-points-btn" class="px-6 py-3 font-bold border border-gray-50 text-gray-50 disabled:opacity-40" disabled data-i18n="game.confirm">Confirmer</button>
					<button id="cancel-points-btn" class="px-6 py-3 font-bold border border-gray-50 text-gray-50 hover:bg-gray-700/50 hover:border-red-500" data-i18n="game.exit">Exit</button>
				</div>
			</div>
		</div>
	</div>
		`;
	},

	/**
	 * Mounts the game page and initializes event handlers
	 * Sets up points selection, countdown, game controls, and match end modal
	 * @param root - Root element containing the rendered page
	 */
	mount(root) {
		const layoutLoginBtn = document.querySelector('#login-btn') as HTMLButtonElement | null;
		let _prevLoginBtnClass: string | null = null;
		let _prevLoginBtnDisabled: boolean | null = null;
		if (layoutLoginBtn) {
			_prevLoginBtnClass = layoutLoginBtn.className;
			_prevLoginBtnDisabled = layoutLoginBtn.disabled;
			layoutLoginBtn.disabled = true;
			layoutLoginBtn.className = `${layoutLoginBtn.className} opacity-50 pointer-events-none`;
		}

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

		const matchEndModal = root.querySelector('#match-end-modal') as HTMLDivElement | null;
		const matchWinnerName = root.querySelector('#match-winner-name') as HTMLElement | null;
		const matchFinalScore = root.querySelector('#match-final-score') as HTMLElement | null;
		const closeMatchModalBtn = root.querySelector('#close-match-modal-btn') as HTMLButtonElement | null;
		const leaveToLobbyBtn = root.querySelector('#leave-to-lobby-btn') as HTMLButtonElement | null;


		const countdown = createCountdown();

		if (startBtn && gameContainer && score) {
				let winningScore = 5; // Score pour gagner un match (modifiable via modal)

				const pointsModal = root.querySelector('#points-modal') as HTMLDivElement | null;
				const pointsOptions = root.querySelectorAll('.points-option');
				const confirmPointsBtn = root.querySelector('#confirm-points-btn') as HTMLButtonElement | null;
				const cancelPointsBtn = root.querySelector('#cancel-points-btn') as HTMLButtonElement | null;

				if (pointsModal) {
					pointsModal.classList.remove('hidden');
					pointsModal.classList.add('flex');
					if (startBtn) {
					startBtn.classList.add('hidden');
				}

				// Ensure confirm button has no hover until user selects a score
				if (confirmPointsBtn) {
					confirmPointsBtn.disabled = true;
					confirmPointsBtn.classList.remove('hover:bg-gray-700/50', 'hover:border-green-500');
					}

					let selectedScore: number | null = null;
					pointsOptions.forEach(btn => {
					const btnEl = btn as HTMLElement;
					btnEl.addEventListener('click', () => {
						const alreadySelected = btnEl.classList.contains('border-yellow-500');
						// Clear selection on all buttons
						pointsOptions.forEach(b => (b as HTMLElement).classList.remove('border-yellow-500', 'text-yellow-400', 'bg-yellow-500/20'));
						if (!alreadySelected) {
							// Select this one
							btnEl.classList.add('border-yellow-500', 'text-yellow-400', 'bg-yellow-500/20');
							selectedScore = parseInt(btnEl.getAttribute('data-score') || '5');
							if (confirmPointsBtn) {
								confirmPointsBtn.disabled = false;
								confirmPointsBtn.classList.add('hover:bg-gray-700/50', 'hover:border-green-500');
							}
						} else {
							// Deselect (no selection)
							selectedScore = null;
							if (confirmPointsBtn) {
								confirmPointsBtn.disabled = true;
								confirmPointsBtn.classList.remove('hover:bg-gray-700/50', 'hover:border-green-500');
							}
						}
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
							startBtn.classList.remove('hidden');
							}
							// Start countdown and begin the match automatically
							try {
								await countdown.start(startModal, startModalText);
								canStart = true;
								if (currentGame) currentGame.setCanStart(true);
								// Update start button to Pause and enable it
								if (startBtn) {
								startBtn.classList.remove('hidden');
									startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-red-500";
									startBtn.textContent = t('game.pause');
								}
								// Hide restart during active match
								if (restartBtn) restartBtn.classList.add('hidden');
							} catch (e: any) {
								if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
								// If aborted, keep everything paused and re-enable start button
								canStart = false;
								if (startBtn) {
								startBtn.classList.remove('hidden');
									startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
									startBtn.textContent = t('game.play');
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

				// Hide restart button during an active match; show only at match end
				if (restartBtn) {
					restartBtn.classList.add('hidden');
				}

				// Initialize game component (local 1v1)
				currentGame = new GameComponent(
					gameContainer,
					canStart,
					(p1, p2) => {
						score.textContent = `${p1} : ${p2}`;
						// Local (non-tournament) match end handling
						if (p1 >= winningScore || p2 >= winningScore) {
							// Stop the game
							canStart = false;

							if (currentGame) currentGame.setCanStart(false);

							const winner = p1 >= winningScore ? t('game.player1') : t('game.player2');
							if (matchWinnerName) matchWinnerName.textContent = winner;
							if (matchFinalScore) matchFinalScore.textContent = t('game.scoreDisplay', { score1: p1.toString(), score2: p2.toString() });
						// Hide start/restart controls while the match-end modal is visible
							if (matchEndModal) {
							// startBtn.classList.add('hidden');
							// restartBtn.classList.add('hidden');
								matchEndModal.classList.remove('hidden');
								matchEndModal.classList.add('flex');
							}

						startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500 hidden";
							startBtn.textContent = t('game.play');
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
					if (confirm(t('tournamentMatch.confirmQuit'))) {
						sessionStorage.removeItem('localTournamentMatch');
						history.pushState(null, '', '/gameLobby');
						window.dispatchEvent(new PopStateEvent('popstate'));
					}
				});
			}

			// Start/Pause button
			startBtn.addEventListener('click', async () => {
				// If the local match is already finished, show points modal instead of toggling
				const isTournamentLocal = false;
				const localMatchOver = (currentGame?.getScoreP1() ?? 0) >= winningScore || (currentGame?.getScoreP2() ?? 0) >= winningScore;
				if (!isTournamentLocal && localMatchOver) {

					if (currentGame) {
						currentGame.restart();
					}
					if (startBtn && restartBtn) {
						startBtn.classList.add('hidden');
						restartBtn.classList.add('hidden');
					}
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
					startBtn.textContent = t('game.pause');
					if (restartBtn) restartBtn.classList.add('hidden');
					try {
						await countdown.start(startModal, startModalText);
					} catch (e: any) {
						if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
						// If aborted, revert the canStart/UI state back to paused
						canStart = false;
						startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
						startBtn.textContent = t('game.play');
					}
				} else {
					startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
					startBtn.textContent = t('game.play');
					// Cancel any ongoing start animation
					countdown.abort();
				}

				// Update game state
				if (currentGame) {
					currentGame.setCanStart(canStart);
				}
			});

			// Restart button
			if (restartBtn) {
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
						startBtn.textContent = t('game.pause');

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
							startBtn.textContent = t('game.play');
						}
					}
				});
			}

			// Match end modal controls
			if (closeMatchModalBtn) {
				closeMatchModalBtn.addEventListener('click', () => {
					if (matchEndModal) {
						matchEndModal.classList.add('hidden');
						matchEndModal.classList.remove('flex');
					}
					if (startBtn) startBtn.classList.remove('hidden');
					if (restartBtn) restartBtn.classList.remove('hidden');
				});
			}

			if (leaveToLobbyBtn) {
				leaveToLobbyBtn.addEventListener('click', () => {
					sessionStorage.removeItem('localTournamentMatch');
					history.pushState(null, '', '/localLobby');
					window.dispatchEvent(new PopStateEvent('popstate'));
				});
			}
		}
	}
}

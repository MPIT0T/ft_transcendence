/**
 * @fileoverview Online tournament bracket page component displaying tournament progression.
 * Shows real-time bracket updates, match results, and handles tournament navigation.
 */

import type { Page } from "../../../interface/gameInterface"
import { ws } from "./OnlineTournamentRoom";
import { Layout } from "../../Layout";
import { t } from "../../../utils/i18n";

/**
 * Online tournament bracket page component displaying the tournament bracket.
 * Shows quarter-finals, semi-finals, final, and winner with real-time updates.
 */
export const OnlineTournamentBracket: Page = {
  /**
   * Renders the tournament bracket HTML with all rounds and player slots.
   * @returns HTML string containing the bracket interface with leave button
   */
  render() {
    return `
		<div class="flex gap-16 p-6 pt-24 items-start justify-center">
			<!-- Contenu principal (center) -->
			<div class="flex-1">
				<!-- Header avec style arcade -->
        <div class="w-full mb-12 flex items-center justify-center mb-4 border border-gray-50 p-4 backdrop-blur-2xs">
          <h1 id="tournament-name" class="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-[length:400%_400%] animate-gradientShift">
            ft_tournoi
          </h1>
        </div>

				<!-- Tournament Bracket -->
				<div class="mx-auto">
					<div class="flex justify-center h-full items-start gap-8">
						<!-- Round 1: Quarter Finals -->
						<div class="flex flex-col h-full min-w-xs gap-8">
							<div class="text-center border border-gray-50 p-2 backdrop-blur-2xs">
								<h3 class="text-2xl font-bold text-white" data-i18n="tournamentOnline.quarterFinal">Quart de Finale</h3>
							</div>
							<div class="flex flex-col gap-8">
								<!-- Match 1 -->
								<div class="border border-gray-50 p-3 w-64 w-full backdrop-blur-2xs" data-match="quarter-1">
									<div class="player-slot p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-slot="0">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border border-gray-50 backdrop-blur-2xs" data-slot="1">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
								</div>

								<!-- Match 2 -->
								<div class="border border-gray-50 p-3 w-64 w-full backdrop-blur-2xs" data-match="quarter-2">
									<div class="player-slot p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-slot="2">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border border-gray-50 backdrop-blur-2xs" data-slot="3">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
								</div>

								<!-- Match 3 -->
								<div class="border border-gray-50 p-3 w-full w-64 backdrop-blur-2xs" data-match="quarter-3">
									<div class="player-slot p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-slot="4">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border border-gray-50 backdrop-blur-2xs" data-slot="5">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
								</div>

								<!-- Match 4 -->
								<div class="border border-gray-50 p-3 w-full w-64 backdrop-blur-2xs" data-match="quarter-4">
									<div class="player-slot p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-slot="6">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="player-slot p-2 border border-gray-50 backdrop-blur-2xs" data-slot="7">
										<span class="player-name text-gray-400" data-i18n="tournamentOnline.waiting">En attente...</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 2: Semi Finals -->
						<div class="flex flex-col min-w-xs gap-8">
							<div class="text-center w-full border border-gray-50 p-2 backdrop-blur-2xs">
								<h3 class="text-2xl font-bold text-white" data-i18n="tournamentOnline.semiFinal">Demi-Finale</h3>
							</div>
							<div class="flex flex-col gap-32 mt-32">
								<!-- Semi 1 -->
								<div class="border border-gray-50 w-full p-3 w-64 backdrop-blur-2xs" data-match="semi-1">
									<div class="p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-player="1">
										<span class="player-name text-gray-400">???</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="p-2 border border-gray-50 backdrop-blur-2xs" data-player="2">
										<span class="player-name text-gray-400">???</span>
									</div>
								</div>

								<!-- Semi 2 -->
								<div class="border border-gray-50 p-3 w-full w-64 backdrop-blur-2xs" data-match="semi-2">
									<div class="p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-player="1">
										<span class="player-name text-gray-400">???</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="p-2 border border-gray-50 backdrop-blur-2xs" data-player="2">
										<span class="player-name text-gray-400">???</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 3: Final -->
						<div class="flex flex-col min-w-xs gap-8">
							<div class="text-center mb-4 w-full border border-gray-50 p-2 backdrop-blur-2xs">
								<h3 class="text-2xl font-bold text-white" data-i18n="tournamentOnline.final">Finale</h3>
							</div>
							<div class="flex flex-col justify-center mt-64">
								<div class="border border-gray-50 w-full p-3 w-64 backdrop-blur-2xs" data-match="final">
									<div class="p-2 mb-1 border border-gray-50 backdrop-blur-2xs" data-player="1">
										<span class="player-name text-gray-400">???</span>
									</div>
									<div class="text-center text-white text-lg my-1 flex items-center justify-center gap-3">
										<span class="score-1 text-indigo-400 font-bold"></span>
										<span>- VS -</span>
										<span class="score-2 text-indigo-400 font-bold"></span>
									</div>
									<div class="p-2 border border-gray-50 backdrop-blur-2xs" data-player="2">
										<span class="player-name text-gray-400">???</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Winner -->
						<div class="flex flex-col min-w-xs gap-8">
							<div class="text-center mb-4 w-full border border-gray-50 p-2 backdrop-blur-2xs">
								<h3 class="text-2xl font-bold text-white" data-i18n="tournamentOnline.winner">Vainqueur</h3>
							</div>
							<div class="flex flex-col justify-center mt-64">
								<div class="border border-gray-50 p-4 text-center backdrop-blur-2xs w-full">
								  <div class="flex flex-col items-center gap-3">
								    <div class="w-16 h-16">
								      <img id="winner-profile-pic" class="w-16 h-16 object-cover rounded-full border border-gray-50 mx-auto block" src="anonymous.png" alt="profile picture"/>
								    </div>
								    <div id="winner-name" class="text-gray-400 text-lg wrap-break-word overflow-hidden">???</div>
								  </div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Leave Button -->
				<div class="text-center mt-8">
					<button 
						id="leave-tournament-btn"
						class="px-8 py-3 text-gray-50 backdrop-blur-xs border border-gray-50 hover:bg-gray-700/50 hover:border-purple-500 font-semibold transition-all transform" data-i18n="tournamentOnline.leaveTournament"
					>
						Leave Tournament
					</button>
				</div>
			</div>
		</div>
		`;
  },

  /**
   * Mounts WebSocket message handlers and event listeners for the tournament bracket.
   * Handles player join/leave updates, match state synchronization, and tournament progression.
   * @param root - Root element containing the rendered bracket page
   */
  mount(root: HTMLElement): void {

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

    Layout.redirectIfNotLoggedIn('/', true);

    const tournamentId = sessionStorage.getItem('tournamentId');
    const tournamentName = sessionStorage.getItem('tournamentName');
    const clientId = sessionStorage.getItem('clientId');

    const tournamentNameEl = root.querySelector('#tournament-name') as HTMLElement;
    const playerCountEl = root.querySelector('#player-count') as HTMLElement;
    const currentPlayerNameEl = root.querySelector('#current-player-name') as HTMLElement;
    const leaveTournamentBtn = root.querySelector('#leave-tournament-btn') as HTMLButtonElement;

    if (tournamentNameEl)
      tournamentNameEl.textContent = tournamentName || 'ft_tournoi';

    const payLoad = {
      "method": "readyT",
      "clientId": clientId,
      "tournamentId": tournamentId,
      "state": 1
    }
    if (ws)
      ws.send(JSON.stringify(payLoad));

    const popstateHandler = (event: PopStateEvent) => {
      const path = window.location.pathname.toLowerCase();
      // If we're still on a tournament-related page (Tournament Online or LocalGame Online), don't notify server about leaving
      if (path.includes('online-tournament') || path.includes('online-tournament-game')) {
        return;
      }
      _restoreLoginBtn();
      
      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }

      if (ws)
        ws.send(JSON.stringify(payLoad));

      // if (sessionStorage.getItem('gamestate') === 'playing-game') {
      //   if (ws)
      //     ws.close();
      // }

      sessionStorage.removeItem('tournamentName');
      sessionStorage.removeItem('tournamentId');
      sessionStorage.removeItem('gamestate');
      sessionStorage.removeItem('player1Name');
      sessionStorage.removeItem('player2Name');
      sessionStorage.removeItem('roomId');

      window.removeEventListener('popstate', popstateHandler);
    };

    if (ws) {
      window.addEventListener('popstate', popstateHandler);
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
              nameEl.textContent = t('tournamentOnline.waiting');
              nameEl.classList.remove('text-white');
              nameEl.classList.add('text-gray-400');
              // retirer les éventuels styles de gagnant
              slot.classList.remove('bg-purple-900/30', 'border-purple-400');
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

        if (response.method === "Start") {
          sessionStorage.setItem('gamestate', 'playing-game');
          if (tournamentNameEl) tournamentNameEl.textContent = t('tournamentOnline.quarterFinal');
        }

        if (response.method === "tournamentState") {
          const allMatches = response.allMatches;

          let currentRound = 'Quarts de Finale';
          const hasCompletedQuarters = allMatches.filter((m: any) => m.round === 'Quarter Finals' && m.status === 'completed').length;
          const hasCompletedSemis = allMatches.filter((m: any) => m.round === 'Semi Finals' && m.status === 'completed').length;

          if (hasCompletedSemis === 2) {
            currentRound = 'Finale';
          } else if (hasCompletedQuarters === 4) {
            currentRound = 'Semi-Finales';
          }

          if (tournamentNameEl) {
            tournamentNameEl.textContent = currentRound;
          }

          allMatches.forEach((match: any) => {
            let matchBox = null;

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

                if (match.status === 'completed') {
                  const score1El = matchBox.querySelector('.score-1');
                  const score2El = matchBox.querySelector('.score-2');

                  if (score1El) score1El.textContent = match.score1;
                  if (score2El) score2El.textContent = match.score2;

                  if (match.winner === match.player1) {
                    slots[0]?.classList.add('bg-purple-900/30', 'border-purple-400');
                    slots[1]?.classList.add('border-gray-400/40');
                    name2?.classList.remove('text-white');
                    name2?.classList.add('text-gray-400');
                  } else {
                    slots[0]?.classList.add('border-gray-400/40');
                    name1?.classList.remove('text-white');
                    name1?.classList.add('text-gray-400');
                    slots[1]?.classList.add('bg-purple-900/30', 'border-purple-400');
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

                if (match.status === 'completed') {
                  const score1El = matchBox.querySelector('.score-1');
                  const score2El = matchBox.querySelector('.score-2');

                  if (score1El) score1El.textContent = match.score1;
                  if (score2El) score2El.textContent = match.score2;

                  if (match.winner === match.player1) {
                    player1Slot?.classList.add('bg-purple-900/30', 'border-purple-400');
                    player2Slot?.classList.add('border-gray-400/40');
                    name2?.classList.remove('text-white');
                    name2?.classList.add('text-gray-400');
                  } else {
                    player1Slot?.classList.add('border-gray-400/40');
                    name1?.classList.remove('text-white');
                    name1?.classList.add('text-gray-400');
                    player2Slot?.classList.add('bg-purple-900/30', 'border-purple-400');
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

                if (match.status === 'completed') {
                  const score1El = matchBox.querySelector('.score-1');
                  const score2El = matchBox.querySelector('.score-2');

                  if (score1El) score1El.textContent = match.score1;
                  if (score2El) score2El.textContent = match.score2;

                  if (match.winner === match.player1) {
                    player1Slot?.classList.add('bg-purple-900/30', 'border-purple-400');
                    player2Slot?.classList.add('border-gray-400/40', 'text-gray-400');
                    name2?.classList.remove('text-white');
                    name2?.classList.add('text-gray-400');
                  } else {
                    player1Slot?.classList.add('border-gray-400/40');
                    name1?.classList.remove('text-white');
                    name1?.classList.add('text-gray-400');
                    player2Slot?.classList.add('bg-purple-900/30', 'border-purple-400');
                  }

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

        if (response.method === "startMatch") {
          sessionStorage.setItem('matchRound', response.matchRound);
          sessionStorage.setItem('player1Name', response.player1Name);
          sessionStorage.setItem('player2Name', response.player2Name);
          sessionStorage.setItem('roomId', response.roomId);

          setTimeout(() => {
            const p = response.roomUrl;
            history.replaceState(null, '', p);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, 1000);
        }

        if (response.method === "returnToBracket") {
          setTimeout(() => {
            const p = '/online-tournament';
            history.replaceState(null, '', p);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, 2000);
        }

        if (response.method === "tournamentWinner") {
          sessionStorage.setItem('gamestate', 'finished');

          if (tournamentNameEl) {
            tournamentNameEl.textContent = t('tournamentLocal.tournamentFinished');
          }

          const winnerProfilePicEl = root.querySelector('#winner-profile-pic') as HTMLImageElement;
          const winnerNameEl = root.querySelector('#winner-name');
          let avatar: string = 'anonymous.png';
          fetch('/user/api/get-avatar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: response.winner}),
          }).then(res => {
            if (!res.ok) {
              return res.json().then(data => Promise.reject(data));
            }
            return res.json();
          }).then((data: { avatar: string }) => {
            avatar = data.avatar;
            if (winnerProfilePicEl) winnerProfilePicEl.src = avatar;
          }).catch(err => {
            const msg = err?.error || 'Impossible de recevoir l\'avatar du joueur';
            Layout.showNotification(msg, 'error');
          });

          if (winnerNameEl) {
            winnerNameEl.textContent = response.winner;
            winnerNameEl.classList.remove('text-gray-400', 'text-sm');
            winnerNameEl.classList.add('text-white', 'text-lg', 'font-bold', 'break-words');
          }
        }
      }
    } else {
      window.removeEventListener('popstate', popstateHandler);
      const p = '/';
      history.replaceState(null, '', p);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

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
          history.replaceState(null, '', p);
          window.dispatchEvent(new PopStateEvent('popstate'));
          return;
        }

        sessionStorage.removeItem('tournamentName');
        sessionStorage.removeItem('tournamentId');
        sessionStorage.removeItem('gamestate');
        sessionStorage.removeItem('player1Name');
        sessionStorage.removeItem('player2Name');
        sessionStorage.removeItem('roomId');

        window.removeEventListener('popstate', popstateHandler);
        const p = '/tournament-room';
        history.replaceState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }
};

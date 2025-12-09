/**
 * @fileoverview Online tournament game page component for tournament match gameplay.
 * Handles tournament-specific WebSocket communication and match progression.
 */

import type { Page } from "../../../interface/gameInterface"
import { GameComponentOnline } from "../../../components/GameComponentOnline";
import { ws } from "./OnlineTournamentRoom";
import {sleep} from "../../../utils/sleep";
import {Layout} from "../../Layout";
import { t } from "../../../utils/i18n";

/** Current game component instance for tournament match */
let currentGame: GameComponentOnline | null = null;

/** Interval ID for the game timer */
let timerInterval: number | null = null;

/** Total elapsed seconds in the current match */
let elapsedSeconds: number = 0;

/**
 * Online tournament game page component for playing tournament matches.
 * Displays match round info, player names, scores, and handles tournament progression.
 */
export const OnlineTournamentGame: Page = {
  /**
   * Renders the tournament match HTML with round title, player info, and game canvas.
   * @returns HTML string containing the tournament match interface
   */
  render() {
    return `
<div id="tournament-match-title" class="text-7xl text-center mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-[length:400%_400%] animate-gradientShift">
  tournament name
</div>
<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
  <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-[length:150%_150%] animate-gradientShift opacity-30"></div>
  <div class="relative z-10">
    <div class="flex items-center px-6 pt-2">
      <span>
        <img id="player-1-avatar" class="h-10 w-10 rounded-full border border-gray-50 mr-2" src="" alt="player 1 avatar">
      </span>
      <span id="player-1-name" class="font-semibold text-5xl flex-1 text-left">???</span>
      <span id="score" class="text-5xl font-extrabold tracking-wide"></span>
      <span id="player-2-name" class="font-semibold text-5xl flex-1 text-right">???</span>
      <span>
        <img id="player-2-avatar" class="h-10 w-10 rounded-full border border-gray-50" src="" alt="player 2 avatar">
      </span>
    </div>
    <div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
      <span id="player-1-elo" class="flex-1 text-left ml-1"></span>
      <span id="timer">00:00</span>
      <span id="player-2-elo" class="flex-1 text-right"></span>
    </div>
  </div>
</div>
<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
  <div id="game-container" class="mb-8"></div>
</div>
<div id="start-modal" class="fixed inset-0 flex justify-center items-center z-75 hidden">
  <div id="start-modal-text" class="text-8xl font-bold text-gray-50 mb-4 ml-4 text-center px-16 py-16">
    - 3 -
  </div>
</div>
    `;
  },

  /**
   * Mounts the tournament game component and WebSocket message handlers.
   * Initializes game state, handles match start/end, and manages tournament bracket navigation.
   * @param root - Root element containing the rendered game page
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

    const popstateHandler = (event: PopStateEvent) => {
      
      currentGame?.destroy();
      window.removeEventListener('popstate', popstateHandler);
    };

    Layout.redirectIfNotLoggedIn('/', true);

    const clientId = sessionStorage.getItem('clientId');
    const tournamentId = sessionStorage.getItem('tournamentId');
    let canStart = false;
    let waiting = true;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const matchTitleEl = root.querySelector('#tournament-match-title') as HTMLElement;
    const player1NameEl = root.querySelector('#player-1-name') as HTMLElement;
    const player2NameEl = root.querySelector('#player-2-name') as HTMLElement;
    const player1AvatarEl = root.querySelector('#player-1-avatar') as HTMLImageElement;
    const player2AvatarEl = root.querySelector('#player-2-avatar') as HTMLImageElement;
    const score = root.querySelector('#score') as HTMLElement;
    const timerEl = root.querySelector('#timer') as HTMLElement;
    const startModal = root.querySelector('#start-modal') as HTMLElement;
    const startModalText = root.querySelector('#start-modal-text') as HTMLElement;

    const formatTime = (s: number) => {
      const hours = Math.floor(s / 3600);
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    const updateTimerDisplay = () => {
      if (timerEl) {
        timerEl.textContent = formatTime(elapsedSeconds);
      }
    }

    const startTimer = () => {
      if (timerInterval !== null) return;
      timerInterval = window.setInterval(() => {
        elapsedSeconds += 1;
        updateTimerDisplay();
      }, 1000);
    };

    const stopTimer = () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };

    const startAnimation = async () => {
      startModal.classList.remove("hidden");
      await sleep(850);
      startModalText.classList.add('opacity-0');
      await sleep(150);
      startModalText.classList.remove("opacity-0");
      startModalText.textContent = "- 2 -";
      await sleep(850);
      startModalText.classList.add('opacity-0');
      await sleep(150);
      startModalText.classList.remove("opacity-0");
      startModalText.textContent = "- 1 -";
      await sleep(850);
      startModalText.classList.add('opacity-0');
      await sleep(150);
      startModalText.classList.remove("opacity-0");
      startModal.classList.add('hidden');
      startModalText.textContent = "- 3 -";
    }

    player1NameEl.textContent = sessionStorage.getItem('player1Name');
    player2NameEl.textContent = sessionStorage.getItem('player2Name');
    fetch('/user/api/get-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: sessionStorage.getItem('player1Name')})
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => Promise.reject(data));
        return res.json();
      })
      .then((data: { avatar: string }) => {
        player1AvatarEl.src = data.avatar || 'anonymous.png';
      })
      .catch(err => {
        const msg = err?.error || t('notifications.cannotGetAvatar');
        Layout.showNotification(msg, 'error');
      });
    fetch('/user/api/get-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: sessionStorage.getItem('player2Name')})
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => Promise.reject(data));
        return res.json();
      })
      .then((data: { avatar: string }) => {
        player2AvatarEl.src = data.avatar || 'anonymous.png';
      })
      .catch(err => {
        const msg = err?.error || t('notifications.cannotGetAvatar');
        Layout.showNotification(msg, 'error');
      });
    currentGame = new GameComponentOnline(
      gameContainer,
      canStart,
      (p1:number , p2: number) => { score.textContent = `${p1} : ${p2}` },
      ws,
      'moveT');
    currentGame.setCanStart(canStart);

    // Afficher les infos du match si disponibles
    const matchRound = sessionStorage.getItem('matchRound');

    if (matchRound) {
      matchTitleEl.textContent = matchRound;
    }

    // Le match de tournoi est géré directement par le serveur
    // Pas besoin d'envoyer "ready", on attend juste les messages du serveur

    if (ws) {
      // window.addEventListener('popstate', popstateHandler);
      ws.onmessage = async message => {
        const response = JSON.parse(message.data);

        // Début du match
        if (response.method === "Start") {
          waiting = false;
          canStart = true;
          if (currentGame) {
            currentGame.setCanStart(canStart);
            await startAnimation();
            startTimer();
          }
        }

        // Mise à jour de l'état du jeu
        if (response.method === "update") {
          const game = response.room;
          if (currentGame && game) {
            currentGame.updateGameState(game);
            if (response.isGoal) {
              stopTimer();
              if (response.isLastGoal === undefined) {
                await startAnimation();
                startTimer();
              }
            }
          }
        }

        // Fin du match
        if (response.method === "gameEnd") {
          if (currentGame) {
            let winnerName = '';
            if (response.winner === 1) {
              winnerName = sessionStorage.getItem('player1Name') || '';
            } else if (response.winner === 2) {
              winnerName = sessionStorage.getItem('player2Name') || '';
            } else {
              winnerName = sessionStorage.getItem('username') || '';
            }
            matchTitleEl.textContent = `${t('tournamentOnline.winner')}: ${winnerName}`;

            currentGame.destroy();
          }

          // Attendre un peu avant de rediriger vers le bracket
          setTimeout(() => {
            // Le backend enverra returnToBracket qui gérera la redirection
          }, 2000);
        }

        // Retour au bracket (envoyé par le backend après le match)
        if (response.method === "returnToBracket") {
          
          // Nettoyer les infos du match
          sessionStorage.removeItem('matchRound');

          // Sauvegarder le tournamentId pour revenir au bon tournoi
          if (response.tournamentId) {
            sessionStorage.setItem('tournamentId', response.tournamentId);
          }
          
          // Rediriger vers la page du tournoi après un délai (History API)
          setTimeout(() => {
            const p = '/online-tournament';
            history.replaceState(null, '', p);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, 2000);
        }
      }
    } else {
      // window.removeEventListener('popstate', popstateHandler);
      const p = '/tournament-room';
      history.replaceState(null, '', p);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    // Cleanup du jeu précédent s'il existe
    if (currentGame) {
      currentGame.destroy();
    }

  // Handler pour le popstate (si le joueur quitte manuellement)

  }
}

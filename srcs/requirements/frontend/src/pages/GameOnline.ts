import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";
import { ws } from "./GameRoom.js";
import { sleep } from "../utils/sleep.js"
import {Layout} from "./Layout";

let currentGame: GameComponentOnline | null = null;
let timerInterval: number | null = null;
let elapsedSeconds: number = 0;

export const GameOnline: Page = {
  render() {
    return `
<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
  <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
  <div class="relative z-10">
    <div class="flex items-center px-6 pt-2">
      <span id="player-1-name" class="font-semibold text-5xl flex-1 text-left">???</span>
      <span id="score" class="text-5xl font-extrabold tracking-wide"></span>
      <span id="player-2-name" class="font-semibold text-5xl flex-1 text-right">???</span>
    </div>
    <div class="flex items-center px-6 pb-2 text-md opacity-90">
      <span id="player-1-elo" class="flex-1 text-left"></span>
      <span id="timer">00:00</span>
      <span id="player-2-elo" class="flex-1 text-right"></span>
    </div>
  </div>
</div>
<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
  <div id="game-container" class="mb-8"></div>
</div>
<div id="waiting-modal" class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
  <div class="bg-transparent border-gray-50 border p-8 max-w-md w-full mx-4">
    <div class="text-center">
      <h2 class="text-3xl text-gray-50 font-bold mb-4">Attente...</h2>
      <p class="text-xl text-gray-300 mb-6">En attente d'autres joueurs</p>
      <div class="flex justify-center mb-4">
        <div class="h-16 flex items-center justify-center gap-3">
          <span class="h-2 w-2 bg-white animate-bounceHigh [animation-delay:0ms]"></span>
          <span class="h-2 w-2 bg-white animate-bounceHigh [animation-delay:150ms]"></span>
          <span class="h-2 w-2 bg-white animate-bounceHigh [animation-delay:300ms]"></span>
        </div>
      </div>
      <p class="text-gray-400 mb-5">Le jeu démarrera automatiquement quand tous les joueurs seront prêts</p>
      <button
					id="cancel-matchmaking"
					class="w-full text-gray-50 py-3 px-6 border border-gray-50 hover:border-red-500 hover:bg-gray-700/50 transition-colors font-bold">
        Quitter le matchmaking
			</button>
    </div>
  </div>
</div>
<div id="winner-modal" class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 hidden">
  <div class="bg-transparent border-gray-50 border p-8 max-w-md w-full mx-4">
    <div class="text-center">
      <h2 id="winner-text" class="text-3xl text-gray-50 font-bold mb-4">Félicitations !</h2>
      <p id="winner-subtext" class="text-xl text-gray-300 mb-6">Vous avez gagné la partie.</p>
      <button 
          id="close-winner-modal"
          class="w-full text-gray-50 py-3 px-6 border border-gray-50 hover:border-green-500 hover:bg-gray-700/50 transition-colors font-bold">
        Retourner au salon
      </button>
    </div>
  </div>
</div>
<div id="start-modal" class="fixed inset-0 flex justify-center items-center z-75 hidden">
  <div id="start-modal-text" class="text-8xl font-bold text-gray-50 mb-4 ml-4 text-center px-16 py-16">
    - 3 -
  </div>
</div>
`;
  },


  mount(root) {

    // Cleanup previous game if exists
    if (currentGame) {
      currentGame.destroy();
      currentGame = null;
    }

    // Reset timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    elapsedSeconds = 0;

    Layout.redirectIfNotLoggedIn('/', true);

    let roomId = sessionStorage.getItem('roomId');
    let clientId = sessionStorage.getItem('clientId');
    let canStart = false;
    let waiting = true;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const score = root.querySelector('#score') as HTMLElement;
    const timerEl = root.querySelector('#timer') as HTMLElement;
    const player1NameEl = root.querySelector('#player-1-name') as HTMLElement;
    const player1EloEl = root.querySelector('#player-1-elo') as HTMLElement;
    const player2NameEl = root.querySelector('#player-2-name') as HTMLElement;
    const player2EloEl = root.querySelector('#player-2-elo') as HTMLElement;
    const waitingModal = root.querySelector('#waiting-modal') as HTMLElement;
    const cancelMatchmakingBtn = root.querySelector('#cancel-matchmaking') as HTMLButtonElement;
    const startModal = root.querySelector('#start-modal') as HTMLElement;
    const startModalText = root.querySelector('#start-modal-text') as HTMLElement;

    const popstateHandler = (event: PopStateEvent) => {

      const path = window.location.pathname.toLowerCase();

      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }

      if (ws)
        ws.send(JSON.stringify(payLoad));

      sessionStorage.removeItem('roomId');

      if (!path.includes('gameroom') && !path.includes('gameonline')) {
        if (ws)
          ws.close();
      }


      window.removeEventListener('popstate', popstateHandler);
    };

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

    // Bouton pour quitter le matchmaking
    if (cancelMatchmakingBtn) {
      cancelMatchmakingBtn.addEventListener('click', () => {
        const payLoad = {
          "method": "leave",
          "clientId": clientId
        };
        if (ws) {
          ws.send(JSON.stringify(payLoad));
        }
        window.removeEventListener('popstate', popstateHandler);
        const p = '/';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));

      });
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

    currentGame = new GameComponentOnline(
      gameContainer,
      canStart,
      (p1, p2) => {
        score.textContent = `${p1} : ${p2}`
      },
      ws
    );

    currentGame.setCanStart(canStart);

    const payLoad = {
      "method": "ready",
      "clientId": clientId,
      "roomId": roomId,
      "state": 1
    }
    if (ws)
      ws.send(JSON.stringify(payLoad));


    // Récupérer le modal

    if (ws) {
      ws.onmessage = async message => {

        const response = JSON.parse(message.data);
        //connect
        if (response.method === "Start") {
          waiting = false;
          canStart = true;
          // Masquer le modal d'attente
          if (waitingModal) {
            waitingModal.classList.add('hidden');
          }

          if (currentGame) {
            currentGame.setCanStart(canStart);
            player1NameEl.textContent = response.room.clients[0].name;
            player2NameEl.textContent = response.room.clients[1].name;
            player1EloEl.textContent = response.room.clients[0].elo;
            player2EloEl.textContent = response.room.clients[1].elo;
            await startAnimation();
            startTimer();
          }
        }

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

        if (response.method === "leave") {
          if (waitingModal) {
            // Afficher un message indiquant que l'autre joueur a refusé
            if (waitingModal) {
              const title = waitingModal.querySelector('h2');
              const paragraphs = waitingModal.querySelectorAll('p');
              const dots = waitingModal.querySelector('.h-16') as HTMLElement | null;
              if (dots) {
                dots.classList.add('hidden');
                dots.style.display = 'none';
              }
              if (title) title.textContent = 'Match annulé';
              if (paragraphs.length > 0) {
                paragraphs[0].textContent = "L'autre joueur a refusé le match";
                if (paragraphs[1]) paragraphs[1].textContent = '';
              }
              const cancelBtn = waitingModal.querySelector('#cancel-matchmaking') as HTMLButtonElement | null;
              if (cancelBtn) cancelBtn.textContent = 'RETOUR';
              waitingModal.classList.remove('hidden');
            }
          }
        }

        if (response.method === "gameEnd") {
          if (currentGame) {
            const winner = currentGame.getScores().p1Score > currentGame.getScores().p2Score ? player1NameEl.textContent : currentGame.getScores().p1Score < currentGame.getScores().p2Score ? player2NameEl.textContent : "Personne";
            currentGame.destroy();
            stopTimer();
            const winnerModal = root.querySelector('#winner-modal') as HTMLElement;
            const winnerText = root.querySelector('#winner-text') as HTMLElement;
            const winnerSubtext = root.querySelector('#winner-subtext') as HTMLElement;
            const closeWinnerModalBtn = root.querySelector('#close-winner-modal') as HTMLButtonElement;

            if (winnerText) winnerText.textContent = "Partie terminée !";
            if (winnerSubtext) winnerSubtext.textContent = `${winner} a gagné la partie.`;

            if (winnerModal) {
              winnerModal.classList.remove('hidden');
            }

            if (closeWinnerModalBtn) {
              closeWinnerModalBtn.addEventListener('click', () => {
                window.removeEventListener('popstate', popstateHandler);

                const payLoad = {
                  "method": "leave",
                  "clientId": clientId
                };
                if (ws) {
                  ws.send(JSON.stringify(payLoad));
                }

                sessionStorage.removeItem('roomId');
                const p = '/';
                history.pushState(null, '', p);
                window.dispatchEvent(new PopStateEvent('popstate'));
              });
            }
          }
        }
      }
    } else {
      window.removeEventListener('popstate', popstateHandler);
      const p = '/';
      history.pushState(null, '', p);
      window.dispatchEvent(new PopStateEvent('popstate'));
      sessionStorage.removeItem('roomId');
    }

    window.addEventListener('popstate', popstateHandler);
  }
}

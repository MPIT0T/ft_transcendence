import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";
import { ws } from "./TournamentRoom.js";
import {sleep} from "../utils/sleep";
import {Layout} from "./Layout";

let currentGame: GameComponentOnline | null = null;
let timerInterval: number | null = null;
let elapsedSeconds: number = 0;

export const GameOnlineTournament: Page = {
  render() {
    return `
<div id="tournament-match-title" class="text-7xl text-center mb-5 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift">
  tournament name
</div>
<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
  <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
  <div class="relative z-10">
    <div class="flex items-center px-6 pt-2">
      <span id="player-1-name" class="font-semibold text-5xl flex-1 text-left">???</span>
      <span id="score" class="text-5xl font-extrabold tracking-wide"></span>
      <span id="player-2-name" class="font-semibold text-5xl flex-1 text-right">???</span>
    </div>
    <div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
      <span id="player-1-elo" class="flex-1 text-left"></span>
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

  mount(root) {

    Layout.redirectIfNotLoggedIn();

    const clientId = sessionStorage.getItem('clientId');
    const tournamentId = sessionStorage.getItem('tournamentId');
    let canStart = false;
    let waiting = true;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const matchTitleEl = root.querySelector('#tournament-match-title') as HTMLElement;
    const player1NameEl = root.querySelector('#player-1-name') as HTMLElement;
    const player2NameEl = root.querySelector('#player-2-name') as HTMLElement;
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
      ws.onmessage = async message => {
        const response = JSON.parse(message.data);

        // Début du match
        if (response.method === "Start") {
          console.log("BOBO");
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
            if (response.winner === 1) {
              matchTitleEl.textContent = `Winner: ${sessionStorage.getItem('player1Name')}`;
            } else if (response.winner === 2) {
              matchTitleEl.textContent = `Winner: ${sessionStorage.getItem('player2Name')}`;
            } else {
              matchTitleEl.textContent = `Winner: ${sessionStorage.getItem('username')}`;
            }

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
            const p = '/tournamentOnline';
            history.pushState(null, '', p);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, 2000);
        }
      }
    }

    // Cleanup du jeu précédent s'il existe
    if (currentGame) {
      currentGame.destroy();
    }

  // Handler pour le popstate (si le joueur quitte manuellement)
  const popstateHandler = (event: PopStateEvent) => {
      
      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }
      if (ws)
        ws.send(JSON.stringify(payLoad));

      // Nettoyer les infos du match
      sessionStorage.removeItem('matchRound');

      window.removeEventListener('popstate', popstateHandler);
    };

    window.addEventListener('popstate', popstateHandler);
  }
}

import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";
import { ws } from "./GameRoom.js";

let currentGame: GameComponentOnline | null = null;
let timerInterval: number | null = null;
let elapsedSeconds: number = 0;

export const GameOnline: Page = {
  render() {
    return `
<div class="relative overflow-hidden text-gray-50 text-lg border-1 border-gray-50 backdrop-blur-2xs">
  <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
  <div class="relative z-10">
    <div class="flex items-center justify-between px-6 pt-2">
      <span class="font-semibold text-5xl">???</span>
      <span id="score" class="text-5xl font-extrabold tracking-wide"></span>
      <span class="font-semibold text-5xl">???</span>
    </div>
    <div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
      <span>W/S</span>
      <span id="timer">00:00</span>
      <span>↑/↓</span>
    </div>
  </div>
</div>
<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
  <div id="game-container" class="mb-8"></div>
</div>
<div id="waiting-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div class="bg-white border-4 border-black p-8 max-w-md w-full mx-4">
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-4">⏳ Attente...</h2>
      <p class="text-xl mb-6">En attente d'autres joueurs</p>
      <div class="flex justify-center mb-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
      <p class="text-gray-600">Le jeu démarrera automatiquement quand tous les joueurs seront prêts</p>
    </div>
  </div>
</div>
`;
  },


  mount(root) {
    let roomId = localStorage.getItem('roomId');
    let clientId = localStorage.getItem('clientId');
    let canStart = false;
    let waiting = true;

    let player1Name: string = "";
    let player2Name: string = "";
    let player1Elo: number = 0;
    let player2Elo: number = 0;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const score = root.querySelector('#score') as HTMLElement;
    const timerEl = root.querySelector('#timer') as HTMLElement;
    const player1NameEl = root.querySelector('#player-1-name') as HTMLElement;
    const player2NameEl = root.querySelector('#player-2-name') as HTMLElement;

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

    currentGame = new GameComponentOnline(
      gameContainer,
      canStart,
      (p1, p2) => { score.textContent = `${p1} : ${p2}`},
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
    const waitingModal = root.querySelector('#waiting-modal') as HTMLElement;

    if (ws) {
      ws.onmessage = message => {

        const response = JSON.parse(message.data);
        //connect
        if (response.method === "Start") {
          waiting = false;
          canStart = true;
          // Masquer le modal d'attente
          if (waitingModal) {
            waitingModal.classList.add('hidden');
          }
          
          if (currentGame)
            currentGame.setCanStart(canStart);
            player1Name = response.room.clients[0].name;
            player2Name = response.room.clients[1].name;
            player1Elo = response.room.clients[0].elo;
            player2Elo = response.room.clients[1].elo;
            startTimer();
          }
        }

        if (response.method === "update") {

          const game = response.room;
          if (currentGame && game) {
            currentGame.updateGameState(game);
          }
        }

        if (response.method === "gameEnd") {
          if (currentGame) {
            currentGame.destroy();
            stopTimer();
          }
        }
      }
    }


    // Cleanup previous game if exists
    if (currentGame) {
      currentGame.destroy();
    }

    const hashChangeHandler = (event: HashChangeEvent) => {
      const payLoad = {
        "method": "leave",
        "clientId": clientId
      }
      if (ws)
        ws.send(JSON.stringify(payLoad));

      window.removeEventListener('hashchange', hashChangeHandler);
    };
    window.addEventListener('hashchange', hashChangeHandler);
  }
}

import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";
import { ws } from "./GameRoom.js";

let currentGame: GameComponentOnline | null = null;

export const GameOnline: Page = {
  render() {
    return `
      <div class="flex-1 p-5 flex flex-col items-center justify-center bg-gray-900">
        <div id="game-container" class="mb-8">
          <!-- Game component will be mounted here -->
        </div>
        <div class="flex flex-col gap-4 items-center">
            <div class="text-white text-2xl">
            <p>Player : { W / S } keys & { ↑ / ↓ } keys</p>
            </div>
        </div>
      </div>

      <!-- Modal d'attente -->
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
    let roomId = sessionStorage.getItem('roomId');
    let clientId = sessionStorage.getItem('clientId');
    let canStart = false;
    let waiting = true;

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    currentGame = new GameComponentOnline(gameContainer, canStart, ws);
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

        }

        if (response.method === "update") {

          const game = response.room;
          if (currentGame && game) {
            currentGame.updateGameState(game);
          }
        }

        if (response.method === "gameEnd") {
          if (currentGame)
            currentGame.destroy();
        }
      }
    }


    // Cleanup previous game if exists
    if (currentGame) {
      currentGame.destroy();
    }

    const popstateHandler = (event: PopStateEvent) => {
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
}
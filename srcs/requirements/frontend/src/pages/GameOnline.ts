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
            `;
  },


  mount(root) {
    let roomId = localStorage.getItem('roomId');
    let clientId = localStorage.getItem('clientId');
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


    if (ws) {
      ws.onmessage = message => {

        const response = JSON.parse(message.data);
        //connect
        if (response.method === "Start") {
          waiting = false;
          canStart = true;
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

    const hashChangeHandler = (event: HashChangeEvent) => {
      console.log('Hash changed');
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
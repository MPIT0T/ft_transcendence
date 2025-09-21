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
          <div class="items-center">
            <button
            id="ready-btn"
            class="px-6 py-3 rounded-lg font-bold text-lg transition bg-blue-600 text-white hover:bg-blue-700"
            >
            READY
            </button>
            <div>
            <div class="text-white text-2xl">
            <p>Player : { W / S } keys & { ↑ / ↓ } keys</p>
            </div>
            </div>
            </div>
            `;
          },
          
    mount(root) {
    let gameId = localStorage.getItem('gameId');
    let clientId = localStorage.getItem('clientId');
    let canStart = false;
    
    if (ws) {
      ws.onmessage = message => {

        const response = JSON.parse(message.data);
        //connect
        if (response.method === "update"){
          canStart = true;
          const game = response.game;
          if (currentGame && game) {
            currentGame.updateGameState(game);
            currentGame.setCanStart(canStart);
          }
        }
      }
    }

    // Cleanup previous game if exists
    if (currentGame) {
      currentGame.destroy();
    }
    
    let readyState = false;
    
    const readyBtn = root.querySelector('#ready-btn') as HTMLButtonElement;
    const gameContainer = root.querySelector('#game-container') as HTMLElement;


    
    if (readyBtn && gameContainer) {
      // Initialize game component
      currentGame = new GameComponentOnline(gameContainer, canStart);
      
      readyBtn.addEventListener('click', () => {
        readyState = !readyState;
        
        // Update button appearance
        if (readyState) {
          readyBtn.className = "px-6 py-3 rounded-lg font-bold text-lg transition bg-red-600 text-white hover:bg-red-700";
          readyBtn.textContent = "NOT READY";
          const payLoad = {
            "method": "ready",
            "clientId": clientId,
            "gameId": gameId,
            "state": 1
          }
          if(ws)
            ws.send(JSON.stringify(payLoad));

        } else {
          readyBtn.className = "px-6 py-3 rounded-lg font-bold text-lg transition bg-white text-black hover:bg-gray-200";
          readyBtn.textContent = "READY";
          const payLoad = {
            "method": "ready",
            "clientId": clientId,
            "gameId": gameId,
            "state": -1
          }
          if(ws)
            ws.send(JSON.stringify(payLoad));

        }
        
        // Update game state
        if (currentGame) {
          currentGame.setCanStart(canStart);
        }
      });
    }
  }
}
import type { Page } from "../interface/gameInterface.js"
import { GameComponentOnline } from "../components/GameComponentOnline.js";

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
              id="start-btn"
              class="px-6 py-3 rounded-lg font-bold text-lg transition bg-white text-black hover:bg-gray-200"
            >
              START
            </button>
            <button
              id="restart-btn"
              class="px-6 py-3 rounded-lg font-bold text-lg transition bg-blue-600 text-white hover:bg-blue-700"
            >
              RESTART
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
    // Cleanup previous game if exists
    if (currentGame) {
      currentGame.destroy();
    }
    
    let canStart = false;
    
    const startBtn = root.querySelector('#start-btn') as HTMLButtonElement;
    const restartBtn = root.querySelector('#restart-btn') as HTMLButtonElement;
    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    
    if (startBtn && restartBtn && gameContainer) {
      // Initialize game component
      currentGame = new GameComponentOnline(gameContainer, canStart);
      
      // Start/Pause button
      startBtn.addEventListener('click', () => {
        canStart = !canStart;
        
        // Update button appearance
        if (canStart) {
          startBtn.className = "px-6 py-3 rounded-lg font-bold text-lg transition bg-red-600 text-white hover:bg-red-700";
          startBtn.textContent = "PAUSE";
        } else {
          startBtn.className = "px-6 py-3 rounded-lg font-bold text-lg transition bg-white text-black hover:bg-gray-200";
          startBtn.textContent = "START";
        }
        
        // Update game state
        if (currentGame) {
          currentGame.setCanStart(canStart);
        }
      });

      // Restart button
      restartBtn.addEventListener('click', () => {
        if (currentGame) {
          // Pause the game first
          canStart = false;
          currentGame.setCanStart(false);
          
          // Reset button to START state
          startBtn.className = "px-6 py-3 rounded-lg font-bold text-lg transition bg-white text-black hover:bg-gray-200";
          startBtn.textContent = "START";
          
          // Restart the game
          currentGame.restart();
        }
      });
    }
  }
}
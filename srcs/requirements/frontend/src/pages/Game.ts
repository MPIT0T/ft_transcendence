import type { Page } from "../interface/gameInterface.js"
import { GameComponent } from "../components/GameComponent.js";
import { sleep } from "../utils/sleep.js"

let currentGame: GameComponent | null = null;
let timerInterval: number | null = null;
let elapsedSeconds: number = 0;

export const Game: Page = {
  render() {
    return `
<div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
  <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
  <div class="relative z-10">
    <div class="flex items-center justify-between px-6 pt-2">
      <span class="font-semibold text-5xl">Joueur 1</span>
      <span id="score" class="text-5xl font-extrabold tracking-wide"></span>
      <span class="font-semibold text-5xl">Joueur 2</span>
    </div>
    <div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
      <span>W/S</span>
      <span id="timer">00:00</span>
      <span>↑/↓</span>
    </div>
  </div>
</div>
<div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
  <div id="game-container" class="mb-8">
  <!-- Game component will be mounted here -->
  </div>
  <div class="flex gap-4 items-center mb-8 z-100">
    <button
        id="start-btn"
        class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-green-500">
      Jouer
    </button>
    <button
        id="restart-btn"
        class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:border-blue-500 hover:bg-gray-700/50">
      Recommencer
    </button>
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
    }
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    elapsedSeconds = 0;

    let canStart = false;

    const startBtn = root.querySelector('#start-btn') as HTMLButtonElement;
    const restartBtn = root.querySelector('#restart-btn') as HTMLButtonElement;
    const gameContainer = root.querySelector('#game-container') as HTMLElement;
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
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const updateTimerDisplay = () => {
      if (timerEl) {
        timerEl.textContent = formatTime(elapsedSeconds);
      }
    };

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

    if (startBtn && restartBtn && gameContainer && score && timerEl) {
      // Initialize game component
      currentGame = new GameComponent(
        gameContainer,
        canStart,
        (p1, p2) => { score.textContent = `${p1} : ${p2}`},
        async (state: boolean) => {
          if (state) {
            stopTimer();
            await startAnimation()
            startTimer();
          }
        }
      );

      updateTimerDisplay();

      // Start/Pause button
      startBtn.addEventListener('click', async () => {
        canStart = !canStart;
        // Update button appearance
        if (canStart) {
          startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-red-500";
          startBtn.textContent = "Pause";
          await startAnimation();
          startTimer();
        } else {
          startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
          startBtn.textContent = "Jouer";
          stopTimer()
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

          stopTimer();
          elapsedSeconds = 0;
          updateTimerDisplay();

          // Reset button to START state
          startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
          startBtn.textContent = "Jouer";

          // Restart the game
          currentGame.restart();
        }
      });
    }
  }
}

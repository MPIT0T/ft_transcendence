import type { Page } from "../interface/gameInterface.js"
import { GameComponent } from "../components/GameComponent.js";
import { sleep } from "../utils/sleep.js"

let currentGame: GameComponent | null = null;
let timerInterval: number | null = null;
let elapsedSeconds: number = 0;

export const Game: Page = {
  render() {
    return `
<div class="mt-24">
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
</div>
    `;
  },

  mount(root) {
    // Disable the global layout login button while on the game page
    const layoutLoginBtn = document.querySelector('#login-btn') as HTMLButtonElement | null;
    let _prevLoginBtnClass: string | null = null;
    let _prevLoginBtnDisabled: boolean | null = null;
    if (layoutLoginBtn) {
      _prevLoginBtnClass = layoutLoginBtn.className;
      _prevLoginBtnDisabled = layoutLoginBtn.disabled;
      layoutLoginBtn.disabled = true;
      // visually indicate disabled state
      layoutLoginBtn.className = `${layoutLoginBtn.className} opacity-50 pointer-events-none`;
    }

    // When leaving the page (popstate), restore the login button
    const _restoreLoginBtn = () => {
      if (layoutLoginBtn) {
        if (_prevLoginBtnClass !== null) layoutLoginBtn.className = _prevLoginBtnClass;
        if (_prevLoginBtnDisabled !== null) layoutLoginBtn.disabled = _prevLoginBtnDisabled;
      }
    };

    const popstateHandler = (_event: PopStateEvent) => {
      _restoreLoginBtn();
      window.removeEventListener('popstate', popstateHandler);
    };
    window.addEventListener('popstate', popstateHandler);

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

    // Controller to cancel the start countdown animation
    let animationController: AbortController | null = null;

    const startAnimation = async () => {
      // Cancel any existing animation first
      if (animationController) {
        animationController.abort();
        animationController = null;
      }
      animationController = new AbortController();
      const { signal } = animationController;

      startModal.classList.remove("hidden");

      try {
        await sleep(850, signal);
        startModalText.classList.add('opacity-0');
        await sleep(150, signal);
        startModalText.classList.remove("opacity-0");
        startModalText.textContent = "- 2 -";
        await sleep(850, signal);
        startModalText.classList.add('opacity-0');
        await sleep(150, signal);
        startModalText.classList.remove("opacity-0");
        startModalText.textContent = "- 1 -";
        await sleep(850, signal);
        startModalText.classList.add('opacity-0');
        await sleep(150, signal);
        startModalText.classList.remove("opacity-0");
        startModal.classList.add('hidden');
        startModalText.textContent = "- 3 -";
      } catch (err: any) {
        // If aborted, ensure modal is hidden and text reset, then propagate the abort so callers don't start the timer
        if (err && (err.name === 'AbortError' || err instanceof DOMException)) {
          startModal.classList.add('hidden');
          startModalText.classList.remove('opacity-0');
          startModalText.textContent = "- 3 -";
          throw err;
        }
        throw err;
      } finally {
        animationController = null;
      }
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
            try {
              await startAnimation();
              startTimer();
            } catch (e: any) {
              // animation was cancelled: do not start the timer
              if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
            }
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
          try {
            await startAnimation();
            startTimer();
          } catch (e: any) {
            if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
            // If aborted, revert the canStart/UI state back to paused
            canStart = false;
            startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
            startBtn.textContent = "Jouer";
          }
        } else {
          startBtn.className = "px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-blue-500";
          startBtn.textContent = "Jouer";
          // Cancel any ongoing start animation
          if (animationController) {
            animationController.abort();
            animationController = null;
          }
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

          // Cancel any ongoing start animation
          if (animationController) {
            animationController.abort();
            animationController = null;
          }

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

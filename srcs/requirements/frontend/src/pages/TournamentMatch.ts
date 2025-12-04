import type { Page } from "../interface/gameInterface.js";
import { GameComponent } from "../components/GameComponent.js";
import { createCountdown } from "../utils/countdown.js";
import { t } from "../utils/i18n.js";

let currentGame: GameComponent | null = null;

function getTournamentData(): any | null {
  const data = sessionStorage.getItem('localTournamentMatch');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export const TournamentMatch: Page = {
  render() {
    const data = getTournamentData();
    const p1 = data?.player1 || 'Joueur 1';
    const p2 = data?.player2 || 'Joueur 2';
    return `
<div class="mt-24">
  <div class="text-center mb-4">
    <span class="text-2xl text-yellow-400 font-bold" data-i18n="tournamentMatch.title">Match Tournoi Local</span>
  </div>
  <div class="relative overflow-hidden text-gray-50 text-lg border border-gray-50 backdrop-blur-2xs">
    <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-30"></div>
    <div class="relative z-10">
      <div class="flex items-center justify-between px-6 pt-2">
        <span id="player1-name" class="font-semibold text-5xl text-blue-400">${p1}</span>
        <span id="score" class="text-5xl font-extrabold tracking-wide">0 : 0</span>
        <span id="player2-name" class="font-semibold text-5xl text-red-400">${p2}</span>
      </div>
      <div class="flex items-center justify-between px-6 pb-2 text-md opacity-90">
        <span>W/S</span>
        <span id="winning-score-info" data-i18n="game.firstTo">Premier à <span id="winning-score-display" class="text-yellow-400 font-bold">5</span></span>
        <span>↑/↓</span>
      </div>
    </div>
  </div>
  <div class="flex-1 p-5 flex flex-col items-center justify-center bg-transparent">
    <div id="game-container" class="mb-8"></div>
    <div class="flex gap-4 items-center mb-8 z-100">
      <button id="start-btn" class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:bg-gray-700/50 hover:border-green-500" data-i18n="game.play">Jouer</button>
      <button id="restart-btn" class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:border-blue-500 hover:bg-gray-700/50 hidden" data-i18n="game.restart">Recommencer</button>
      <button id="quit-tournament-btn" class="px-6 py-3 font-bold text-lg transition border border-gray-50 backdrop-blur-2xs text-gray-50 hover:border-red-500 hover:bg-gray-700/50" data-i18n="tournamentMatch.quitTournament">Quitter le tournoi</button>
    </div>
  </div>

  <div id="start-modal" class="fixed inset-0 flex justify-center items-center z-75 hidden">
    <div id="start-modal-text" class="text-8xl font-bold text-gray-50 mb-4 ml-4 text-center px-16 py-16">- 3 -</div>
  </div>

  <div id="match-end-modal" class="fixed inset-0 backdrop-blur-lg bg-black/70 hidden items-center justify-center z-50">
    <div class="border border-gray-50 bg-gray-900/90 p-8 max-w-md w-full mx-4 text-center">
      <div class="text-6xl mb-4">🎉</div>
      <h3 class="text-2xl text-gray-300 font-bold mb-2" data-i18n="tournamentLocal.matchFinished">Match terminé !</h3>
      <p id="match-winner-name" class="text-4xl text-green-400 font-bold mb-2"></p>
      <p id="match-final-score" class="text-xl text-gray-400 mb-6"></p>
      <button id="show-bracket-after-match-btn" class="w-full py-4 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 transition-colors font-bold text-lg" data-i18n="tournamentMatch.viewBracket">📊 Voir le bracket →</button>
    </div>
  </div>
</div>
    `;
  },

  mount(root: HTMLElement) {
    const data = getTournamentData();
    if (!data) {
      // No tournament data: return to tournament lobby
      history.pushState(null, '', '/tournamentLocal');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    const gameContainer = root.querySelector('#game-container') as HTMLElement;
    const startBtn = root.querySelector('#start-btn') as HTMLButtonElement;
    const restartBtn = root.querySelector('#restart-btn') as HTMLButtonElement;
    const scoreEl = root.querySelector('#score') as HTMLElement;
    const startModal = root.querySelector('#start-modal') as HTMLElement;
    const startModalText = root.querySelector('#start-modal-text') as HTMLElement;
    const matchEndModal = root.querySelector('#match-end-modal') as HTMLDivElement;
    const matchWinnerName = root.querySelector('#match-winner-name') as HTMLElement;
    const matchFinalScore = root.querySelector('#match-final-score') as HTMLElement;

    let canStart = false;
    let winningScore = data.score || 5;
    const countdown = createCountdown();

    if (!gameContainer || !startBtn || !scoreEl) return;

    currentGame = new GameComponent(gameContainer, canStart,
      (p1: number, p2: number) => {
        scoreEl.textContent = `${p1} : ${p2}`;
        if (p1 >= winningScore || p2 >= winningScore) {
          canStart = false;
          currentGame?.setCanStart(false);
          const winner = p1 >= winningScore ? data.player1 : data.player2;
          if (matchWinnerName) matchWinnerName.textContent = winner;
          if (matchFinalScore) matchFinalScore.textContent = t('game.scoreDisplay', { score1: p1.toString(), score2: p2.toString() });
          if (matchEndModal) {
            matchEndModal.classList.remove('hidden');
            matchEndModal.classList.add('flex');
          }
          // Update sessionStorage to advance bracket (TournamentLocal should handle progression)
          // Keep data for reference; TournamentLocal will update bracket on its own when returning
        }
      },
      async (state: boolean) => {
        if (state) {
          const sc1 = currentGame?.getScoreP1() ?? 0;
          const sc2 = currentGame?.getScoreP2() ?? 0;
          if (sc1 >= winningScore || sc2 >= winningScore) return;
          try {
            await countdown.start(startModal, startModalText);
          } catch (e: any) {
            if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
          }
        }
      }
    );

    startBtn.addEventListener('click', async () => {
      canStart = !canStart;
      if (canStart) {
        startBtn.textContent = t('game.pause');
        try {
          await countdown.start(startModal, startModalText);
        } catch (e: any) {
          if (!(e && (e.name === 'AbortError' || e instanceof DOMException))) throw e;
          canStart = false;
          startBtn.textContent = t('game.play');
        }
      } else {
        startBtn.textContent = t('game.play');
        countdown.abort();
      }
      currentGame?.setCanStart(canStart);
    });

    // Quit tournament: go back to tournament page
    const quitBtn = root.querySelector('#quit-tournament-btn') as HTMLButtonElement | null;
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        history.pushState(null, '', '/tournamentLocal');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }
};

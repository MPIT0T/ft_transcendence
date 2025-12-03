import type { Page } from "../interface/gameInterface.js"

export const LocalLobby: Page = {
  render() {
    return `
<div class="flex items-center justify-center mb-16">
  <div class="text-center text-8xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-green-500 bg-[length:400%_400%] animate-gradientShift">
    ft_trans_local
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-64 flex-1">

  <!-- 1v1 Mode -->
  <button id="game-btn" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-amber-500 text-left">
    <div class="text-center mt-8">
      <div class="mb-4 text-7xl text-amber-500">
        1vs1
      </div>
      <p class="text-gray-400 mb-8 text-xl">
        Affrontez votre ami en face à face. 
        Partie rapide de 3, 5, 10 ou 15 points!
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Joueurs :</span>
        <span class="font-semibold justify-between">
          <span class="text-red-400">2</span>
          <span class="text-gray-50">locaux</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Contrôles :</span>
        <span class="font-semibold justify-between">
          <span class="text-amber-400">W/S</span>
          <span class="text-gray-50">vs</span>
          <span class="text-red-400">↑/↓</span>
        </span>
      </div>
    </div>
    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div class="absolute inset-0 bg-gray-700 opacity-30"></div>
      <span class="relative text-white text-2xl font-bold">Click to Join!</span>
    </div>
  </button>
  
  <!-- Tournament mode -->
  <button id="online-mode" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-green-500 text-left">
    <div class="text-center mt-8">
      <div id="mode-online-title" class="mb-4 text-7xl text-green-500">
        tournoi
      </div>
      <p class="text-gray-400 mb-6 text-xl">
        Affrontez vos amis lors d'un tournoi .
        Système de matchmaking automatique !
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Joueurs :</span>
        <span class="font-semibold justify-between">
          <span class="text-lime-400">8</span>
          <span class="text-gray-50">locaux</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Contrôles :</span>
        <span class="font-semibold justify-between">
          <span class="text-green-400">W/S</span>
          <span class="text-gray-50">vs</span>
          <span class="text-lime-400">↑/↓</span>
        </span>
      </div>
    </div>

    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div class="absolute inset-0 bg-gray-700 opacity-30"></div>
      <span class="relative text-white text-2xl font-bold">Click to Join!</span>
    </div>
  </button>
</div>
    `;
  },

  mount(root: HTMLElement): void {
    const gameBtn = root.querySelector('#game-btn');
    if (gameBtn) {
      gameBtn.addEventListener('click', (e) => {
        const p = '/game';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    const tournamentBtn = root.querySelector('#tournament-btn');
    if (tournamentBtn) {
      tournamentBtn.addEventListener('click', (e) => {
        const p = '/localTournament';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }
}

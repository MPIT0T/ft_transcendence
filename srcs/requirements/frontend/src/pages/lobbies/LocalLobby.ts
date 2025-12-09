/**
 * @fileoverview Local lobby page component for choosing between 1v1 local matches and local tournaments.
 * Provides navigation to different local game modes played on the same device.
 */

import type { Page } from "../../interface/gameInterface"

/**
 * Local lobby page component allowing players to select between 1v1 local games
 * and local tournament modes for same-device multiplayer.
 */
export const LocalLobby: Page = {
  /**
   * Renders the local lobby HTML with 1v1 and tournament mode selection cards.
   * @returns HTML string containing the local lobby interface
   */
  render() {
    return `
<div class="flex items-center justify-center mb-16">
  <div class="text-center text-8xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-green-500 bg-[length:400%_400%] animate-gradientShift">
    ft_trans_local
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-64 flex-1">

  <!-- 1v1 Mode -->
  <button id="game-local-btn" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-amber-500 text-left">
    <div class="text-center mt-8">
      <div class="mb-4 text-7xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-[length:400%_400%] animate-gradientShift" data-i18n="local.1v1">
        1vs1
      </div>
      <p class="text-gray-400 mb-8 text-xl" data-i18n="local.1v1Desc">
        Affrontez votre ami en face à face. 
        Partie rapide de 3, 5, 10 ou 15 points!
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300" data-i18n="lobby.players">Joueurs :</span>
        <span class="font-semibold justify-between">
          <span class="text-red-400">2</span>
          <span class="text-gray-50" data-i18n="lobby.localPlayers">locaux</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300" data-i18n="lobby.controls">Contrôles :</span>
        <span class="font-semibold justify-between">
          <span class="text-amber-400">W/S</span>
          <span class="text-gray-50" data-i18n="lobby.vs">vs</span>
          <span class="text-red-400">↑/↓</span>
        </span>
      </div>
    </div>
    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <span class="relative text-white text-2xl font-bold" data-i18n="lobby.clickToJoin">Click to Join!</span>
    </div>
  </button>
  
  <!-- Tournament mode -->
  <button id="tournament-local-btn" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-green-500 text-left">
    <div class="text-center mt-8">
      <div id="mode-online-title" class="mb-4 text-7xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-lime-500 to-green-500 bg-[length:400%_400%] animate-gradientShift" data-i18n="local.tournament">
        tournoi
      </div>
      <p class="text-gray-400 mb-6 text-xl" data-i18n="local.tournamentDesc">
        Affrontez vos amis lors d'un tournoi .
        Système de matchmaking automatique !
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300" data-i18n="lobby.players">Joueurs :</span>
        <span class="font-semibold justify-between">
          <span class="text-yellow-400">8</span>
          <span class="text-gray-50" data-i18n="lobby.localPlayers">locaux</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300" data-i18n="lobby.controls">Contrôles :</span>
        <span class="font-semibold justify-between">
          <span class="text-green-400">W/S</span>
          <span class="text-gray-50" data-i18n="lobby.vs">vs</span>
          <span class="text-lime-400">↑/↓</span>
        </span>
      </div>
    </div>

    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <span class="relative text-white text-2xl font-bold" data-i18n="lobby.clickToJoin">Click to Join!</span>
    </div>
  </button>
</div>
    `;
  },

  /**
   * Mounts navigation event listeners for local game mode selection.
   * Sets up click handlers for 1v1 and tournament buttons.
   * @param root - Root element containing the rendered lobby page
   */
  mount(root: HTMLElement): void {
    const gameLocalBtn = root.querySelector('#game-local-btn');
    if (gameLocalBtn) {
      gameLocalBtn.addEventListener('click', (e) => {
        const p = '/game';
        if (window.location.pathname !== p) {
          history.pushState(null, '', p);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    }

    const tournamentLocalBtn = root.querySelector('#tournament-local-btn');
    if (tournamentLocalBtn) {
      tournamentLocalBtn.addEventListener('click', (e) => {
        const p = '/local-tournament';
        if (window.location.pathname !== p) {
          history.pushState(null, '', p);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    }
  }
}

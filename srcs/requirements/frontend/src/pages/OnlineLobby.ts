import type { Page } from "../interface/gameInterface.js"

export const OnlineLobby: Page = {
  render() {
    return `
<div class="flex items-center justify-center mb-16">
  <div class="text-center text-8xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-[length:400%_400%] animate-gradientShift">
    en ligne
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-64 flex-1">

  <!-- 1v1 Mode -->
  <button id="game-btn" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-sky-400 text-left">
    <div class="text-center mt-8">
      <div class="mb-4 text-7xl text-sky-400">
        1vs1
      </div>
      <p class="text-gray-400 mb-8 text-xl">
        Affrontez des joueurs du monde entier en temps réel.
        Système de matchmaking automatique !
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Joueurs :</span>
        <span class="font-semibold justify-between text-sky-400">
          <span id="players-online">?</span>
          <span class="text-gray-50">en ligne</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Modes :</span>
        <span class="font-semibold justify-between text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:300%_100%] bg-[position:0%_50%]">
          <span>Classé</span>
          <span class="text-gray-50"> ou </span>
          <span>Amical</span>
        </span>
      </div>
    </div>
    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <span class="relative text-white text-2xl font-bold">Click to Join!</span>
    </div>
  </button>
  
  <!-- Tournament mode -->
  <button id="online-mode" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 text-left">
    <div class="text-center mt-8">
      <div id="mode-online-title" class="mb-4 text-7xl text-purple-400">
        tournoi
      </div>
      <p class="text-gray-400 mb-6 text-xl">
        Affrontez des joueurs lors d'un tournoi.
        Le tout à distance!
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Joueurs :</span>
        <span class="font-semibold justify-between text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:300%_100%] bg-[position:50%_50%]">
          <span id="player">?</span>
          <span class="text-gray-50">en ligne</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Latence :</span>
        <span class="font-semibold justify-between text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:300%_100%] bg-[position:50%_50%]">
          <span id="ping">?</span>
          <span class="text-gray-50">ms</span>
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

  }
}

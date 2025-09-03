import type { Page } from "../interface/gameInterface.js"

export const Home: Page = {
  render() {
    return `
      <div class="flex flex-col items-center justify-center h-full">
        <h1 class="text-5xl font-bold text-indigo-600 mb-4">Bienvenue sur ft_transcendence</h1>
        <p class="text-xl text-gray-700 mb-8 text-center max-w-md">
          Découvrez le jeu, connectez-vous et amusez-vous !
        </p>
        <a href="#/game" class="px-8 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
          Jouer
        </a>  
      </div>
    `;
  },

  mount(root) {
    // Add any Home-specific event listeners here
  }
}
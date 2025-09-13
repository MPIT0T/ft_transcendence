export const Layout = {
  render(content: string): string {
    return `
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <div class="flex flex-col w-window h-window">
        <nav class="h-16 w-window bg-gray-400 flex items-center">
          <div class="flex my-5 gap-3 mx-5">
            <button id="home-btn" class="flex items-center px-3 py-1 rounded hover:bg-gray-300 transition">
              <span class="text-2xl flex items-center justify-center w-8 h-8 p-0 m-0">🏠</span>
              <span class="ml-2">Home</span>
              </button>
              <button id="game-btn" class="flex items-center px-3 py-1 rounded hover:bg-gray-300 transition">
                <span class="text-2xl flex items-center justify-center w-8 h-8 p-0 m-0">🎮</span>
                <span class="ml-2">Game</span>
              </button>
              <button id="stats-btn" class="flex items-center px-3 py-1 rounded hover:bg-gray-300 transition">
                <span class="text-2xl flex items-center justify-center w-8 h-8 p-0 m-0">📊</span>
                <span class="ml-2">Stats</span>
              </button>
          </div>
        </nav>
        <div class="flex bg-[#e9ddcb] flex-1 p-3 gap-6">
          <div class="flex flex-1 items-center justify-center border-[6px] border-black rounded-xl max-h-[90vh] overflow-auto relative">
            <div id="page-content">
              ${content}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  mount(root: HTMLElement): void {
    const homeBtn = root.querySelector('#home-btn') as HTMLButtonElement;
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.location.hash = '/';
      });
    }
    const statsBtn = root.querySelector('#stats-btn') as HTMLButtonElement;
    if (statsBtn){
      statsBtn.addEventListener('click', () =>{
        window.location.hash = '/stats';
      })
    }
    const gameBtn = root.querySelector('#game-btn') as HTMLButtonElement;
    if (gameBtn){
      gameBtn.addEventListener('click', () =>{
        window.location.hash = '/gameLoby';
      })
    }
  }
};
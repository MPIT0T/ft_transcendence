import type { Page } from "../interface/gameInterface.js"

export const GameLobby: Page = {
	render() {
		return `
<div class="flex items-center justify-center mb-16">
  <div class="text-center text-8xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift">
    ft_game_lobby
  </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-64 flex-1">

  <!-- Mode Local -->
  <button id="local-mode" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-orange-500 text-left">
    <div class="text-center mt-8">
      <div class="mb-4 text-7xl text-transparent bg-clip-text
          bg-gradient-to-r from-red-500 via-amber-400 to-green-500
          bg-[length:300%_300%] animate-gradientShift">
        Local
      </div>
      <p class="text-gray-400 mb-8 text-xl">
        Jouez à deux sur le même ordinateur. 
        Parfait pour défier un ami assis à côté de vous !
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Joueurs :</span>
        <span class="font-semibold text-white">2 locaux</span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Contrôles :</span>
        <span class="font-semibold justify-between text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:300%_100%] bg-[position:0%_50%]">
          <span>W/S</span>
          <span class="text-gray-50">vs</span>
          <span>↑/↓</span>
        </span>
      </div>
    </div>

    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <span class="relative text-white text-2xl font-bold">Click to Join!</span>
    </div>
  </button>


  <!-- Mode Online -->
  <button id="online-mode" class="relative group w-full backdrop-blur-2xs border border-gray-50 p-6 transition-all duration-300 hover:bg-gray-700/50 hover:border-blue-500 text-left">
    <div class="text-center mt-8">
      <div class="mb-4 text-7xl text-transparent bg-clip-text
          bg-gradient-to-r from-blue-500 via-sky-500 to-purple-500
          bg-[length:300%_300%] animate-gradientShift">
        En ligne
      </div>
      <p class="text-gray-400 mb-6 text-xl">
        Affrontez des joueurs du monde entier en temps réel.
        Système de matchmaking automatique !
      </p>
    </div>
    <div class="space-y-2 mb-8">
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Joueurs :</span>
        <span class="font-semibold justify-between">
          <span id="player" class="text-purple-400">?</span>
          <span class="text-gray-50">en ligne</span>
        </span>
      </div>
      <div class="flex justify-between text-xl">
        <span class="text-gray-300">Latence :</span>
        <span class="font-semibold justify-between">
          <span id="ping" class="text-sky-400">?</span>
          <span class="text-gray-50">ms</span>
        </span>
      </div>
    </div>

    <!-- Overlay text -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <span class="relative text-white text-2xl font-bold">Click to Join!</span>
    </div>
  </button> 

</div>

				
		`;
	},

	mount(root: HTMLElement): void {
		// Mode Local
		const localBtn = root.querySelector('#local-mode') as HTMLButtonElement;
		if (localBtn) {
			localBtn.addEventListener('click', () => {
				const p = '/localLobby';
				history.pushState(null, '', p);
				window.dispatchEvent(new PopStateEvent('popstate'));
			});
		}

		// Mode Online
		const onlineBtn = root.querySelector('#online-mode') as HTMLButtonElement;
		if (onlineBtn) {
			onlineBtn.addEventListener('click', () => {
				const p = '/onlineLobby';
				history.pushState(null, '', p);
				window.dispatchEvent(new PopStateEvent('popstate'));
			});
		}


		// Mode Tournoi
		const tournamentBtn = root.querySelector('#tournament-mode') as HTMLButtonElement;
		if (tournamentBtn) {
			tournamentBtn.addEventListener('click', () => {
				const p = '/tournamentRoom';
				history.pushState(null, '', p);
				window.dispatchEvent(new PopStateEvent('popstate'));
			});
		}

		
		let status: ReturnType<typeof setInterval> | undefined;
		const ping = root.querySelector('#ping') as HTMLButtonElement;
		if(ping){
			status = setInterval(async () => {
				const start = Date.now();

				try {
					const response = await fetch("/pong/status");
					const end = Date.now();
					const latency = end - start;
					ping.textContent = `${latency}`;
				} catch (error) {
					ping.textContent = `?`;
				}
			}, 1000);
		}

		let statusPlayer: ReturnType<typeof setInterval> | undefined;

		const player = root.querySelector('#player') as HTMLButtonElement;
		if (player) {
			statusPlayer = setInterval(async () => {
				try {
					const response = await fetch("/pong/statusPlayer");
					const count = await response.text();
					player.textContent = `${count}`;
				} catch (error) {
					player.textContent = `?`;
				}
			}, 1000);
		}

		// popstate handler to clear intervals
		const popstateHandler = (event: PopStateEvent) => {
				window.clearInterval(status);
				window.clearInterval(statusPlayer);
			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);
	}
};

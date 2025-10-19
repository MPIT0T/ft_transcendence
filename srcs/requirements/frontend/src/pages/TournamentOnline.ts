import type { Page } from "../interface/gameInterface.js"
import { ws } from "./GameRoom.js";

interface Player {
	clientId: string;
	name: string;
}

export const TournamentOnline: Page = {
	render() {
		return `
		<div class="max-w-6xl mx-auto p-6 pt-20 space-y-10">
			<div class="flex-1 p-5 backdrop-blur-xs text-white">
				<!-- Header avec style arcade -->
				<div class="mx-auto mb-8">
					<div class="flex items-center justify-center mb-4 border-4 border-white p-4 bg-black">
						<h1 class="text-5xl font-bold text-white tracking-wider" style="font-family: 'Courier New', monospace; text-shadow: 0 0 10px #fff, 0 0 20px #fff;">
							◈ TOURNAMENT ◈
						</h1>
					</div>

				</div>

				<!-- Tournament Bracket avec style rétro Pong -->
				<div class="mx-auto">
					<div class="flex justify-center items-start gap-8">
						<!-- Round 1: Quarter Finals -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">ROUND 1</h3>
							</div>
							<div class="flex flex-col gap-6">
								<!-- Match 1 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="0">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="1">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 2 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="2">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="3">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 3 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="4">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="5">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>

								<!-- Match 4 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="player-slot p-2 mb-1 border-2 border-white bg-black/50" data-slot="6">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="player-slot p-2 border-2 border-white bg-black/50" data-slot="7">
										<span class="player-name text-gray-400" style="font-family: 'Courier New', monospace;">█ WAITING...</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 2: Semi Finals -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">ROUND 2</h3>
							</div>
							<div class="flex flex-col gap-32 mt-24">
								<!-- Semi 1 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="p-2 mb-1 border-2 border-white bg-black/50">
										<span class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="p-2 border-2 border-white bg-black">
										<span class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>

								<!-- Semi 2 -->
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="p-2 mb-1 border-2 border-white bg-black/50">
										<span class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="p-2 border-2 border-white bg-black">
										<span class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Round 3: Final -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">FINAL</h3>
							</div>
							<div class="flex flex-col justify-center min-h-[600px]">
								<div class="border-4 border-white p-3 w-64 bg-black/70 backdrop-blur-xs">
									<div class="p-2 mb-1 border-2 border-white bg-black/50">
										<span class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
									<div class="text-center text-white text-lg my-1" style="font-family: 'Courier New', monospace;">- VS -</div>
									<div class="p-2 border-2 border-white bg-black">
										<span class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Winner -->
						<div class="flex flex-col gap-8">
							<div class="text-center mb-4 border-2 border-white p-2 bg-black/70 backdrop-blur-xs">
								<h3 class="text-2xl font-bold text-white" style="font-family: 'Courier New', monospace;">★ WINNER ★</h3>
							</div>
							<div class="flex flex-col justify-center min-h-[600px]">
								<div class="border-4 border-white p-8 text-center bg-black/70 backdrop-blur-xs">
									<div class="text-6xl mb-4 text-white">🏆</div>
									<div class="text-gray-400" style="font-family: 'Courier New', monospace;">TBD</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Leave Button -->
				<div class="text-center mt-8">
					<button 
						id="leave-tournament-btn"
						class="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
					>
						Leave Tournament
					</button>
				</div>
			</div>
		</div>
		`;
	},

	mount(root: HTMLElement): void {
		const tournamentId = localStorage.getItem('tournamentId');
		const clientId = localStorage.getItem('clientId');

		const tournamentNameEl = root.querySelector('#tournament-name') as HTMLElement;
		const playerCountEl = root.querySelector('#player-count') as HTMLElement;
		const playersListEl = root.querySelector('#players-list') as HTMLElement;
		const leaveTournamentBtn = root.querySelector('#leave-tournament-btn') as HTMLButtonElement;



		const hashChangeHandler = (event: HashChangeEvent) => {
			console.log('Hash changed');
			const payLoad = {
				"method": "leave",
				"clientId": clientId
			}
			if (ws)
				ws.send(JSON.stringify(payLoad));

			window.removeEventListener('hashchange', hashChangeHandler);
		};
		window.addEventListener('hashchange', hashChangeHandler);
	}
};

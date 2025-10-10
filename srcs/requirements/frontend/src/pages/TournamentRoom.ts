import type { Page } from "../interface/gameInterface.js"

export let ws: WebSocket | undefined;
let clientId: string | undefined;

const reloadTournaments = function (root: HTMLElement) {

	const payLoad = {
		"method": "tournaments",
		"clientId": clientId
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));
}


function displayTournament(root: HTMLElement, tournaments: any[]) {
	const container = root.querySelector('#tournaments-container') as HTMLDivElement;
	container.innerHTML = '';

	tournaments.forEach(tournament => {
		const tournamentBtn = document.createElement('button');
		tournamentBtn.className = 'tournament-btn px-6 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono';
		tournamentBtn.dataset.tournamentId = tournament.tournamentId;
		tournamentBtn.innerHTML = `
			${tournament.tournamentName}<br>
			<span class="text-sm text-gray-600">${tournament.players}</span>
		`;
		tournamentBtn.addEventListener('click', () => {
			joinTournament(tournament.tournamentId);
		});

		container.appendChild(tournamentBtn);
	});
}

const createTournament = function (root: HTMLElement): void {
	const tournamentName = (root.querySelector('#tournament-name') as HTMLInputElement).value;
	const gamePoint = (root.querySelector('#game-point') as HTMLSelectElement).value;
	const gameMode = (root.querySelector('#game-mode') as HTMLSelectElement).value;

	const payLoad = {
		"method": "createT",
		"clientId": clientId,
		"tournamentName": tournamentName,
		"gamePoint": gamePoint,
		"gameMode": gameMode
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));

	// Close modal
	const modal = root.querySelector('#create-tournament-modal') as HTMLDivElement;
	modal.classList.add('hidden');
	modal.classList.remove('flex');

	// Reset form
	(root.querySelector('#create-tournament-form') as HTMLFormElement).reset();
}

const joinTournament = function (tournamentId: string) {
	const payLoad = {
		"method": "joinT",
		"clientId": clientId,
		"tournamentId": tournamentId
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));
}

export const TournamentRoom: Page = {
	render() {
		return `
	<div class="max-w-6xl mx-auto p-6 space-y-6">

		<div class="bg-white border-2 border-black p-8">
			<div class="flex justify-center">
				<h1 class="text-2xl font-bold text-center">Tournament</h1>
			</div>
			<div class="text-center mb-8">
				<div class="flex justify-center space-x-4">
					<button id="create-tournament-btn" class="px-8 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono">
						+ Create a Tournament
					</button>
				</div>
				<p>
					Le mode <span class="font-bold">Tournament</span> vous permet de participer à des compétitions organisées entre plusieurs joueurs.<br>
					Créez ou rejoignez un tournoi pour affronter d'autres participants dans une série de matchs à élimination ou en poule.<br>
					C'est l'occasion idéale de tester vos compétences, de viser la victoire et de grimper dans le classement tout en profitant d'une ambiance compétitive et conviviale !
				</p>
			</div>
		</div>

		<!-- Available Tournament Section -->
		<div class="bg-white border-2 border-black p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-bold">Available Tournament</h2>
				<button id="reload-btn" class="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono">
					🔄 Reload
				</button>
			</div>
			<div class="flex flex-wrap gap-4" id="tournaments-container">
				
			</div>
		</div>
	</div>

	<!-- Modal Create Tournament -->
	<div id="create-tournament-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
		<div class="bg-white border-4 border-black p-8 max-w-md w-full mx-4">
			<h3 class="text-2xl font-bold mb-6 text-center">Create a Tournament</h3>
			
			<form id="create-tournament-form" class="space-y-4">
				<div>
					<label class="block text-sm font-bold mb-2">Tournament Name:</label>
					<input 
						type="text" 
						id="tournament-name" 
						class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
						placeholder="Enter Tournament name"
						required
					>
				</div>

				<div>
					<label class="block text-sm font-bold mb-2">Number of Players:</label>
					<select id="player-count" class="w-full px-3 py-2 border-2 border-black focus:outline-none">
						<option value="8">8</option>
						<option value="6">6</option>
						<option value="4">4</option>
					</select>
				</div>
				
				<div>
					<label class="block text-sm font-bold mb-2">Party Point(s):</label>
					<select id="game-point" class="w-full px-3 py-2 border-2 border-black focus:outline-none">
						<option value="3">3</option>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</div>
				
				<div>
					<label class="block text-sm font-bold mb-2">Game Mode:</label>
					<select id="game-mode" class="w-full px-3 py-2 border-2 border-black focus:outline-none">
						<option value="classic">Classic Pong</option>
						<option value="power-up">Power-up Mode</option>
					</select>
				</div>
				
				<div class="flex space-x-4 mt-6">
					<button 
						type="submit" 
						class="flex-1 bg-green-500 text-white py-2 px-4 border-2 border-black hover:bg-green-600 transition-colors font-bold">
						CREATE
					</button>
					<button 
						type="button" 
						id="cancel-create" 
						class="flex-1 bg-red-500 text-white py-2 px-4 border-2 border-black hover:bg-red-600 transition-colors font-bold">
						CANCEL
					</button>
				</div>
			</form>
		</div>
	</div>
		`;
	},

	mount(root: HTMLElement): void {
		let tournamentId;
		if (ws === undefined) {
			const host = window.location.host;
			ws = new WebSocket(`wss://${host}/pong/ws`);
		}

		ws.onmessage = message => {
			const response = JSON.parse(message.data);

			if (response.method === "connect") {
				clientId = response.clientId;
				if (clientId !== undefined) {
					localStorage.setItem('clientId', clientId);
				}
				reloadTournaments(root);
			}

			if (response.method === "create") {
				tournamentId = response.tournament.tournamentId;
				joinTournament(tournamentId);
			}

			if (response.method === "join") {
				if (response.status === "success") {
					console.log(response.message);

					tournamentId = response.tournamentId;
					if (tournamentId !== undefined) {
						localStorage.setItem('tournamentId', tournamentId);
					}

					window.location.hash = response.url;
				} else {
					alert(response.message);
				}
			}

			if (response.method === "tournaments") {
				displayTournament(root, response.tournaments);
			}
		}

		// page buttons
		const createTournamentBtn = root.querySelector('#create-tournament-btn') as HTMLButtonElement;
		const reloadBtn = root.querySelector('#reload-btn') as HTMLButtonElement;

		if (createTournamentBtn) {
			createTournamentBtn.addEventListener('click', () => {
				const modal = root.querySelector('#create-tournament-modal') as HTMLDivElement;
				modal.classList.remove('hidden');
				modal.classList.add('flex');
			});
		}

		if (reloadBtn) {
			reloadBtn.addEventListener('click', () => {
				reloadTournaments(root);
			});
		}

		// Modal functionality
		const modal = root.querySelector('#create-tournament-modal') as HTMLDivElement;
		const cancelBtn = root.querySelector('#cancel-create') as HTMLButtonElement;
		const createForm = root.querySelector('#create-tournament-form') as HTMLFormElement;

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				modal.classList.add('hidden');
				modal.classList.remove('flex');
			});
		}

		// Close modal on background click
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				modal.classList.add('hidden');
				modal.classList.remove('flex');
			}
		});

		if (createForm) {
			createForm.addEventListener('submit', (e) => {
				e.preventDefault();
				createTournament(root);
			});
		}
	},
};
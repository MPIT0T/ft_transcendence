import type { Page } from "../interface/gameInterface.js"
import { Layout } from "./Layout";

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
		tournamentBtn.className = 'tournament-btn text-gray-50 px-6 py-3 border backdrop-blur-2xs border-gray-50 hover:bg-gray-700/50 transition-colors';
		tournamentBtn.dataset.tournamentId = tournament.tournamentId;
		tournamentBtn.innerHTML = `
			${tournament.tournamentName}<br>
			<span class="text-sm text-gray-400">${tournament.players}</span>
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
	const gameMode = "tournament";

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

		<div class="border border-gray-50 backdrop-blur-2xs p-8">
			<div class="flex justify-center">
				<h1 class="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift mb-5" data-i18n="tournament.title">Tournament</h1>
			</div>
			<div class="text-center mb-8">
				<div class="flex justify-center space-x-4">
					<button id="create-tournament-btn" class="px-8 py-3 font-bold text-2xl mb-5 border text-gray-50 border-gray-50 hover:bg-gray-700/50 transition-colors" data-i18n="tournament.createBtn">
						Créer un tournoi
					</button>
				</div>
				<p class="text-gray-200 text-lg" data-i18n="tournament.desc">
					Le mode <span class="font-bold">Tournament</span> vous permet de participer à des compétitions organisées entre plusieurs joueurs.<br>
					Créez ou rejoignez un tournoi pour affronter d'autres participants dans une série de matchs à élimination ou en poule.<br>
					C'est l'occasion idéale de tester vos compétences, de viser la victoire et de grimper dans le classement tout en profitant d'une ambiance compétitive et conviviale !
				</p>
			</div>
		</div>

		<!-- Available Tournament Section -->
		<div class="border border-gray-50 backdrop-blur-2xs p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl text-gray-50 font-bold" data-i18n="tournament.available">Available Tournament</h2>
				
			</div>
			<div class="flex flex-wrap gap-4" id="tournaments-container"></div>
		</div>
	</div>

	<!-- Modal Create Tournament -->
	<div id="create-tournament-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4">
			<h3 class="text-2xl font-bold mb-6 text-gray-50 text-center" data-i18n="tournament.createTitle">Create a Tournament</h3>
			
			<form id="create-tournament-form" class="space-y-4">
				<div>
					<label class="block text-sm font-bold mb-2 text-gray-200" data-i18n="tournament.nameLabel">Tournament Name:</label>
					<input 
						type="text" 
						id="tournament-name" 
						class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
						placeholder="Enter Tournament name"
						data-i18n-placeholder="tournament.namePlaceholder"
						pattern="^[a-zA-Z0-9]{3,12}$"
                 		title="Le nom doit contenir uniquement des lettres et chiffres (3-12 caractères)"
						required
					>
				</div>

				<div>
					<label class="block text-sm font-bold mb-2 text-gray-200" data-i18n="tournament.pointsLabel">Party Point(s):</label>
					<select id="game-point" class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50">
						<option value="3">3</option>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</div>
				
				<div class="flex space-x-4 mt-6">
					<button 
						type="submit" 
						class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700/50 hover:border-green-500 transition-colors font-bold" data-i18n="room.create">
						CRÉER
					</button>
					<button 
						type="button" 
						id="cancel-create" 
						class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700/50 hover:border-red-500 transition-colors font-bold" data-i18n="room.cancel">
						ANNULER
					</button>
				</div>
			</form>
		</div>
	</div>
		`;
	},

	mount(root: HTMLElement): void {
    Layout.redirectIfNotLoggedIn('/', true);

		let tournamentId;
		if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
			const host = window.location.host;
			ws = new WebSocket(`wss://${host}/tournament/ws`);
			ws.onclose = () => { ws = undefined; };
		}

		ws.onmessage = message => {
			const response = JSON.parse(message.data);

			if (response.method === "connect") {
				clientId = response.clientId;
				if (clientId !== undefined) {
					sessionStorage.setItem('clientId', clientId);
				}
				const payLoad = {
					"method": "user",
					"clientId": clientId,
					"token": sessionStorage.getItem('token'),
					"username": sessionStorage.getItem('username'),
				}
				if (ws)
					ws.send(JSON.stringify(payLoad));
			}

			if (response.method === "create") {
				tournamentId = response.tournament.tournamentId;
				joinTournament(tournamentId);
			}

			if (response.method === "joinT") {
				if (response.status === "success") {

					tournamentId = response.tournamentId;
					if (tournamentId !== undefined) {
						sessionStorage.setItem('tournamentId', tournamentId);
					}

					const tournamentName = response.tournamentName;
					if (tournamentName !== undefined) {
						sessionStorage.setItem('tournamentName', tournamentName);
					}
					const p = response.url;
					history.pushState(null, '', p);
					window.dispatchEvent(new PopStateEvent('popstate'));
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

		if (createTournamentBtn) {
			createTournamentBtn.addEventListener('click', () => {
				const modal = root.querySelector('#create-tournament-modal') as HTMLDivElement;
				modal.classList.remove('hidden');
				modal.classList.add('flex');
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

		let statusTournament: ReturnType<typeof setInterval> | undefined;
		statusTournament = setInterval(async () => {
			reloadTournaments(root);
		}, 1000);

		const popstateHandler = (event: PopStateEvent) => {
			window.clearInterval(statusTournament);
			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);

	},
};

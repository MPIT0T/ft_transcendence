import type { Page } from "../interface/gameInterface.js"

export let ws: WebSocket | undefined;
let clientId: string | undefined;

// Additional methods
const reloadRooms = function (root: HTMLElement) {

	const payLoad = {
		"method": "rooms",
		"clientId": clientId
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));
}

function displayRooms(root: HTMLElement, rooms: any[]) {
	const container = root.querySelector('#rooms-container') as HTMLDivElement;
	container.innerHTML = ''; // Vider le container

	rooms.forEach(room => {
		const roomBtn = document.createElement('button');
		roomBtn.className = 'room-btn text-gray-50 px-6 py-3 border backdrop-blur-2xs border-gray-50 hover:bg-gray-700/50 transition-colors';
		roomBtn.dataset.roomId = room.roomId;
		roomBtn.innerHTML = `
            ${room.roomName}<br>
            <span class="text-sm text-gray-400">${room.players}</span>
        `;
		roomBtn.addEventListener('click', () => {
			joinRoom(room.roomId);
		});

		container.appendChild(roomBtn);
	});
}

const createRoom = function (root: HTMLElement): void {
	const roomName = (root.querySelector('#room-name') as HTMLInputElement).value;
	const gamePoint = (root.querySelector('#game-point') as HTMLSelectElement).value;
	const gameMode = (root.querySelector('#game-mode') as HTMLSelectElement).value;

	const payLoad = {
		"method": "createR",
		"clientId": clientId,
		"roomName": roomName,
		"gamePoint": gamePoint,
		"gameMode": gameMode
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));

	// Close modal
	const modal = root.querySelector('#create-room-modal') as HTMLDivElement;
	modal.classList.add('hidden');
	modal.classList.remove('flex');

	// Reset form
	(root.querySelector('#create-room-form') as HTMLFormElement).reset();
}

const joinRoom = function (roomId: string) {
	const payLoad = {
		"method": "join",
		"clientId": clientId,
		"roomId": roomId
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));
}

export const GameRoom: Page = {
	render() {
		return `
	<div class="max-w-6xl mx-auto p-6 space-y-6">

		<div class="backdrop-blur-2xs border border-gray-50 p-8">
			<div class="flex justify-center">
				<h1 class="text-4xl z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift font-bold text-center mb-5">Ranked Game</h1>
			</div>
			<div class="text-center mb-8">
				<div class="flex justify-center space-x-4">
					
					<button id="vs-btn" class="px-10 py-3 font-bold text-2xl border border-gray-50 text-gray-50 hover:bg-gray-700/50 transition-colors mb-5">
						Jouer
					</button>
					</div>
				<p class="text-gray-200 text-lg">
					Le mode <span class="font-bold">Ranked</span> vous permet d'affronter un autre joueur dans une partie compétitive en 1 contre 1.<br>
					Chaque victoire ou défaite affecte votre classement général.<br>
					Relevez le défi pour grimper dans le classement et montrer vos compétences !
				</p>
			</div>
		</div>

		<div class="backdrop-blur-2xs border border-gray-50 p-8">
			<div class="flex justify-center">
				<h1 class="text-4xl z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-[length:400%_400%] animate-gradientShift font-bold text-center mb-5">Friendly Game</h1>
			</div>
			<div class="text-center mb-8">
				<div class="flex justify-center space-x-4">
					
					<button id="create-room-btn" class="px-10 py-3 text-2xl text-gray-50 border border-gray-50 hover:bg-gray-700/50 transition-colors mb-5">
						Créer une partie
					</button>
				</div>
				<p class="text-lg text-gray-200">
					Le mode <span class="font-bold">Friendly</span> vous permet de jouer des parties amicales sans impact sur votre classement.<br>
					Créez une salle ou rejoignez celle d'un ami pour vous entraîner, tester de nouvelles stratégies ou simplement vous amuser sans pression.<br>
					C'est l'endroit idéal pour défier vos amis ou rencontrer de nouveaux joueurs dans une ambiance détendue !
				</p>
			</div>
		</div>

		<!-- Available Rooms Section -->
		<div class="backdrop-blur-2xs border border-gray-50 p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl text-gray-50 font-bold">Available rooms</h2>
				<button id="reload-btn" class="px-4 py-2 font-bold text-gray-50 border border-gray-50 hover:bg-gray-700/50 transition-colors">
					Rafraichir
				</button>
			</div>
			<div class="flex flex-wrap gap-4" id="rooms-container"></div>
		</div>
	</div>

	<!-- Modal Matchmaking -->
	<div id="matchmaking-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4">
			<div class="text-center">
				<h2 class="text-3xl text-gray-50 font-bold mb-4">Matchmaking en cours</h2>
				<div class="flex justify-center mb-4">
          <div class="h-16 flex items-center justify-center gap-3">
            <span class="h-2 w-2 bg-white animate-bounceHigh [animation-delay:0ms]"></span>
            <span class="h-2 w-2 bg-white animate-bounceHigh [animation-delay:150ms]"></span>
            <span class="h-2 w-2 bg-white animate-bounceHigh [animation-delay:300ms]"></span>
          </div>
        </div>
				<p class="text-gray-400 mb-6">Veuillez patienter pendant que nous cherchons un adversaire</p>
				<button 
					id="cancel-matchmaking" 
					class="w-full text-gray-50 py-3 px-6 border border-gray-50 hover:border-red-500 hover:bg-gray-700/50 transition-colors font-bold">
					QUITTER LE MATCHMAKING
				</button>
			</div>
		</div>
	</div>

	<!-- Modal Create Room -->
	<div id="create-room-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4">
			<h3 class="text-2xl text-gray-50 font-bold mb-6 text-center">Créer une partie</h3>
			
			<form id="create-room-form" class="space-y-4">
				<div>
					<label class="block text-sm font-bold mb-2 text-gray-200">Nom :</label>
					<input 
						type="text" 
						id="room-name" 
						class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
						placeholder="Enter room name"
						required
					>
				</div>
				
				<div>
					<label class="block text-sm font-bold mb-2 text-gray-200">Points maximum :</label>
					<select id="game-point" class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50">
						<option value="3">3</option>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</div>
				
				<div>
					<label class="block text-sm font-bold mb-2">Mode de Jeu :</label>
					<select id="game-mode" class="w-full px-3 py-2 text-gray-200 border border-gray-400 focus:outline-none focus:border-gray-50">
						<option value="classic">Pong Classique</option>
					</select>
				</div>
				
				<div class="flex space-x-4 mt-6">
					<button 
						type="submit" 
						class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700/50 hover:border-green-500 transition-colors font-bold">
						CRÉER
					</button>
					<button 
						type="button" 
						id="cancel-create" 
						class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700/50 hover:border-red-500 transition-colors font-bold">
						ANNULER
					</button>
				</div>
			</form>
		</div>
	</div>
		`;
	},

	mount(root: HTMLElement): void {
		let roomId;
		if (ws === undefined) {
			const host = window.location.host;
			ws = new WebSocket(`wss://${host}/pong/ws`);
		}
		ws.onmessage = message => {
			const response = JSON.parse(message.data);

			if (response.method === "connect") {
				clientId = response.clientId;
				if (clientId !== undefined) {
					sessionStorage.setItem('clientId', clientId);
				}
				reloadRooms(root);
			}
			if (response.method === "create") {
				roomId = response.room.roomId;
				joinRoom(roomId)
			}

			if (response.method === "join") {
				if (response.status === "success") {

					roomId = response.room.roomId;
					if (roomId !== undefined) {
						sessionStorage.setItem('roomId', roomId);
					}

					// Fermer le modal de matchmaking si ouvert
					const matchmakingModal = root.querySelector('#matchmaking-modal') as HTMLDivElement;
					if (matchmakingModal) {
						matchmakingModal.classList.add('hidden');
						matchmakingModal.classList.remove('flex');
					}

					// navigate using History API
					const raw = response.url || '/';
					const p = raw.startsWith('#') ? raw.replace(/^#\/?/, '/') : (raw.startsWith('/') ? raw : '/' + raw);
					history.pushState(null, '', p);
					window.dispatchEvent(new PopStateEvent('popstate'));
				} else {
					alert(response.message);
				}
			}

			if (response.method === "rooms") {
				displayRooms(root, response.rooms);
			}
		}

		// page buttons
		const vsBtn = root.querySelector('#vs-btn') as HTMLButtonElement;
		const createRoomBtn = root.querySelector('#create-room-btn') as HTMLButtonElement;
		const matchmakingModal = root.querySelector('#matchmaking-modal') as HTMLDivElement;
		const cancelMatchmakingBtn = root.querySelector('#cancel-matchmaking') as HTMLButtonElement;

		if (vsBtn) {
			vsBtn.addEventListener('click', () => {
				// Afficher le modal de matchmaking
				if (matchmakingModal) {
					matchmakingModal.classList.remove('hidden');
					matchmakingModal.classList.add('flex');
				}

				// Lancer la recherche de match
				joinRoom("ranked");
			});
		}

		// Bouton pour quitter le matchmaking
		if (cancelMatchmakingBtn) {
			cancelMatchmakingBtn.addEventListener('click', () => {
				const payLoad = {
					"method": "leave",
					"clientId": clientId
				};
				if (ws) {
					ws.send(JSON.stringify(payLoad));
				}

				// Fermer le modal
				if (matchmakingModal) {
					matchmakingModal.classList.add('hidden');
					matchmakingModal.classList.remove('flex');
				}
			});
		}

		if (createRoomBtn) {
			createRoomBtn.addEventListener('click', () => {
				const modal = root.querySelector('#create-room-modal') as HTMLDivElement;
				modal.classList.remove('hidden');
				modal.classList.add('flex');
			});
		}

		// Modal functionality
		const modal = root.querySelector('#create-room-modal') as HTMLDivElement;
		const cancelBtn = root.querySelector('#cancel-create') as HTMLButtonElement;
		const createForm = root.querySelector('#create-room-form') as HTMLFormElement;

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
				createRoom(root);
			});
		}

		let statusRoom: ReturnType<typeof setInterval> | undefined;
		statusRoom = setInterval(async () => {
			reloadRooms(root);
		}, 1000);

		const popstateHandler = (event: PopStateEvent) => {
			window.clearInterval(statusRoom);
			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);

	},
};

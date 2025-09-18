import type { Page } from "../interface/gameInterface.js"

let ws = new WebSocket("/api/pong/ws");
let clientId: string | undefined;

// Additional methods
const reloadRooms = function (root: HTMLElement) {
	console.log('🔄 Reloading rooms...');

	// Simulate API call
	setTimeout(() => {
		const container = root.querySelector('#rooms-container') as HTMLDivElement;

		// Add a new room for demo
		const newRoom = document.createElement('button');
		newRoom.className = 'room-btn px-6 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono';
		newRoom.dataset.room = 'newplayer';
		newRoom.innerHTML = `
				NewPlayer's room<br>
				<span class="text-sm text-gray-600">0/2</span>
			`;

		newRoom.addEventListener('click', () => {
			joinRoom('newplayer');
		});

		container.appendChild(newRoom);

		console.log('✅ Rooms reloaded!');
	}, 500);
}

const createRoom = function (root: HTMLElement): void {
	const roomName = (root.querySelector('#room-name') as HTMLInputElement).value;
	const gamePoint = (root.querySelector('#game-point') as HTMLSelectElement).value;
	const gameMode = (root.querySelector('#game-mode') as HTMLSelectElement).value;

		const payLoad = {
			"method": "create",
			"clientId": clientId,
			"roomName": roomName,
			"gamePoint": gamePoint,
			"gameMode": gameMode
		}

		ws.send(JSON.stringify(payLoad));

		// Close modal
		const modal = root.querySelector('#create-room-modal') as HTMLDivElement;
		modal.classList.add('hidden');
		modal.classList.remove('flex');

		// Reset form
		(root.querySelector('#create-room-form') as HTMLFormElement).reset();
}

const 	joinRoom= function(roomName: string){
		console.log(`🚪 Joining room: ${roomName}`);

		// Simulate joining room
		setTimeout(() => {
			alert(`🎮 Joining ${roomName}'s room...`);
			window.location.hash = '/gameOnline';
		}, 500);
	}


export const GameRoom: Page = {
	render() {
		return `
	<div class="max-w-6xl mx-auto p-6 space-y-6">

		<div class="bg-white border-2 border-black p-8">
			<div class="flex justify-center">
				<h1 class="text-2xl font-bold text-center">Ranked Game</h1>
			</div>
			<div class="text-center mb-8">
				<div class="flex justify-center space-x-4">
					
					<button id="vs-btn" class="px-8 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono">
						👤 vs 👤
					</button>
					</div>
				<p>
					Le mode <span class="font-bold">Ranked</span> vous permet d'affronter un autre joueur dans une partie compétitive en 1 contre 1.<br>
					Chaque victoire ou défaite affecte votre classement général.<br>
					Relevez le défi pour grimper dans le classement et montrer vos compétences !
				</p>
			</div>
		</div>

		<div class="bg-white border-2 border-black p-8">
			<div class="flex justify-center">
				<h1 class="text-2xl font-bold text-center">Frendly Game</h1>
			</div>
			<div class="text-center mb-8">
				<div class="flex justify-center space-x-4">
					
					<button id="create-room-btn" class="px-8 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono">
						+ Create a room
					</button>
				</div>
				<p>
					Le mode <span class="font-bold">Friendly</span> vous permet de jouer des parties amicales sans impact sur votre classement.<br>
					Créez une salle ou rejoignez celle d'un ami pour vous entraîner, tester de nouvelles stratégies ou simplement vous amuser sans pression.<br>
					C'est l'endroit idéal pour défier vos amis ou rencontrer de nouveaux joueurs dans une ambiance détendue !
				</p>
			</div>
		</div>

		<!-- Available Rooms Section -->
		<div class="bg-white border-2 border-black p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-bold">Available rooms</h2>
				<button id="reload-btn" class="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono">
					🔄 Reload
				</button>
			</div>
			
			<div class="flex flex-wrap gap-4" id="rooms-container">
				<button class="room-btn px-6 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono" data-room="tjolivet">
					Mathis's room<br>
					<span class="text-sm text-gray-600">1/2</span>
				</button>
				<button class="room-btn px-6 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono" data-room="abastos">
					Max's room<br>
					<span class="text-sm text-gray-600">1/2</span>
				</button>
				<button class="room-btn px-6 py-3 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-mono" data-room="llethuil">
					Bob's room<br>
					<span class="text-sm text-gray-600">1/2</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Modal Create Room -->
	<div id="create-room-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
		<div class="bg-white border-4 border-black p-8 max-w-md w-full mx-4">
			<h3 class="text-2xl font-bold mb-6 text-center">Create a Room</h3>
			
			<form id="create-room-form" class="space-y-4">
				<div>
					<label class="block text-sm font-bold mb-2">Room Name:</label>
					<input 
						type="text" 
						id="room-name" 
						class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
						placeholder="Enter room name"
						required
					>
				</div>
				
				<div>
					<label class="block text-sm font-bold mb-2">Party Point (s):</label>
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
		
		let gameId;

		ws.onmessage = message => {
			//message.data
			const response = JSON.parse(message.data);
			//connect
			if (response.method === "connect"){
				clientId = response.clientId;
				console.log("Client id Set successfully " + clientId)
			}
			if (response.method === "create"){
                gameId = response.game.id;
                console.log("game successfully created with id " + response.game.id + " with " + response.game.balls + " balls")  
				
				const payLoad = {
					"method": "join",
					"clientId": clientId,
					"gameId": gameId
				}

				ws.send(JSON.stringify(payLoad));
			}

			if (response.method === "join"){
                const game = response.game;
				console.log(game);
				window.location.hash = '/gameOnline';
			}

		}


		// Game buttons
		const vsBtn = root.querySelector('#vs-btn') as HTMLButtonElement;
		const createRoomBtn = root.querySelector('#create-room-btn') as HTMLButtonElement;
		const reloadBtn = root.querySelector('#reload-btn') as HTMLButtonElement;

		if (vsBtn) {
			vsBtn.addEventListener('click', () => {
				// Direct 1v1 game
				const payLoad = {
					"method": "join",
					"clientId": clientId,
					"gameId": "rendom"
				}

				ws.send(JSON.stringify(payLoad));
			});
		}

		if (createRoomBtn) {
			createRoomBtn.addEventListener('click', () => {
				const modal = root.querySelector('#create-room-modal') as HTMLDivElement;
				modal.classList.remove('hidden');
				modal.classList.add('flex');
			});
		}

		if (reloadBtn) {
			reloadBtn.addEventListener('click', () => {
				reloadRooms(root);
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

		// Room buttons
		const roomBtns = root.querySelectorAll('.room-btn') as NodeListOf<HTMLButtonElement>;
		roomBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				const roomName = btn.dataset.room;
				joinRoom(roomName || '');
			});
		});
	},
};
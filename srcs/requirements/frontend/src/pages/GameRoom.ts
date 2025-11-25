import type { Page } from "../interface/gameInterface.js"
import {Layout} from "./Layout";

export let ws: WebSocket | undefined;
let clientId: string | undefined;
let pendingChallengeFriend: string | undefined;

// Additional methods
const reloadRooms = function (root: HTMLElement) {

	const payLoad = {
		"method": "rooms",
		"clientId": clientId
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));
}

Layout.redirectIfNotLoggedIn();

const reloadFriends = function (root: HTMLElement) {

	const payLoad = {
		"method": "friends",
		"clientId": clientId,
		"username": sessionStorage.getItem('username'),
		'token': sessionStorage.getItem('token'),
	}
	if (ws)
		ws.send(JSON.stringify(payLoad));
}

function displayFriends(root: HTMLElement, friends: any[]) {

	const container = root.querySelector('#friends-container') as HTMLDivElement;
	container.innerHTML = ''; // Vider le container

	friends.forEach(friend => {
		const friendBtn = document.createElement('button');
		friendBtn.className = 'friend-btn w-full text-left flex items-center justify-between text-gray-50 px-4 py-3 border-1 backdrop-blur-2xs border-gray-50 hover:bg-gray-700 transition-colors';
		friendBtn.dataset.username = friend.username;
		friendBtn.innerHTML = `
			<div class="w-full flex items-center">
				<div class="flex-1 min-w-0 font-semibold truncate mr-4">${friend.username || 'Unknown'}</div>
				<div class="w-20 text-md text-gray-300 text-right mr-4">${(friend.elo) ? 'Elo: ' + friend.elo : ''}</div>
			</div>
		`;
		friendBtn.addEventListener('click', () => {
			inviteFriends(friend.username);
		});

		container.appendChild(friendBtn);
	});
}


function displayRooms(root: HTMLElement, rooms: any[]) {
	const container = root.querySelector('#rooms-container') as HTMLDivElement;
	container.innerHTML = ''; // Vider le container

	rooms.forEach(room => {
		const roomBtn = document.createElement('button');
		roomBtn.className = 'room-btn w-full text-left flex items-center justify-between text-gray-50 px-6 py-3 border backdrop-blur-2xs border-gray-50 hover:bg-gray-700/50 transition-colors'
		roomBtn.dataset.roomId = room.roomId;
		roomBtn.innerHTML = `
			<div class="w-full flex items-center">
				<div class="flex-1 min-w-0 font-semibold truncate mr-4">${room.roomName}</div>
				<div class="w-28 text-md text-gray-300 text-right mr-4">${room.gameMode || ''}</div>
				<div class="w-20 text-md text-gray-400 text-right mr-4">${room.players}</div>
				<div class="w-20 text-sm text-gray-400 text-right">${room.gamePoint ? room.gamePoint + ' pts' : ''}</div>
			</div>
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

	const payLoad = {
		"method": "createR",
		"clientId": clientId,
		"roomName": roomName,
		"gamePoint": gamePoint,
		"gameMode": "1V1"
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

const inviteFriends = function (friend: string) {
	pendingChallengeFriend = friend;
	const modal = document.querySelector('#challenge-points-modal') as HTMLDivElement | null;
	const friendLabel = document.querySelector('#challenge-friend-label') as HTMLSpanElement | null;
	if (friendLabel) friendLabel.textContent = friend;
	if (modal) {
		modal.classList.remove('hidden');
		modal.classList.add('flex');
	}
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
	<div class="max-w-6xl mx-auto pt-20 space-y-6">

		<div class="backdrop-blur-2xs border border-gray-50 p-8">
			<div class="flex justify-center">
				<h1 class="text-4xl z-10 text-transparent bg-clip-text bg-linear-to-r from-red-500 via-blue-500 to-green-500 bg-size-[400%_400%] animate-gradientShift font-bold text-center mb-5">Ranked Game</h1>
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
				<h1 class="text-4xl z-10 text-transparent bg-clip-text bg-linear-to-r from-red-500 via-blue-500 to-green-500 bg-size-[400%_400%] animate-gradientShift font-bold text-center mb-5">Friendly Game</h1>
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

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Available Rooms Section -->
			<div class="backdrop-blur-2xs border border-gray-50 p-6">
				<div class="flex justify-between items-center mb-3">
					<h2 class="text-xl text-gray-50 font-bold ">Available rooms</h2>
				</div>
				<!-- Fixed-height scrollable area (one row per room) -->
				<div class="flex flex-col gap-3 overflow-y-auto max-h-56 p-2" id="rooms-container"></div>
			</div>
			<!-- Available frends Section -->
			<div class="backdrop-blur-2xs border border-gray-50 p-6">
				<div class="flex justify-between items-center mb-3">
					<h2 class="text-xl text-gray-50 font-bold">Available Friends</h2>
				</div>
				<!-- Fixed-height scrollable area -->
				<div class="flex flex-col gap-3 overflow-y-auto max-h-56 p-2" id="friends-container"></div>
			</div>
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
						pattern="^[a-zA-Z0-9]{3,12}$"
                  		title="Le nom doit contenir uniquement des lettres et chiffres (3-12 caractères)"
						required
					>
					<p id="room-name-error" class="text-red-500 text-sm mt-1 hidden">Le nom contient des caractères non autorisés</p>
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

	<!-- Modal Challenge Points -->
	<div id="challenge-points-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4">
			<h3 class="text-2xl text-gray-50 font-bold mb-6 text-center">Inviter <span id="challenge-friend-label" class="text-blue-400"></span></h3>
			<div>
				<label class="block text-sm font-bold mb-2 text-gray-200">Points maximum :</label>
				<select id="challenge-game-point" class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50">
					<option value="3">3</option>
					<option value="5">5</option>
					<option value="8" selected>8</option>
					<option value="10">10</option>
					<option value="15">15</option>
				</select>
			</div>
			<div class="flex space-x-4 mt-6">
				<button 
					id="challenge-send" 
					class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700 hover:border-green-500 transition-colors font-bold">
					ENVOYER L'INVITATION
				</button>
				<button 
					id="challenge-cancel" 
					class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700 hover:border-red-500 transition-colors font-bold">
					ANNULER
				</button>
			</div>
		</div>
	</div>

	<!-- Modal Challenge Received -->
	<div id="challenge-modal" class="fixed inset-0 backdrop-blur-lg hidden items-center justify-center z-50">
		<div class="border border-gray-50 p-8 max-w-md w-full mx-4">
			<h3 class="text-2xl text-gray-50 font-bold mb-4 text-center">Défi reçu</h3>
			<p id="challenge-text" class="text-gray-200 text-center mb-6">Un joueur vous invite à rejoindre une partie.</p>
			<div class="flex space-x-4 mt-2">
				<button 
					id="challenge-accept" 
					class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700 hover:border-green-500 transition-colors font-bold">
					ACCEPTER
				</button>
				<button 
					id="challenge-decline" 
					class="flex-1 text-white py-2 px-4 border border-gray-50 hover:bg-gray-700 hover:border-red-500 transition-colors font-bold">
					REFUSER
				</button>
			</div>
		</div>
	</div>
		`;
	},

	mount(root: HTMLElement): void {
		let roomId;
		let currentPage = true;

    Layout.redirectIfNotLoggedIn();

		if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
			const host = window.location.host;
			ws = new WebSocket(`wss://${host}/pong/ws`);
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
					"currentPage": "gameRoom"
				}
				if (ws)
					ws.send(JSON.stringify(payLoad));
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

			if (response.method === "friends") {
				displayFriends(root, response.friends);
			}

			// Afficher un modal de challenge avec Accept/Refuse
			if (response.method === "challenge") {
				const challengeModal = root.querySelector('#challenge-modal') as HTMLDivElement;
				const challengeText = root.querySelector('#challenge-text') as HTMLParagraphElement;
				const acceptBtn = root.querySelector('#challenge-accept') as HTMLButtonElement;
				const declineBtn = root.querySelector('#challenge-decline') as HTMLButtonElement;

				// Renseigner le texte et stocker le roomId sur le modal
				const challenger = response.from || 'Un joueur';
				const roomIdFromServer = response.roomId;
				if (challengeText) challengeText.textContent = `${challenger} vous défie ! Voulez-vous accepter ?`;
				if (challengeModal && roomIdFromServer) (challengeModal as any).dataset.roomId = roomIdFromServer;

				// Afficher le modal
				if (challengeModal) {
					challengeModal.classList.remove('hidden');
					challengeModal.classList.add('flex');
				}

				// Handler Accept: renvoyer un payload 'invite' avec roomId
				const onAccept = () => {
					const rid = (challengeModal as any)?.dataset?.roomId || roomIdFromServer;
					const payLoad = {
						method: 'invite',
						clientId: clientId,
						roomId: rid,
						to: challenger,
						response: 'yes'
					};
					if (ws) ws.send(JSON.stringify(payLoad));

					// Fermer le modal
					challengeModal.classList.add('hidden');
					challengeModal.classList.remove('flex');

					// Nettoyer les handlers
					acceptBtn?.removeEventListener('click', onAccept);
					declineBtn?.removeEventListener('click', onDecline);
				};

				// Handler Refuse: juste fermer le modal
				const onDecline = () => {
					challengeModal.classList.add('hidden');
					challengeModal.classList.remove('flex');
					acceptBtn?.removeEventListener('click', onAccept);
					declineBtn?.removeEventListener('click', onDecline);

					const rid = (challengeModal as any)?.dataset?.roomId || roomIdFromServer;
					const payLoad = {
						method: 'invite',
						clientId: clientId,
						roomId: rid,
						to: challenger,
						response: 'no'
					};
					if (ws) ws.send(JSON.stringify(payLoad));
				};

				acceptBtn?.addEventListener('click', onAccept);
				declineBtn?.addEventListener('click', onDecline);
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

				const payLoad = {
					"method": "user",
					"clientId": clientId,
					"token": sessionStorage.getItem('token'),
					"username": sessionStorage.getItem('username'),
					"currentPage": "null"
				}
				if (ws)
					ws.send(JSON.stringify(payLoad));

				currentPage = false;

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

				currentPage = true;

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

		// Challenge points modal elements
		const challengeModal = root.querySelector('#challenge-points-modal') as HTMLDivElement;
		const challengeSendBtn = root.querySelector('#challenge-send') as HTMLButtonElement;
		const challengeCancelBtn = root.querySelector('#challenge-cancel') as HTMLButtonElement;
		const challengePointsSelect = root.querySelector('#challenge-game-point') as HTMLSelectElement;

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

		// Challenge actions
		if (challengeCancelBtn) {
			challengeCancelBtn.addEventListener('click', () => {
				challengeModal.classList.add('hidden');
				challengeModal.classList.remove('flex');
				pendingChallengeFriend = undefined;
			});
		}

		if (challengeSendBtn) {
			challengeSendBtn.addEventListener('click', () => {
				if (!pendingChallengeFriend) return;
				const gp = parseInt(challengePointsSelect?.value || '8', 10);
				const payLoad = {
					method: 'challenge',
					clientId: clientId,
					friend: pendingChallengeFriend,
					gamePoint: gp,
				};
				if (ws) ws.send(JSON.stringify(payLoad));
				// close modal
				challengeModal.classList.add('hidden');
				challengeModal.classList.remove('flex');
				pendingChallengeFriend = undefined;
			});
		}

		let statusRoom: ReturnType<typeof setInterval> | undefined;
		statusRoom = setInterval(async () => {
			reloadRooms(root);
			reloadFriends(root);
			if (currentPage === true) {
				const payLoad = {
					"method": "user",
					"clientId": clientId,
					"token": sessionStorage.getItem('token'),
					"username": sessionStorage.getItem('username'),
					"currentPage": "gameRoom"
				}
				if (ws)
					ws.send(JSON.stringify(payLoad));
			}
		}, 1000);

		const popstateHandler = (event: PopStateEvent) => {
			window.clearInterval(statusRoom);
			const payLoad = {
				"method": "user",
				"clientId": clientId,
				"token": sessionStorage.getItem('token'),
				"username": sessionStorage.getItem('username'),
				"currentPage": "null"
			}
			if (ws)
				ws.send(JSON.stringify(payLoad));
			window.removeEventListener('popstate', popstateHandler);
		};
		window.addEventListener('popstate', popstateHandler);

	},
};

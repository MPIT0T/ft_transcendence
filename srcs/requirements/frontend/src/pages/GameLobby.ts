import type { Page } from "../interface/gameInterface.js"

export const GameLoby: Page = {
	render() {
		return `
			<!-- Modes de jeu -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto flex-1">

				<!-- Mode Local -->
				<button id="local-mode" class="relative group w-full bg-white p-6 border-8 border-black transition-all duration-300 hover:bg-gray-300 text-left">
					<div class="flex justify-center mb-4">
						<img src="Local_Game.png" alt="computer image" class="w-64 object-contain"/>
					</div>
					<div class="text-center">
						<h3 class="text-7xl font-bold text-gray-800 mb-3">Local</h3>
						<p class="text-gray-600 mb-6 text-xl">
							Jouez à deux sur le même ordinateur. 
							Parfait pour défier un ami assis à côté de vous !
						</p>
					</div>
					<div class="space-y-2 mb-6">
						<div class="flex justify-between text-xl">
							<span class="text-gray-500">Joueurs :</span>
							<span class="font-semibold">2 locaux</span>
						</div>
						<div class="flex justify-between text-xl">
							<span class="text-gray-500">Contrôles :</span>
							<span class="font-semibold">W/S vs ↑/↓</span>
						</div>
						<div class="flex justify-between text-xl">
							<span class="text-gray-500">Difficulté :</span>
							<span class="font-semibold text-green-600">Facile</span>
						</div>
					</div>

					<!-- Overlay text -->
					<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-3xl font-bold ">
						Click to Join!
					</div>
				</button>


				<!-- Mode Online -->
				<button id="online-mode" class="relative group w-full bg-white p-6 border-8 border-black transition-all duration-300 hover:bg-gray-300 text-left">
					<div class="flex justify-center mb-4">
						<img src="online.png" alt="online image" class="w-64 object-contain"/>
					</div>
					<div class="text-center">
						<h3 class="text-7xl font-bold text-gray-800 mb-3">En Ligne</h3>
						<p class="text-gray-600 mb-6 text-xl">
							Affrontez des joueurs du monde entier en temps réel.
							Système de matchmaking automatique !
						</p>
					</div>
					<div class="space-y-2 mb-6">
						<div class="flex justify-between text-xl">
							<span class="text-gray-500">Joueurs :</span>
							<span class="font-semibold">2 en ligne</span>
						</div>
						<div class="flex justify-between text-xl">
							<span class="text-gray-500">Latence :</span>
							<span class="font-semibold text-green-600">< 50ms</span>
						</div>
						<div class="flex justify-between text-xl">
							<span class="text-gray-500">Classement :</span>
							<span class="font-semibold text-purple-600">Actif</span>
						</div>
					</div>

					<!-- Overlay text -->
					<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-3xl font-bold ">
						Click to Join!
					</div>
				</button>

				<!-- Mode Tournoi -->
				<button id="tournament-mode" class="relative group w-full bg-white p-6 border-8 border-black transition-all duration-300 hover:bg-gray-300 text-left">
					<div class="flex justify-center mb-4">
						<img src="trophy.png" alt="trophy image" class="w-64 object-contain"/>
					</div>
					<div class="text-center">
						<h3 class="text-7xl font-bold text-gray-800 mb-3">Tournoi</h3>
						<p class="text-gray-600 mb-6 text-xl">
							Participez à des tournois avec élimination directe. Montez dans le classement mondial !
						</p>
					</div>
					<div class="space-y-2 mb-6">
					<div class="flex justify-between text-xl">
						<span class="text-gray-500">Format :</span>
						<span class="font-semibold">Élimination directe</span>
					</div>
					<div class="flex justify-between text-xl">
						<span class="text-gray-500">Participants :</span>
						<span class="font-semibold">8-16 joueurs</span>
					</div>
					<div class="flex justify-between text-xl">
						<span class="text-gray-500">Récompenses :</span>
						<span class="font-semibold text-yellow-600">Points & Badges</span>
					</div>
					</div>

					<!-- Overlay text -->
					<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-3xl font-bold ">
						Click to Join!
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
				window.location.hash = '/game';
			});
		}

		// Mode Online
		const onlineBtn = root.querySelector('#online-mode') as HTMLButtonElement;
		if (onlineBtn) {
			onlineBtn.addEventListener('click', () => {
				// TODO: Implémenter la recherche d'adversaire
				alert('🌐 Recherche d\'un adversaire en ligne...\n(Fonctionnalité à venir)');
			});
		}


		// Mode Tournoi
		const tournamentBtn = root.querySelector('#tournament-mode') as HTMLButtonElement;
		if (tournamentBtn) {
			tournamentBtn.addEventListener('click', () => {
				// TODO: Implémenter les tournois
				alert('🏆 Système de tournoi en cours de développement...\n(Fonctionnalité à venir)');
			});
		}
	}
};
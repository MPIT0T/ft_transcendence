import type { Page } from "../interface/gameInterface.js"

export const GameLoby: Page = {
	render() {
		return `
			<div class="flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 p-6">
				<!-- Header -->
				<div class="text-center mb-8">
					<h1 class="text-4xl font-bold text-gray-800 mb-2">🎮 Choisir le mode de jeu</h1>
					<p class="text-gray-600">Sélectionnez votre mode de jeu préféré</p>
				</div>

				<!-- Modes de jeu -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto flex-1">
					
					<!-- Mode Local -->
					<div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-300">
						<div class="text-center">
							<div class="text-6xl mb-4">🎯</div>
							<h3 class="text-2xl font-bold text-gray-800 mb-3">Mode Local</h3>
							<p class="text-gray-600 mb-6 text-sm">
								Jouez à deux sur le même ordinateur. 
								Parfait pour défier un ami assis à côté de vous !
							</p>
							<div class="space-y-2 mb-6">
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Joueurs :</span>
									<span class="font-semibold">2 locaux</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Contrôles :</span>
									<span class="font-semibold">W/S vs ↑/↓</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Difficulté :</span>
									<span class="font-semibold text-green-600">Facile</span>
								</div>
							</div>
							<button id="local-mode" class="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
								Jouer en Local
							</button>
						</div>
					</div>

					<!-- Mode Online -->
					<div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-300">
						<div class="text-center">
							<div class="text-6xl mb-4">🌐</div>
							<h3 class="text-2xl font-bold text-gray-800 mb-3">Mode Online</h3>
							<p class="text-gray-600 mb-6 text-sm">
								Affrontez des joueurs du monde entier en temps réel.
								Système de matchmaking automatique !
							</p>
							<div class="space-y-2 mb-6">
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Joueurs :</span>
									<span class="font-semibold">2 en ligne</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Latence :</span>
									<span class="font-semibold text-green-600">< 50ms</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Classement :</span>
									<span class="font-semibold text-purple-600">Actif</span>
								</div>
							</div>
							<button id="online-mode" class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
								Rechercher un Adversaire
							</button>
						</div>
					</div>

					<!-- Mode Tournoi -->
					<div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-yellow-300">
						<div class="text-center">
							<div class="text-6xl mb-4">🏆</div>
							<h3 class="text-2xl font-bold text-gray-800 mb-3">Mode Tournoi</h3>
							<p class="text-gray-600 mb-6 text-sm">
								Participez à des tournois avec élimination directe.
								Montez dans le classement mondial !
							</p>
							<div class="space-y-2 mb-6">
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Format :</span>
									<span class="font-semibold">Élimination directe</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Participants :</span>
									<span class="font-semibold">8-16 joueurs</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Récompenses :</span>
									<span class="font-semibold text-yellow-600">Points & Badges</span>
								</div>
							</div>
							<button id="tournament-mode" class="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
								Rejoindre un Tournoi
							</button>
						</div>
					</div>


					<!-- Mode Personnalisé -->
					<div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-indigo-300">
						<div class="text-center">
							<div class="text-6xl mb-4">⚙️</div>
							<h3 class="text-2xl font-bold text-gray-800 mb-3">Mode Personnalisé</h3>
							<p class="text-gray-600 mb-6 text-sm">
								Créez votre propre partie avec des règles custom.
								Vitesse, taille, effets spéciaux !
							</p>
							<div class="space-y-2 mb-6">
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Règles :</span>
									<span class="font-semibold">Personnalisables</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Effets :</span>
									<span class="font-semibold text-rainbow">Power-ups</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">Partage :</span>
									<span class="font-semibold text-indigo-600">Code de partie</span>
								</div>
							</div>
							<button id="custom-mode" class="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors">
								Créer une Partie
							</button>
						</div>
					</div>
				</div>

				
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
				window.location.hash = '/gameRoom';
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


		// Mode Personnalisé
		const customBtn = root.querySelector('#custom-mode') as HTMLButtonElement;
		if (customBtn) {
			customBtn.addEventListener('click', () => {
				// TODO: Implémenter le mode personnalisé
				alert('⚙️ Mode personnalisé en cours de développement...\n(Fonctionnalité à venir)');
			});
		}

	}
};
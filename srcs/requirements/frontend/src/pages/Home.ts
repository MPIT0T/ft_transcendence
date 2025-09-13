import type { Page } from "../interface/gameInterface.js"

const initGamePreview = function () {
		const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// État du jeu basé sur votre backend
		const gameState = {
			p1: { x: 10, y: 125, width: 10, height: 50, vel_y: 0, score: 3 },
			p2: { x: 480, y: 125, width: 10, height: 50, vel_y: 0, score: 2 },
			ball: { x: 250, y: 150, width: 10, height: 10, vel_x: 2, vel_y: 1.5 }
		};

		let animationFrame: number;

		const updateGame = () => {
			// Logique simplifiée basée sur votre backend
			gameState.ball.x += gameState.ball.vel_x;
			gameState.ball.y += gameState.ball.vel_y;

			// Collision avec les murs haut/bas
			if (gameState.ball.y <= 0 || gameState.ball.y + gameState.ball.height >= 300) {
				gameState.ball.vel_y *= -1;
			}

			// Collision avec les raquettes (simplifié)
			if ((gameState.ball.x <= gameState.p1.x + gameState.p1.width &&
				gameState.ball.y >= gameState.p1.y &&
				gameState.ball.y <= gameState.p1.y + gameState.p1.height) ||
				(gameState.ball.x + gameState.ball.width >= gameState.p2.x &&
					gameState.ball.y >= gameState.p2.y &&
					gameState.ball.y <= gameState.p2.y + gameState.p2.height)) {
				gameState.ball.vel_x *= -1;
			}

			// Reset si la balle sort
			if (gameState.ball.x < 0 || gameState.ball.x > 500) {
				gameState.ball.x = 250;
				gameState.ball.y = 150;
				gameState.ball.vel_x *= -1;
			}

			// Mouvement automatique des raquettes pour la démo
			if (Math.random() < 0.02) {
				gameState.p1.vel_y = (Math.random() - 0.5) * 4;
				gameState.p2.vel_y = (Math.random() - 0.5) * 4;
			}

			gameState.p1.y += gameState.p1.vel_y;
			gameState.p2.y += gameState.p2.vel_y;

			// Limites des raquettes
			gameState.p1.y = Math.max(0, Math.min(250, gameState.p1.y));
			gameState.p2.y = Math.max(0, Math.min(250, gameState.p2.y));

			// Friction
			gameState.p1.vel_y *= 0.95;
			gameState.p2.vel_y *= 0.95;
		};

		const draw = () => {
			// Effacer le canvas
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, 500, 300);

			// Ligne centrale
			ctx.setLineDash([10, 10]);
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(250, 0);
			ctx.lineTo(250, 300);
			ctx.stroke();
			ctx.setLineDash([]);

			// Dessiner les raquettes
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(gameState.p1.x, gameState.p1.y, gameState.p1.width, gameState.p1.height);
			ctx.fillRect(gameState.p2.x, gameState.p2.y, gameState.p2.width, gameState.p2.height);

			// Dessiner la balle
			ctx.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball.width, gameState.ball.height);

			// Dessiner les scores
			ctx.font = 'bold 36px monospace';
			ctx.textAlign = 'center';
			ctx.fillText(gameState.p1.score.toString(), 125, 50);
			ctx.fillText(gameState.p2.score.toString(), 375, 50);
		};

		const gameLoop = () => {
			updateGame();
			draw();
			animationFrame = requestAnimationFrame(gameLoop);
		};

		// Démarrer l'animation
		gameLoop();

		// Nettoyer l'animation si on quitte la page
		const cleanup = () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};

		// Ajouter un gestionnaire pour nettoyer l'animation
		window.addEventListener('beforeunload', cleanup);

		// Stocker la fonction de nettoyage pour pouvoir l'appeler plus tard
		(window as any).cleanupGamePreview = cleanup;
	}

export const Home: Page = {
	render() {
		return `
			<div class="flex flex-col bg-gray-100">
				<div class="flex lg:flex-row items-start justify-center p-2">
					<!-- Header -->
					<div class="text-center mb-5">
						<h1 class="text-6xl font-bold  bg-clip-text text-gray-700 mb-4">
							ft_transcendence
						</h1>
						<p class="text-xl text-gray-600 mb-2">
							🏓 Le jeu Pong légendaire revisité
						</p>
						<p class="text-lg text-gray-500 max-w-2xl mx-auto">
							Affrontez vos amis dans des parties épiques de Pong, suivez vos statistiques et grimpez dans le classement !
						</p>
					</div>
				</div>

				
				<!-- Features Grid -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto  mb-5">
					<div class="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border">
						<div class="text-4xl mb-4">⚡</div>
						<h3 class="text-xl font-semibold mb-2 text-gray-700">Parties Rapides</h3>
						<p class="text-gray-500 text-sm">Lancez une partie en quelques secondes</p>
					</div>
					
					<div class="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border">
						<div class="text-4xl mb-4">🏆</div>
						<h3 class="text-xl font-semibold mb-2 text-gray-700">Classements</h3>
						<p class="text-gray-500 text-sm">Suivez votre progression et votre rang</p>
					</div>
					
					<div class="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border">
						<div class="text-4xl mb-4">👥</div>
						<h3 class="text-xl font-semibold mb-2 text-gray-700">Multijoueur</h3>
						<p class="text-gray-500 text-sm">Défiez vos amis en temps réel</p>
					</div>
				</div>
				
				
				<!-- Boutons d'action -->
				<div class="flex justify-center gap-4 mb-8">
					<button 
						id="play-btn" 
						class="px-8 py-4 bg-green-500 text-white rounded-xl text-lg font-semibold  transform hover:scale-105  duration-200 shadow-lg">
						🎮 Jouer maintenant
					</button>
				</div>
						
						<!-- Game Preview Réaliste -->
						<div class="bg-white rounded-xl p-8 max-w-3xl mx-auto shadow-lg border">
						<h3 class="text-2xl font-bold text-center mb-6 text-gray-700">Aperçu du Jeu</h3>
						
						<!-- Canvas de prévisualisation -->
						<div class="flex justify-center mb-6">
						<canvas 
							id="preview-canvas" 
							width="500" 
							height="300" 
							class="bg-black border-2 border-gray-300 rounded"
							style="image-rendering: pixelated;">
							</canvas>
							</div>
							
							<!-- Contrôles et informations -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="text-center">
						<h4 class="text-lg font-semibold mb-2 text-gray-700">Joueur 1</h4>
						<p class="text-gray-600">Contrôles : W ↑ / S ↓</p>
						<div class="mt-2 text-sm text-gray-500">Raquette gauche</div>
						</div>
						
						<div class="text-center">
							<h4 class="text-lg font-semibold mb-2 text-gray-700">Joueur 2</h4>
							<p class="text-gray-600">Contrôles : ↑ / ↓</p>
							<div class="mt-2 text-sm text-gray-500">Raquette droite</div>
							</div>
							</div>
							
							<!-- Règles du jeu -->
							<div class="mt-6 p-4 bg-gray-50 rounded-lg">
						<h4 class="font-semibold mb-2 text-gray-700">Règles :</h4>
						<ul class="text-sm text-gray-600 space-y-1">
						<li>• Utilisez votre raquette pour renvoyer la balle</li>
						<li>• Marquez un point quand la balle dépasse la raquette adverse</li>
						<li>• La balle rebondit sur les murs haut et bas</li>
						<li>• Premier à 5 points gagne la partie</li>
						</ul>
						</div>
						</div>
						</div>
						`;
	},

	mount(root) {
		// Bouton Jouer
		const gameBtn = root.querySelector('#play-btn') as HTMLButtonElement;
		if (gameBtn) {
			gameBtn.addEventListener('click', () => {
				window.location.hash = '/gameLoby';
			})
		}

		// Bouton Statistiques
		const statsBtn = root.querySelector('#stats-btn') as HTMLButtonElement;
		if (statsBtn) {
			statsBtn.addEventListener('click', () => {
				window.history.pushState({}, "", '/stats');
				window.dispatchEvent(new PopStateEvent('popstate'));
			});
		}

		// Initialiser l'aperçu du jeu
		initGamePreview();
	},

	
}

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
			<section class="h-screen flex flex-col items-center justify-center">
				<div class="flex lg:flex-row items-start justify-center p-2">
					<div class="text-center mb-5 ">
						<div class="relative inline-block">
							<span class="absolute top-0 left-0 text-8xl font-bold text-white">
								ft_transcendence
							</span>

							<span
								class="relative z-10 text-8xl text-transparent bg-clip-text 
									bg-gradient-to-r from-red-500 via-blue-500 to-green-500
									bg-[length:400%_400%] animate-gradientShift">
								ft_transcendence
							</span>
						</div>
					</div>
				</div>

				<div class="flex justify-center gap-4 mb-8">
					<button 
						id="play-btn" 
						class="px-8 py-4 bg-white text-black text-lg font-semibold  transform hover:bg-gray-300  duration-200 shadow-lg">
						Jouer maintenant
					</button>
				</div>
			</section>


			<section class="py-20">
				<div class="bg-white p-5 max-w-xl mx-auto shadow-lg border">
					<h3 class="text-2xl font-bold text-center mb-6 text-gray-700">Aperçu du Jeu</h3>
					
					<div class="flex justify-center">
						<canvas 
							id="preview-canvas" 
							width="500" 
							height="300" 
							class="bg-black border-2 border-gray-300 rounded"
							style="image-rendering: pixelated;">
						</canvas>
					</div>
				</div>
			</section>


			<section class="">
				<div class="mt-6 p-5 max-w-xl bg-gray-50 mx-auto">
					<h4 class="font-semibold mb-2 w-full mx-auto text-gray-700">Règles :</h4>
					<ul class="text-sm text-gray-600 space-y">
						<li>• Utilisez votre raquette pour renvoyer la balle</li>
						<li>• Marquez un point quand la balle dépasse la raquette adverse</li>
						<li>• La balle rebondit sur les murs haut et bas</li>
						<li>• Premier à 5 points gagne la partie</li>
					</ul>
				</div>
			</section>
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

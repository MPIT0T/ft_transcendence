import type { Page } from "../interface/gameInterface.js"

const initGamePreview = function () {
	const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	// Scale factor - change this to easily resize the entire preview
	const SCALE = 2.7
	const BASE_WIDTH = 500;
	const BASE_HEIGHT = 300;

	// Apply scale to canvas
	canvas.width = BASE_WIDTH * SCALE;
	canvas.height = BASE_HEIGHT * SCALE;

	// État du jeu basé sur votre backend (coordinates in base units)
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

		// Collision avec les murs haut/bas (using base coordinates)
		if (gameState.ball.y <= 0 || gameState.ball.y + gameState.ball.height >= BASE_HEIGHT) {
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
		if (gameState.ball.x < 0 || gameState.ball.x > BASE_WIDTH) {
			gameState.ball.x = BASE_WIDTH / 2;
			gameState.ball.y = BASE_HEIGHT / 2;
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
		gameState.p1.y = Math.max(0, Math.min(BASE_HEIGHT - gameState.p1.height, gameState.p1.y));
		gameState.p2.y = Math.max(0, Math.min(BASE_HEIGHT - gameState.p2.height, gameState.p2.y));

		// Friction
		gameState.p1.vel_y *= 0.95;
		gameState.p2.vel_y *= 0.95;
	};

	const draw = () => {
		// Clear the canvas with transparency
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Ligne centrale
		ctx.setLineDash([10 * SCALE, 10 * SCALE]);
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2 * SCALE;
		ctx.beginPath();
		ctx.moveTo((BASE_WIDTH / 2) * SCALE, 0);
		ctx.lineTo((BASE_WIDTH / 2) * SCALE, canvas.height);
		ctx.stroke();
		ctx.setLineDash([]);

		// Dessiner les raquettes
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(gameState.p1.x * SCALE, gameState.p1.y * SCALE, gameState.p1.width * SCALE, gameState.p1.height * SCALE);
		ctx.fillRect(gameState.p2.x * SCALE, gameState.p2.y * SCALE, gameState.p2.width * SCALE, gameState.p2.height * SCALE);

		// Dessiner la balle
		ctx.fillRect(gameState.ball.x * SCALE, gameState.ball.y * SCALE, gameState.ball.width * SCALE, gameState.ball.height * SCALE);

		// Dessiner les scores
		ctx.font = `bold ${36 * SCALE}px monospace`;
		ctx.textAlign = 'center';
		ctx.fillText(gameState.p1.score.toString(), (BASE_WIDTH / 4) * SCALE, 50 * SCALE);
		ctx.fillText(gameState.p2.score.toString(), (BASE_WIDTH * 3 / 4) * SCALE, 50 * SCALE);
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
<!-- Home page -->
<section class="h-screen relative flex flex-col items-center justify-center">
  <div class="flex lg:flex-row items-start justify-center p-2">
    <div class="text-center mb-5 ">
      <div class=" inline-block
           z-10 text-title text-transparent bg-clip-text
          bg-gradient-to-r from-red-500 via-blue-500 to-green-500
          bg-[length:400%_400%] animate-gradientShift">
        ft_transcendence
      </div>
    </div>
  </div>

  <div class="flex justify-center gap-4 mb-8">
    <button 
      id="play-btn" 
      class="px-12 py-7 backdrop-blur-2xs border-1 border-gray-50 text-gray-50 text-4xl font-bold transform hover:bg-gray-700 hover:bg-opacity-10 duration-200">
      Jouer maintenant
    </button>
  </div>

  <div id="scroll-indicator" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500 opacity-100">
    <img src="/arrow.png" alt="scroll down" class="w-10 animate-arrowHueBlink [animation-delay:0s]" />
    <img src="/arrow.png" alt="scroll down" class="w-10 animate-arrowHueBlink [animation-delay:0.1s]" />
    <img src="/arrow.png" alt="scroll down" class="w-10 animate-arrowHueBlink [animation-delay:0.2s]" />
  </div>
</section>

<!-- Game preview and rules -->
<section class="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10">
  <!-- Game preview -->
  <div class="w-full h-full flex flex-col justify-center items-center">
    <h3 id="preview-text" class="text-4xl font-bold text-center mb-6 text-gray-50 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
      Aperçu du Jeu
    </h3>
    <canvas 
      id="preview-canvas" 
      class="border-2 border-gray-300 backdrop-blur-2xs"
    ></canvas>
  </div>

  <!-- Rules, History, Facts -->
  <div class="w-full backdrop-blur-2xs border-2 border-gray-300x h-full flex flex-col shadow-xl p-6">
    
    <!-- Rules -->
    <h4 class="text-4xl font-semibold mb-4 w-full mx-auto mt-4 text-gray-50 drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">
      Règles :
    </h4>
    <ul class="text-lg lg:text-xl text-gray-400 space-y-2 leading-relaxed">
      <li">• Utilisez votre raquette pour renvoyer la balle.</li>
      <li>• Marquez un point quand la balle dépasse la raquette adverse.</li>
      <li>• La balle rebondit sur les murs haut et bas.</li>
      <li>• Premier à 5 points gagne la partie.</li>
    </ul>

    <!-- History -->
    <h4 class="text-4xl font-semibold mb-4 w-full mx-auto mt-8 text-gray-50 drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">
      Histoire :
    </h4>
    <ul class="text-lg lg:text-xl text-gray-400 space-y-2 leading-relaxed">
      <li>• Créé en 1972 par Allan Alcorn chez Atari, sur une idée de Nolan Bushnell.</li>
      <li>• Inspiré du jeu de tennis de table du Magnavox Odyssey, la première console domestique.</li>
      <li>• Le prototype rencontre un immense succès dès son installation dans un bar californien.</li>
      <li>• Commercialisé ensuite comme borne d’arcade, il devient le premier grand succès du jeu vidéo.</li>
      <li>• Malgré un conflit juridique avec Magnavox, Atari consolide sa place de pionnier du secteur.</li>
      <li>• En 1975, une version domestique est lancée avec Sears, popularisant le jeu vidéo à la maison.</li>
    </ul>

    <!-- Fun facts -->
    <h4 class="text-4xl font-semibold mb-4 w-full mx-auto mt-8 text-gray-50 drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">
      Le Saviez-vous ?
    </h4>
    <ul class="text-lg lg:text-xl text-gray-400 space-y-2 leading-relaxed">
      <li>• Le premier prototype de Pong est tombé en panne car le réservoir de pièces était plein.</li>
      <li>• Des dizaines de copies non autorisées ont envahi le marché dès 1973, lançant la “Pong mania”.</li>
      <li>• Atari a vendu plus de 8 000 bornes d’arcade en un an, un record à l’époque.</li>
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

		const scrollIndicator = root.querySelector('#scroll-indicator') as HTMLDivElement | null;
		if (scrollIndicator) {
			const handleScroll = () => {
        if (window.scrollY > 30) {
          scrollIndicator.classList.remove('opacity-100');
          scrollIndicator.classList.add('opacity-0');
        } else {
          scrollIndicator.classList.remove('opacity-0');
          scrollIndicator.classList.add('opacity-100');
        }
			};
      window.addEventListener('scroll', handleScroll);
      (window as any).cleanupScrollIndicator = () => window.removeEventListener('scroll', handleScroll);
		}

		// Initialiser l'aperçu du jeu
		initGamePreview();
	},

	
}

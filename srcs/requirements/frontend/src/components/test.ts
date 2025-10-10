import { Player, Ball } from "../interface/gameInterface";
import { ws } from "../pages/GameRoom";

export class GameComponentOnline {
	private container: HTMLElement;                    // Conteneur DOM
	private canStart: boolean = false;                 // État du jeu (pause/play)
	private canvas: HTMLCanvasElement | null = null;   // Élément canvas
	private context: CanvasRenderingContext2D | null = null; // Context 2D
	private animationId: number | null = null;         // ID de l'animation

	// Position actuelle rendue (ce qu'on voit à l'écran)
	private p1Rendered: Player = {
		x: 20,
		y: 260,
		width: 8,
		height: 80,
		vel_y: 0
	};

	private p2Rendered: Player = {
		x: 872,
		y: 260,
		width: 8,
		height: 80,
		vel_y: 0
	};

	private ballRendered: Ball = {
		x: 450,
		y: 300,
		width: 8,
		height: 8,
		vel_x: 6,
		vel_y: 4
	};

	// Position cible (reçue du serveur)
	private p1: Player = {
		x: 20,
		y: 260,
		width: 8,
		height: 80,
		vel_y: 0
	};

	private p2: Player = {
		x: 872,
		y: 260,
		width: 8,
		height: 80,
		vel_y: 0
	};

	private ball: Ball = {
		x: 450,
		y: 300,
		width: 8,
		height: 8,
		vel_x: 6,
		vel_y: 4
	};

	private p1Score: number = 0;
	private p2Score: number = 0;

	// Facteur d'interpolation (0.2 = 20% vers la cible à chaque frame)
	private lerpFactor: number = 0.8;

	constructor(container: HTMLElement, initialCanStart: boolean = false) {
		this.container = container;
		this.canStart = initialCanStart;
		this.render();              // Crée le HTML
		this.setupCanvas();         // Configure le canvas
		this.setupEventListeners(); // Ajoute les contrôles clavier
	}

	setCanStart(canStart: boolean) {
		this.canStart = canStart;
		if (this.canStart) {
			this.startGame();
		} else {
			this.pauseGame();
		}
	}

	updateGameState(game: any){
		if (!game) {
			console.log("No game state provided.");
			return;
		}
		console.log(game);
		if (game.player1) {
			this.p1.x = game.player1.x;
			this.p1.y = game.player1.y;
			this.p1.width = game.player1.width;
			this.p1.height = game.player1.height;
			this.p1.vel_y = game.player1.vel_y;
		}
		if (game.player2) {
			this.p2.x = game.player2.x;
			this.p2.y = game.player2.y;
			this.p2.width = game.player2.width;
			this.p2.height = game.player2.height;
			this.p2.vel_y = game.player2.vel_y;
		}
		if (game.ball) {
			this.ball.x = game.ball.x;
			this.ball.y = game.ball.y;
			this.ball.width = game.ball.width;
			this.ball.height = game.ball.height;
			this.ball.vel_x = game.ball.vel_x;
			this.ball.vel_y = game.ball.vel_y;
		}
		if (typeof game.p1Score === "number") {
			this.p1Score = game.p1Score;
		}
		if (typeof game.p2Score === "number") {
			this.p2Score = game.p2Score;
		}
		
		// Redessiner immédiatement si le jeu n'est pas encore démarré
		if (!this.canStart) {
			this.drawInitialState();
		}
	}

	private render() {
		this.container.innerHTML = `
			<div class="w-full flex justify-center">
				<canvas 
					id="game-canvas" 
					class="bg-black border-2 border-white"
					width="900" 
					height="600"
					style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
				</canvas>
			</div>
		`;
	}

	private setupCanvas() {
		this.canvas = this.container.querySelector('#game-canvas') as HTMLCanvasElement;
		if (this.canvas) {
			this.context = this.canvas.getContext('2d');
			if (this.context) {
				// Disable anti-aliasing for pixel-perfect rendering
				this.context.imageSmoothingEnabled = false;
				this.drawInitialState();
			}
		}
	}

	private setupEventListeners() {
		window.addEventListener('keydown', this.movePlayer.bind(this));
		window.addEventListener('keyup', this.stopPlayer.bind(this));
	}

	private drawBackground() {
		if (!this.context) return;

		// Clear with black background
		this.context.fillStyle = "#000000";
		this.context.fillRect(0, 0, 900, 600);

		// Draw center line (dashed)
		this.context.fillStyle = "#FFFFFF";
		this.context.setLineDash([10, 10]);
		this.context.beginPath();
		this.context.moveTo(450, 0);
		this.context.lineTo(450, 600);
		this.context.strokeStyle = "#FFFFFF";
		this.context.lineWidth = 2;
		this.context.stroke();
		this.context.setLineDash([]);
	}

	// Fonction d'interpolation linéaire
	private lerp(start: number, end: number, factor: number): number {
		return start + (end - start) * factor;
	}

	private drawInitialState() {
		this.drawBackground();
		
		if (!this.context) return;
		
		// Draw paddles (white rectangles)
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1Rendered.x, this.p1Rendered.y, this.p1Rendered.width, this.p1Rendered.height);
		this.context.fillRect(this.p2Rendered.x, this.p2Rendered.y, this.p2Rendered.width, this.p2Rendered.height);
		
		// Draw ball (white square)
		this.context.fillRect(this.ballRendered.x, this.ballRendered.y, this.ballRendered.width, this.ballRendered.height);
		
		this.drawScore();
	}

	private update = () => {
		if (!this.canStart || !this.context) return;

		this.animationId = requestAnimationFrame(this.update);
		
		// Interpoler vers les positions cibles (smooth movement)
		this.p1Rendered.y = this.lerp(this.p1Rendered.y, this.p1.y, this.lerpFactor);
		this.p2Rendered.y = this.lerp(this.p2Rendered.y, this.p2.y, this.lerpFactor);
		
		// Interpoler la balle
		this.ballRendered.x = this.lerp(this.ballRendered.x, this.ball.x, this.lerpFactor);
		this.ballRendered.y = this.lerp(this.ballRendered.y, this.ball.y, this.lerpFactor);
		
		console.log("p1Rendered:", this.p1Rendered, "p2Rendered:", this.p2Rendered, "ballRendered:", this.ballRendered);
		console.log("p1 target:", this.p1, "p2 target:", this.p2, "ball target:", this.ball);
		// Draw background
		this.drawBackground();
		
		// Draw players and ball (white rectangles) avec les positions interpolées
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1Rendered.x, this.p1Rendered.y, this.p1Rendered.width, this.p1Rendered.height);
		this.context.fillRect(this.p2Rendered.x, this.p2Rendered.y, this.p2Rendered.width, this.p2Rendered.height);
		
		// Draw ball
		this.context.fillRect(this.ballRendered.x, this.ballRendered.y, this.ballRendered.width, this.ballRendered.height);
		
		this.drawScore();
	};

	private drawScore() {
		if (!this.context) return;
		
		this.context.fillStyle = "#FFFFFF";
		this.context.font = "bold 48px monospace";
		this.context.textAlign = "center";
		
		// Draw scores in classic Pong style
		this.context.fillText(this.p1Score.toString(), 300, 60);
		this.context.fillText(this.p2Score.toString(), 600, 60);
	}

	private movePlayer = (e: KeyboardEvent) => {
		// On ne prend que W, S, ArrowUp et ArrowDown
		if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
			ws?.send(JSON.stringify({ method: "move",type: "UP", key: e.code, roomId: localStorage.getItem('roomId'), clientId: localStorage.getItem('clientId')}));
		}
	};

	private stopPlayer = (e: KeyboardEvent) => {
		if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
			ws?.send(JSON.stringify({ method: "move",type: "DOWN", key: e.code, roomId: localStorage.getItem('roomId'), clientId: localStorage.getItem('clientId')}));
		}

	};

	private startGame() {
		if (!this.animationId) {
			this.update();
		}
	}

	private pauseGame() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
 }

	public destroy() {
		this.pauseGame();
		window.removeEventListener('keydown', this.movePlayer);
		window.removeEventListener('keyup', this.stopPlayer);
	}
}
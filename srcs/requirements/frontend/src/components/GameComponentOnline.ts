import { Player, Ball } from "../interface/gameInterface";
import { ws } from "../pages/GameRoom";

export class GameComponentOnline {
	private container: HTMLElement;                    // Conteneur DOM
	private canStart: boolean = false;                 // État du jeu (pause/play)
	private canvas: HTMLCanvasElement | null = null;   // Élément canvas
	private context: CanvasRenderingContext2D | null = null; // Context 2D
	private animationId: number | null = null;         // ID de l'animation

	// Joueur 1 (gauche)
	private p1: Player = {
		x: 20,      // 20px du bord gauche
		y: 260,     // Centre vertical
		width: 8,   // Raquette fine
		height: 80, // Assez haute
		vel_y: 0    // Immobile au départ
	};

	// Joueur 2 (droite)  
	private p2: Player = {
		x: 872,     // 572px = 900-20-8 (bord droit - marge - largeur)
		y: 260,     // Centre vertical
		width: 8,
		height: 80,
		vel_y: 0
	};

	// Balle
	private ball: Ball = {
		x: 450,     // Centre horizontal
		y: 300,     // Centre vertical
		width: 8,   // Carrée
		height: 8,
		vel_x: 6,   //3 Se déplace vers la droite
		vel_y: 4    //2 Se déplace vers le bas
	};

	private p1Score: number = 0;
	private p2Score: number = 0;

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
		if (!game) return;
		if (game.p1) Object.assign(this.p1, game.p1);
		if (game.p2) Object.assign(this.p2, game.p2);
		if (game.ball) Object.assign(this.ball, game.ball);
		if (typeof game.p1Score === "number") this.p1Score = game.p1Score;
		if (typeof game.p2Score === "number") this.p2Score = game.p2Score;
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

	private drawInitialState() {
		this.drawBackground();
		
		if (!this.context) return;
		
		// Draw paddles (white rectangles)
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
		this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
		
		// Draw ball (white square)
		this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
		
		this.drawScore();
	}

	private update = () => {
		if (!this.canStart || !this.context) return;

		
		this.animationId = requestAnimationFrame(this.update);
		
		// Draw background
		this.drawBackground();
		
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
		const speed = 4;
		
		if (e.code === "KeyW") {
			this.p1.vel_y = -speed;
			ws?.send(JSON.stringify({ type: "move", gameId: localStorage.getItem('gameId'), clientId: localStorage.getItem('clientId'), player: localStorage.getItem('playerNumber'), vel: -speed }));
		} else if (e.code === "KeyS") {
			this.p1.vel_y = speed;
			ws?.send(JSON.stringify({ type: "move", gameId: localStorage.getItem('gameId'), clientId: localStorage.getItem('clientId'), player: localStorage.getItem('playerNumber'), vel: speed }));
		}

		if (e.code === "ArrowUp") {
			this.p2.vel_y = -speed;
			ws?.send(JSON.stringify({ type: "move", gameId: localStorage.getItem('gameId'), clientId: localStorage.getItem('clientId'), player: localStorage.getItem('playerNumber'), vel: -speed }));
		} else if (e.code === "ArrowDown") {
			this.p2.vel_y = speed;
			ws?.send(JSON.stringify({ type: "move", gameId: localStorage.getItem('gameId'), clientId: localStorage.getItem('clientId'), player: localStorage.getItem('playerNumber'), vel: speed }));
		}
	};

	private stopPlayer = (e: KeyboardEvent) => {
		if (e.code === "KeyW" || e.code === "KeyS") {
			this.p1.vel_y = 0;
			ws?.send(JSON.stringify({ type: "move", gameId: localStorage.getItem('gameId'), clientId: localStorage.getItem('clientId'), player: localStorage.getItem('playerNumber'), vel: 0 }));
		}
		if (e.code === "ArrowUp" || e.code === "ArrowDown") {
			this.p2.vel_y = 0;
			ws?.send(JSON.stringify({ type: "move", gameId: localStorage.getItem('gameId'), clientId: localStorage.getItem('clientId'), player: localStorage.getItem('playerNumber'), vel: 0 }));
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
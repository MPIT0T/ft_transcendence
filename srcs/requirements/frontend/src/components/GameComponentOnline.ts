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
		if (!game) {
			console.log("No game state provided.");
			return;
		}
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

		// Clear background
		this.context.clearRect(0, 0, 900, 600);

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
		
		// Draw players and ball (white rectangles)
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
		this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
		
		// Draw ball
		this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
		
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

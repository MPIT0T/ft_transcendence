/**
 * @fileoverview Online multiplayer game component for Pong
 * Handles rendering and input for network-synchronized gameplay
 */

import { Player, Ball } from "../interface/gameInterface";

/**
 * Online Pong game component that synchronizes with a WebSocket server
 * Receives game state updates from server and sends player input
 */
export class GameComponentOnline {
	/** Container element for the game canvas */
	private container: HTMLElement;
	/** Flag indicating if the game can start */
	private canStart: boolean = false;
	/** Canvas element for rendering */
	private canvas: HTMLCanvasElement | null = null;
	/** 2D rendering context */
	private context: CanvasRenderingContext2D | null = null;
	/** Current animation frame ID */
	private animationId: number | null = null;
	/** WebSocket connection for multiplayer */
	private ws: WebSocket | undefined;
	/** WebSocket method name for move commands */
	private moveMethod: string = 'move';

	/** Callback fired when score changes */
	private onScoreChange?: (p1: number, p2: number) => void;

	/** Player 1 (left) paddle state */
	private p1: Player = {
		x: 20,
		y: 260,
		width: 8,
		height: 80,
		vel_y: 0
	};

	/** Player 2 (right) paddle state */
	private p2: Player = {
		x: 872,
		y: 260,
		width: 8,
		height: 80,
		vel_y: 0
	};

	/** Ball state */
	private ball: Ball = {
		x: 446,
		y: 296,
		width: 8,
		height: 8,
		vel_x: 6,
		vel_y: 4
	};

	/** Player 1 current score */
	private p1Score: number = 0;
	/** Player 2 current score */
	private p2Score: number = 0;

	/**
	 * Creates a new online game component
	 * @param container - DOM element to render the game into
	 * @param initialCanStart - Whether the game can start immediately
	 * @param onScoreChange - Callback fired when score changes
	 * @param websocket - WebSocket connection for multiplayer communication
	 * @param moveMethod - WebSocket method name for move commands
	 */
	constructor(
    container: HTMLElement,
    initialCanStart: boolean = false,
    onScoreChange?: (p1: number, p2: number) => void,
    websocket?: WebSocket,
    moveMethod: string = 'move'
  ) {
		this.container = container;
		this.canStart = initialCanStart;
    this.onScoreChange = onScoreChange;
    this.ws = websocket;
    this.moveMethod = moveMethod;
		this.render();
		this.setupCanvas();
		this.setupEventListeners();
    this.onScoreChange?.(this.p1Score, this.p2Score);
	}

	/**
	 * Sets whether the game can start and controls game loop
	 * @param canStart - True to start the game, false to pause
	 */
	setCanStart(canStart: boolean) {
		this.canStart = canStart;
		if (this.canStart) {
			this.startGame();
		} else {
			this.pauseGame();
		}
	}

	/**
	 * Updates the local game state from server data
	 * @param game - Game state object from server containing player positions, ball, and scores
	 */
	updateGameState(game: any){
		if (!game) {
			return;
		}
		if (game.player1) {
			this.p1.y = game.player1.y;
		}
		if (game.player2) {
			this.p2.y = game.player2.y;
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
      this.onScoreChange?.(this.p1Score, this.p2Score);
		}
		if (typeof game.p2Score === "number") {
			this.p2Score = game.p2Score;
      this.onScoreChange?.(this.p1Score, this.p2Score);
		}
		if (!this.canStart) {
			this.drawInitialState();
		}
	}

	/** Renders the canvas HTML into the container */
	private render() {
		this.container.innerHTML = `
			<div class="w-full flex justify-center">
				<canvas 
					id="game-canvas" 
					class="border border-gray-50 bg-transparent backdrop-blur-2xs"
					width="900" 
					height="600">
				</canvas>
			</div>
		`;
	}

	/** Sets up the canvas element and 2D context */
	private setupCanvas() {
		this.canvas = this.container.querySelector('#game-canvas') as HTMLCanvasElement;
		if (this.canvas) {
			this.context = this.canvas.getContext('2d');
			if (this.context) {
				this.context.imageSmoothingEnabled = false;
				this.drawInitialState();
			}
		}
	}

	/** Attaches keyboard event listeners for player input */
	private setupEventListeners() {
		window.addEventListener('keydown', this.movePlayer.bind(this));
		window.addEventListener('keyup', this.stopPlayer.bind(this));
	}

	/** Clears canvas and draws the center line */
	private drawBackground() {
		if (!this.context) return;

		this.context.clearRect(0, 0, 900, 600);

		this.context.fillStyle = "#dbdbdb";
		this.context.setLineDash([10, 10]);
		this.context.beginPath();
		this.context.moveTo(450, 0);
		this.context.lineTo(450, 600);
		this.context.strokeStyle = "#dbdbdb";
		this.context.lineWidth = 2;
		this.context.stroke();
		this.context.setLineDash([]);
	}

	/** Draws the initial game state with paddles and ball */
	private drawInitialState() {
		this.drawBackground();
		
		if (!this.context) return;
		
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
		this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
		
		this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);		
	}

	/** Main game loop - renders current game state */
	private update = () => {
		if (!this.canStart || !this.context) return;

		
		this.animationId = requestAnimationFrame(this.update);
		
		this.drawBackground();
		
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
		this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
		
		this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
		
		this.onScoreChange?.(this.p1Score, this.p2Score);
	};

	/** Draws the current score on the canvas */
	private drawScore() {
		if (!this.context) return;
		
		this.context.fillStyle = "#FFFFFF";
		this.context.font = "bold 48px monospace";
		this.context.textAlign = "center";
		
		this.context.fillText(this.p1Score.toString(), 300, 60);
		this.context.fillText(this.p2Score.toString(), 600, 60);
	}

	/**
	 * Handles keydown events to send move commands to server
	 * @param e - Keyboard event
	 */
	private movePlayer = (e: KeyboardEvent) => {
		if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
			const roomId = sessionStorage.getItem('roomId');
			const clientId = sessionStorage.getItem('clientId');
			this.ws?.send(JSON.stringify({ method: this.moveMethod, type: "UP", key: e.code, roomId: roomId, clientId: clientId}));
		}
	};

	/**
	 * Handles keyup events to send stop commands to server
	 * @param e - Keyboard event
	 */
	private stopPlayer = (e: KeyboardEvent) => {
		if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
			const roomId = sessionStorage.getItem('roomId');
			const clientId = sessionStorage.getItem('clientId');
			this.ws?.send(JSON.stringify({ method: this.moveMethod, type: "DOWN", key: e.code, roomId: roomId, clientId: clientId}));
		}

	};


	/** Starts the game loop */
	private startGame() {
		if (!this.animationId) {
			this.update();
		}
	}

	/** Pauses the game loop */
	private pauseGame() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
  }

	/** Cleans up the component and removes event listeners */
	public destroy() {
		this.pauseGame();
		window.removeEventListener('keydown', this.movePlayer);
		window.removeEventListener('keyup', this.stopPlayer);
	}

	/**
	 * Gets both players' current scores
	 * @returns Object containing p1Score and p2Score
	 */
  public getScores() {
    return { p1Score: this.p1Score, p2Score: this.p2Score };
  }
}
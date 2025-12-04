import { Player, Ball } from "../interface/gameInterface";

export class GameComponentOnline {
	private container: HTMLElement;
	private canStart: boolean = false;
	private canvas: HTMLCanvasElement | null = null;
	private context: CanvasRenderingContext2D | null = null;
	private animationId: number | null = null;
	private ws: WebSocket | undefined;
	private moveMethod: string = 'move';

  private onScoreChange?: (p1: number, p2: number) => void;

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
		x: 446,
		y: 296,
		width: 8,
		height: 8,
		vel_x: 6,
		vel_y: 4
	};

	private p1Score: number = 0;
	private p2Score: number = 0;

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

	private setupEventListeners() {
		window.addEventListener('keydown', this.movePlayer.bind(this));
		window.addEventListener('keyup', this.stopPlayer.bind(this));
	}

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

	private drawInitialState() {
		this.drawBackground();
		
		if (!this.context) return;
		
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
		this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
		
		this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);		
	}

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

	private drawScore() {
		if (!this.context) return;
		
		this.context.fillStyle = "#FFFFFF";
		this.context.font = "bold 48px monospace";
		this.context.textAlign = "center";
		
		this.context.fillText(this.p1Score.toString(), 300, 60);
		this.context.fillText(this.p2Score.toString(), 600, 60);
	}

	private movePlayer = (e: KeyboardEvent) => {
		if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
			const roomId = sessionStorage.getItem('roomId');
			const clientId = sessionStorage.getItem('clientId');
			this.ws?.send(JSON.stringify({ method: this.moveMethod, type: "UP", key: e.code, roomId: roomId, clientId: clientId}));
		}
	};

	private stopPlayer = (e: KeyboardEvent) => {
		if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
			const roomId = sessionStorage.getItem('roomId');
			const clientId = sessionStorage.getItem('clientId');
			this.ws?.send(JSON.stringify({ method: this.moveMethod, type: "DOWN", key: e.code, roomId: roomId, clientId: clientId}));
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

  public getScores() {
    return { p1Score: this.p1Score, p2Score: this.p2Score };
  }
}
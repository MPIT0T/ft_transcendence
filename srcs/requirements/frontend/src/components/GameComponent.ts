import { Player } from './Player';
import { Ball } from './Ball';

export class GameComponent {
  private container: HTMLElement;
  private canStart: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private isPaused: boolean = false;

  private onScoreChange?: (p1: number, p2: number) => void;
  private onGoal?: (state: boolean) => void;

  private readonly CANVAS_WIDTH = 900;
  private readonly CANVAS_HEIGHT = 600;
  private readonly TICK_RATE = 60;
  private readonly TICK_INTERVAL = 1000 / this.TICK_RATE;

  private p1: Player = new Player(1);
  private p2: Player = new Player(2);
  private ball: Ball = new Ball();

  private p1Score: number = 0;
  private p2Score: number = 0;
  private lastTime: number = 0;

  constructor(
    container: HTMLElement,
    initialCanStart: boolean = false,
    onScoreChange?: (p1: number, p2: number) => void,
    onGoal?: (state: boolean) => void,
  ) {
    this.container = container;
    this.canStart = initialCanStart;
    this.onScoreChange = onScoreChange;
    this.onGoal = onGoal;
    this.render();     
    this.setupCanvas();
    this.setupEventListeners();
    this.onScoreChange?.(this.p1Score, this.p2Score);
    this.onGoal?.(false);
  }

  setCanStart(canStart: boolean) {
    this.canStart = canStart;
    if (this.canStart) {
      this.startGame()
    } else {
      this.pauseGame();
    }
  }

  private render() {
    this.container.innerHTML = `
      <div class="w-full flex justify-center">
        <canvas 
          id="game-canvas" 
          class="backdrop-blur-2xs border border-gray-50"
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
    this.context.lineWidth = 1;
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
    
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (!this.isPaused) {
      this.updateGamePhysics();
    }
    
    this.drawGame();
    
    this.lastTime = currentTime;
  };

  private updateGamePhysics(): void {
    this.p1.updatePosition(this.CANVAS_HEIGHT);
    this.p2.updatePosition(this.CANVAS_HEIGHT);

    this.ball.updatePosition();

    this.ball.checkWallCollision(this.CANVAS_HEIGHT);

    this.ball.checkPaddleCollision(this.p1);
    this.ball.checkPaddleCollision(this.p2);

    const scorer = this.ball.checkScoring(this.CANVAS_WIDTH);
    if (scorer === 1) {
      this.p1Score++;
      this.ball.reset(1);
      this.p1.reset();
      this.p2.reset();
      this.onScoreChange?.(this.p1Score, this.p2Score);
      this.onGoal?.(true);
      
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
      }, 3000);
    } else if (scorer === 2) {
      this.p2Score++;
      this.ball.reset(-1);
      this.p1.reset();
      this.p2.reset();
      this.onScoreChange?.(this.p1Score, this.p2Score);
      this.onGoal?.(true);
      
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
      }, 3000);
    }
  }

  private drawGame(): void {
    if (!this.context) return;
    
    this.drawBackground();
    
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
    this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
    
    this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    
  }

  private drawScore() {
    if (!this.context) return;
    
    this.context.fillStyle = "#FFFFFF";
    this.context.font = "bold 48px monospace";
    this.context.textAlign = "center";
    
    this.context.fillText(this.p1Score.toString(), 300, 60);
    this.context.fillText(this.p2Score.toString(), 600, 60);
  }

  private movePlayer = (e: KeyboardEvent) => {
    const speed = 8;
    
    if (e.code === "KeyW") {
      this.p1.setVelocity(-speed);
    } else if (e.code === "KeyS") {
      this.p1.setVelocity(speed);
    }
    
    if (e.code === "ArrowUp") {
      this.p2.setVelocity(-speed);
    } else if (e.code === "ArrowDown") {
      this.p2.setVelocity(speed);
    }
  };

  private stopPlayer = (e: KeyboardEvent) => {
    if (e.code === "KeyW" || e.code === "KeyS") {
      this.p1.setVelocity(0);
    }
    if (e.code === "ArrowUp" || e.code === "ArrowDown") {
      this.p2.setVelocity(0);
    }
  };

  private startGame() {
    if (!this.animationId) {
      this.lastTime = Date.now();
      this.update();
    }
  }

  private pauseGame() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
 }

  public restart() {
    this.pauseGame();
    
    this.p1Score = 0;
    this.p2Score = 0;
    
    this.p1.reset();
    this.p2.reset();
    this.ball.reset(1);
    
    this.drawInitialState();

    this.onScoreChange?.(this.p1Score, this.p2Score);
  }

  public destroy() {
    this.pauseGame();
    window.removeEventListener('keydown', this.movePlayer);
    window.removeEventListener('keyup', this.stopPlayer);
  }

  public getScoreP1(): number {
    return this.p1Score;
  }

  public getScoreP2(): number {
    return this.p2Score;
  }
}

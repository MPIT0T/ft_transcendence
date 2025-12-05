/**
 * @fileoverview Local game component for the Pong game
 * Handles local 2-player gameplay with keyboard controls
 */

import { Player } from './Player';
import { Ball } from './Ball';

/**
 * LocalGame component for local 2-player Pong
 * Manages game loop, physics, rendering, and input handling
 */
export class GameComponent {
  /** Container element for the game canvas */
  private container: HTMLElement;
  /** Whether the game can start */
  private canStart: boolean = false;
  /** Canvas element for rendering */
  private canvas: HTMLCanvasElement | null = null;
  /** 2D rendering context */
  private context: CanvasRenderingContext2D | null = null;
  /** Animation frame ID for the game loop */
  private animationId: number | null = null;
  /** Whether the game is currently paused */
  private isPaused: boolean = false;

  /** Callback fired when score changes */
  private onScoreChange?: (p1: number, p2: number) => void;
  /** Callback fired when a goal is scored */
  private onGoal?: (state: boolean) => void;

  /** Canvas width in pixels */
  private readonly CANVAS_WIDTH = 900;
  /** Canvas height in pixels */
  private readonly CANVAS_HEIGHT = 600;
  /** Target frame rate */
  private readonly TICK_RATE = 60;
  /** Time between frames in ms */
  private readonly TICK_INTERVAL = 1000 / this.TICK_RATE;

  /** Player 1 paddle (left side) */
  private p1: Player = new Player(1);
  /** Player 2 paddle (right side) */
  private p2: Player = new Player(2);
  /** LocalGame ball */
  private ball: Ball = new Ball();

  /** Player 1 score */
  private p1Score: number = 0;
  /** Player 2 score */
  private p2Score: number = 0;
  /** Last frame timestamp */
  private lastTime: number = 0;

  /**
   * Creates a new local game component
   * @param container - DOM element to render the game into
   * @param initialCanStart - Whether game should start immediately
   * @param onScoreChange - Callback when score changes
   * @param onGoal - Callback when a goal is scored
   */
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

  /**
   * Sets whether the game can start or should pause
   * @param canStart - True to start/resume, false to pause
   */
  setCanStart(canStart: boolean) {
    this.canStart = canStart;
    if (this.canStart) {
      this.startGame()
    } else {
      this.pauseGame();
    }
  }

  /** Renders the game canvas HTML */
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

  /** Initializes the canvas and 2D context */
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

  /** Sets up keyboard event listeners for player controls */
  private setupEventListeners() {
    window.addEventListener('keydown', this.movePlayer.bind(this));
    window.addEventListener('keyup', this.stopPlayer.bind(this));
  }

  /** Draws the game background with center line */
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

  /** Draws the initial game state (paddles and ball at starting positions) */
  private drawInitialState() {
    this.drawBackground();
    
    if (!this.context) return;
    
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
    this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
    
    this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    
  }

  /** Main game loop - updates physics and renders each frame */
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

  /** Updates all game physics (paddle positions, ball movement, collisions) */
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

  /** Renders the current game state (paddles, ball) */
  private drawGame(): void {
    if (!this.context) return;
    
    this.drawBackground();
    
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
    this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
    
    this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    
  }

  /** Draws the score on the canvas (currently unused) */
  private drawScore() {
    if (!this.context) return;
    
    this.context.fillStyle = "#FFFFFF";
    this.context.font = "bold 48px monospace";
    this.context.textAlign = "center";
    
    this.context.fillText(this.p1Score.toString(), 300, 60);
    this.context.fillText(this.p2Score.toString(), 600, 60);
  }

  /**
   * Handles keydown events for player movement
   * P1: W/S keys, P2: Arrow Up/Down
   */
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

  /** Handles keyup events to stop player movement */
  private stopPlayer = (e: KeyboardEvent) => {
    if (e.code === "KeyW" || e.code === "KeyS") {
      this.p1.setVelocity(0);
    }
    if (e.code === "ArrowUp" || e.code === "ArrowDown") {
      this.p2.setVelocity(0);
    }
  };

  /** Starts the game loop */
  private startGame() {
    if (!this.animationId) {
      this.lastTime = Date.now();
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

  /** Restarts the game with initial scores and positions */
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

  /** Cleans up the game component and removes event listeners */
  public destroy() {
    this.pauseGame();
    window.removeEventListener('keydown', this.movePlayer);
    window.removeEventListener('keyup', this.stopPlayer);
  }

  /**
   * Gets player 1's current score
   * @returns Player 1 score
   */
  public getScoreP1(): number {
    return this.p1Score;
  }

  /**
   * Gets player 2's current score
   * @returns Player 2 score
   */
  public getScoreP2(): number {
    return this.p2Score;
  }
}

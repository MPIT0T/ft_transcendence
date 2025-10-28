import { Player } from './Player';
import { Ball } from './Ball';

export class GameComponent {
  private container: HTMLElement;
  private canStart: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private isPaused: boolean = false; // Pour gérer les pauses entre les buts

  // Constantes du jeu (identiques au serveur)
  private readonly CANVAS_WIDTH = 900;
  private readonly CANVAS_HEIGHT = 600;
  private readonly TICK_RATE = 60;
  private readonly TICK_INTERVAL = 1000 / this.TICK_RATE;

  // Utilisation des classes Player et Ball
  private p1: Player = new Player(1);
  private p2: Player = new Player(2);
  private ball: Ball = new Ball();

  private p1Score: number = 0;
  private p2Score: number = 0;
  private lastTime: number = 0;

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
      // Pause de 3 secondes avant de commencer le match
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
        this.startGame();
      }, 3000);
    } else {
      this.pauseGame();
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
    
    // Calculer le delta time (comme le serveur)
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    
    // Mettre à jour la physique du jeu seulement si pas en pause
    if (!this.isPaused) {
      this.updateGamePhysics();
    }
    
    // Dessiner l'état actuel (même pendant la pause)
    this.drawGame();
    
    this.lastTime = currentTime;
  };

  private updateGamePhysics(): void {
    // 1. Mettre à jour les positions des joueurs
    this.p1.updatePosition(this.CANVAS_HEIGHT);
    this.p2.updatePosition(this.CANVAS_HEIGHT);

    // 2. Mettre à jour la position de la balle
    this.ball.updatePosition();

    // 3. Vérifier les collisions avec les murs
    this.ball.checkWallCollision(this.CANVAS_HEIGHT);

    // 4. Vérifier les collisions avec les raquettes
    this.ball.checkPaddleCollision(this.p1);
    this.ball.checkPaddleCollision(this.p2);

    // 5. Vérifier les points marqués
    const scorer = this.ball.checkScoring(this.CANVAS_WIDTH);
    if (scorer === 1) {
      this.p1Score++;
      this.ball.reset(1);
      this.p1.reset();
      this.p2.reset();
      
      // Pause de 3 secondes après un but
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
      }, 3000);
    } else if (scorer === 2) {
      this.p2Score++;
      this.ball.reset(-1);
      this.p1.reset();
      this.p2.reset();
      
      // Pause de 3 secondes après un but
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
      }, 3000);
    }
  }

  private drawGame(): void {
    if (!this.context) return;
    
    // Dessiner le fond
    this.drawBackground();
    
    // Dessiner les joueurs
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
    this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
    
    // Dessiner la balle
    this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    
    // Dessiner le score
    this.drawScore();
  }

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
    // Pause the game
    this.pauseGame();
    
    // Reset scores
    this.p1Score = 0;
    this.p2Score = 0;
    
    // Reset players and ball
    this.p1.reset();
    this.p2.reset();
    this.ball.reset(1);
    
    // Redraw initial state
    this.drawInitialState();
  }

  public destroy() {
    this.pauseGame();
    window.removeEventListener('keydown', this.movePlayer);
    window.removeEventListener('keyup', this.stopPlayer);
  }
}
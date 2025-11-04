import { Player, Ball } from "../interface/gameInterface";

export class GameComponent {
  private container: HTMLElement;                    // Conteneur DOM
  private canStart: boolean = false;                 // État du jeu (pause/play)
  private canvas: HTMLCanvasElement | null = null;   // Élément canvas
  private context: CanvasRenderingContext2D | null = null; // Context 2D
  private animationId: number | null = null;         // ID de l'animation

  private onScoreChange?: (p1: number, p2: number) => void;

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
    vel_x: 5,   //3 Se déplace vers la droite
    vel_y: 4    //2 Se déplace vers le bas
  };

  private p1Score: number = 0;
  private p2Score: number = 0;

  constructor(
    container: HTMLElement,
    initialCanStart: boolean = false,
    onScoreChange?: (p1: number, p2: number) => void
  ) {
    this.container = container;
    this.canStart = initialCanStart;
    this.onScoreChange = onScoreChange;
    this.render();              // Crée le HTML
    this.setupCanvas();         // Configure le canvas
    this.setupEventListeners(); // Ajoute les contrôles clavier
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

  private render() {
    this.container.innerHTML = `
      <div class="w-full flex justify-center">
        <canvas 
          id="game-canvas" 
          class="backdrop-blur-2xs border-1 border-gray-50"
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
    this.context.clearRect(0, 0, 900, 600);
    
    // Draw center line (dashed)
    this.context.fillStyle = "#EEEEEE";
    this.context.setLineDash([10, 10]);
    this.context.beginPath();
    this.context.moveTo(450, 0);
    this.context.lineTo(450, 600);
    this.context.strokeStyle = "#FFFFFF";
    this.context.lineWidth = 1;
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
    
    // this.drawScore();
  }

  private update = () => {
    if (!this.canStart || !this.context) return;


    this.animationId = requestAnimationFrame(this.update);

    // Draw background
    this.drawBackground();

    // Update player 1
    this.context.fillStyle = "#FFFFFF";
    let newP1_y = this.p1.y + this.p1.vel_y;
    if (!this.playerOutOfBound(newP1_y)) {
      this.p1.y = newP1_y;
    }
    this.context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);

    // Update player 2
    let newP2_y = this.p2.y + this.p2.vel_y;
    if (!this.playerOutOfBound(newP2_y)) {
      this.p2.y = newP2_y;
    }
    this.context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);

    // Update ball
    this.ball.vel_x = this.ball.vel_x*1.004;
    this.ball.vel_y = this.ball.vel_y*1.004;
    this.ball.x += this.ball.vel_x;
    this.ball.y += this.ball.vel_y;
    this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);

    // Ball collision with top/bottom walls
    if (this.ball.y <= 0 || (this.ball.y + this.ball.height >= 600)) {
      this.ball.vel_y *= -1;
    }

    // Ball collision with paddles
    if (this.detectCollision(this.ball, this.p1)) {
      if (this.ball.vel_x < 0) { // Only bounce if moving towards paddle
        this.ball.vel_x *= -1;
        // Add some spin based on where it hits the paddle
        const hitPos = (this.ball.y - this.p1.y) / this.p1.height;
        this.ball.vel_y = (hitPos - 0.5) * 4;
      }
    } else if (this.detectCollision(this.ball, this.p2)) {
      if (this.ball.vel_x > 0) { // Only bounce if moving towards paddle
        this.ball.vel_x *= -1;
        // Add some spin based on where it hits the paddle
        const hitPos = (this.ball.y - this.p2.y) / this.p2.height;
        this.ball.vel_y = (hitPos - 0.5) * 4;
      }
    }

    // Score detection
    if (this.ball.x < 0) {
      this.p2Score++;
      this.resetGame(1);
      this.onScoreChange?.(this.p1Score, this.p2Score);
    } else if (this.ball.x + this.ball.width > 900) {
      this.p1Score++;
      this.resetGame(-1);
      this.onScoreChange?.(this.p1Score, this.p2Score);
    }
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
    const speed = 8;
    
    if (e.code === "KeyW") {
      this.p1.vel_y = -speed;
    } else if (e.code === "KeyS") {
      this.p1.vel_y = speed;
    }
    
    if (e.code === "ArrowUp") {
      this.p2.vel_y = -speed;
    } else if (e.code === "ArrowDown") {
      this.p2.vel_y = speed;
    }
  };

  private stopPlayer = (e: KeyboardEvent) => {
    if (e.code === "KeyW" || e.code === "KeyS") {
      this.p1.vel_y = 0;
    }
    if (e.code === "ArrowUp" || e.code === "ArrowDown") {
      this.p2.vel_y = 0;
    }
  };

  private detectCollision(ball: Ball, player: Player): boolean {
    return ball.x < player.x + player.width &&
           ball.x + ball.width > player.x &&
           ball.y < player.y + player.height &&
           ball.y + ball.height > player.y;
  }

  private playerOutOfBound(ypos: number): boolean {
    return ypos < 0 || ypos > (600 - 80); // 600 = canvas height, 80 = paddle height
  }

  private resetGame(direction: number) {
    this.ball = {
      x: 450,
      y: 300,
      width: 8,
      height: 8,
      vel_x: direction * 5,
      vel_y: (Math.random() - 0.5) * 6
    };
    
    this.p1.y = 260;
    this.p2.y = 260;
    this.p1.vel_y = 0;
    this.p2.vel_y = 0;
  }

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

  public restart() {
    // Pause the game
    this.pauseGame();
    
    // Reset scores
    this.p1Score = 0;
    this.p2Score = 0;
    
    // Reset game state
    this.resetGame(1);
    
    // Redraw initial state
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

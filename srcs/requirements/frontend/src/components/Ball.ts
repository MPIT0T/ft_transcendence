import { Player } from './Player';

export class Ball {
    x: number;
    y: number;
    width: number = 8;
    height: number = 8;
    vel_x: number;
    vel_y: number;

    constructor() {
        this.x = 446;
        this.y = 296;
        this.vel_x = 5;
        this.vel_y = 0;
        this.reset(1);
    }

    reset(direction: number = 1): void {
        this.x = 450;
        this.y = 300;
        this.vel_x = direction * 5;
        this.vel_y = (Math.random() - 0.5) * 6;
    }

    updatePosition(): void {
        const maxSpeed = 15;
        this.vel_x = Math.min(Math.abs(this.vel_x * 1.004), maxSpeed) * Math.sign(this.vel_x);
        this.vel_y = Math.min(Math.abs(this.vel_y * 1.004), maxSpeed) * Math.sign(this.vel_y);
        
        this.x += this.vel_x;
        this.y += this.vel_y;
    }

    checkWallCollision(canvasHeight: number = 600): void {
        if (this.y <= 0) {
            this.y = 0;
            this.vel_y *= -1;
        } else if (this.y + this.height >= canvasHeight) {
            this.y = canvasHeight - this.height;
            this.vel_y *= -1;
        }
    }

    checkPaddleCollision(player: Player): void {
        const collision = (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );

        if (collision) {
            if (player.playerNumber === 1 && this.vel_x < 0) {
                this.handlePaddleHit(player);
            } else if (player.playerNumber === 2 && this.vel_x > 0) {
                this.handlePaddleHit(player);
            }
        }
    }

    handlePaddleHit(player: Player): void {
        this.vel_x *= -1;
        
        const hitPosition = (this.y + this.height / 2 - player.y) / player.height;
        const spinFactor = (hitPosition - 0.5) * 8;
        this.vel_y = spinFactor;
        
        if (player.playerNumber === 1) {
            this.x = player.x + player.width;
        } else {
            this.x = player.x - this.width;
        }
    }

    checkScoring(canvasWidth: number = 900): number {
        if (this.x < 0) {
            return 2;
        } else if (this.x + this.width > canvasWidth) {
            return 1;
        }
        return 0;
    }
}

/**
 * @fileoverview Ball component for the Pong game
 */

import { Player } from './Player';

/**
 * Represents the ball in the Pong game
 * Handles movement, collisions, and scoring detection
 */
export class Ball {
    /** X position on canvas */
    x: number;
    /** Y position on canvas */
    y: number;
    /** Ball width in pixels */
    width: number = 8;
    /** Ball height in pixels */
    height: number = 8;
    /** Horizontal velocity */
    vel_x: number;
    /** Vertical velocity */
    vel_y: number;

    /**
     * Creates a new ball at center position
     */
    constructor() {
        this.x = 446;
        this.y = 296;
        this.vel_x = 5;
        this.vel_y = 0;
        this.reset(1);
    }

    /**
     * Resets ball to center with random vertical direction
     * @param direction - Horizontal direction (1 = right, -1 = left)
     */
    reset(direction: number = 1): void {
        this.x = 450;
        this.y = 300;
        this.vel_x = direction * 5;
        this.vel_y = (Math.random() - 0.5) * 6;
    }

    /**
     * Updates ball position and applies speed acceleration
     * Speed gradually increases up to maxSpeed
     */
    updatePosition(): void {
        const maxSpeed = 15;
        this.vel_x = Math.min(Math.abs(this.vel_x * 1.004), maxSpeed) * Math.sign(this.vel_x);
        this.vel_y = Math.min(Math.abs(this.vel_y * 1.004), maxSpeed) * Math.sign(this.vel_y);
        
        this.x += this.vel_x;
        this.y += this.vel_y;
    }

    /**
     * Checks and handles collision with top/bottom walls
     * @param canvasHeight - Height of the game canvas (default: 600)
     */
    checkWallCollision(canvasHeight: number = 600): void {
        if (this.y <= 0) {
            this.y = 0;
            this.vel_y *= -1;
        } else if (this.y + this.height >= canvasHeight) {
            this.y = canvasHeight - this.height;
            this.vel_y *= -1;
        }
    }

    /**
     * Checks for collision with a player's paddle
     * @param player - The player paddle to check collision against
     */
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

    /**
     * Handles ball bounce off paddle with spin effect
     * @param player - The player paddle that was hit
     */
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

    /**
     * Checks if ball has passed a paddle (scoring event)
     * @param canvasWidth - Width of the game canvas (default: 900)
     * @returns Player number who scored (1 or 2), or 0 if no score
     */
    checkScoring(canvasWidth: number = 900): number {
        if (this.x < 0) {
            return 2;
        } else if (this.x + this.width > canvasWidth) {
            return 1;
        }
        return 0;
    }
}

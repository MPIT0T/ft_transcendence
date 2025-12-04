/**
 * @fileoverview Player paddle component for the Pong game
 */

/**
 * Represents a player's paddle in the game
 * Handles position, movement, and collision boundaries
 */
export class Player {
    /** Player identifier (1 for left, 2 for right) */
    playerNumber: number;
    /** X position on canvas */
    x: number;
    /** Y position on canvas */
    y: number;
    /** Paddle width in pixels */
    width: number = 8;
    /** Paddle height in pixels */
    height: number = 80;
    /** Vertical velocity */
    vel_y: number = 0;

    /**
     * Creates a new player paddle
     * @param playerNumber - Player identifier (1 = left, 2 = right)
     */
    constructor(playerNumber: number) {
        this.playerNumber = playerNumber;
        
        if (playerNumber === 1) {
            this.x = 20;
            this.y = 260;
        } else {
            this.x = 872;
            this.y = 260;
        }
    }

    /**
     * Updates paddle position based on current velocity
     * Ensures paddle stays within canvas bounds
     * @param canvasHeight - Height of the game canvas (default: 600)
     */
    updatePosition(canvasHeight: number = 600): void {
        const newY = this.y + this.vel_y;
        
        if (newY >= 0 && newY <= canvasHeight - this.height) {
            this.y = newY;
        }
    }

    /**
     * Sets the paddle's vertical velocity
     * @param vel - New velocity value (positive = down, negative = up)
     */
    setVelocity(vel: number): void {
        this.vel_y = vel;
    }

    /**
     * Resets paddle to initial center position
     */
    reset(): void {
        this.y = 260;
        this.vel_y = 0;
    }
}

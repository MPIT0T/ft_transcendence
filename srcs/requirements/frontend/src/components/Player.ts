export class Player {
    playerNumber: number;
    x: number;
    y: number;
    width: number = 8;
    height: number = 80;
    vel_y: number = 0;

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

    updatePosition(canvasHeight: number = 600): void {
        const newY = this.y + this.vel_y;
        
        if (newY >= 0 && newY <= canvasHeight - this.height) {
            this.y = newY;
        }
    }

    setVelocity(vel: number): void {
        this.vel_y = vel;
    }

    reset(): void {
        this.y = 260;
        this.vel_y = 0;
    }
}

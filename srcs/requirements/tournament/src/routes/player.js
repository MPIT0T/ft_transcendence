class Player {
	constructor(playerNumber) {
        this.playerNumber = playerNumber;
        this.width = 8;
        this.height = 80;
        this.vel_y = 0;
        
        if (playerNumber === 1) {
            this.x = 20;
            this.y = 260;
        } else {
            this.x = 872;
            this.y = 260;
        }
	}

	updatePosition(canvasHeight = 600) {
        const newY = this.y + this.vel_y;
        
        if (newY >= 0 && newY <= canvasHeight - this.height) {
            this.y = newY;
        }
    }

	setVelocity(vel) {
        this.vel_y = vel;
    }

    reset() {
        this.y = 260;
        this.vel_y = 0;
    }

	toJSON() {
		return {
			playerNumber: this.playerNumber,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			vel_y: this.vel_y
		};
	}

    toJsonMove() {
		return {
			y: this.y,
		};
	}
}

module.exports = Player;
class Ball {
	constructor() {
        this.width = 8;
        this.height = 8;
        this.reset(1);
    }

    reset(direction = 1) {
        this.x = 450;
        this.y = 300;
        this.vel_x = direction * 5;
        this.vel_y = (Math.random() - 0.5) * 6;
    }

	updatePosition() {
        const maxSpeed = 15;
        this.vel_x = Math.min(Math.abs(this.vel_x * 1.004), maxSpeed) * Math.sign(this.vel_x);
        this.vel_y = Math.min(Math.abs(this.vel_y * 1.004), maxSpeed) * Math.sign(this.vel_y);
        
        this.x += this.vel_x;
        this.y += this.vel_y;
    }

	checkWallCollision(canvasHeight = 600) {
        if (this.y <= 0) {
            this.y = 0;
            this.vel_y *= -1;
        } else if (this.y + this.height >= canvasHeight) {
            this.y = canvasHeight - this.height;
            this.vel_y *= -1;
        }
    }

	checkPaddleCollision(player) {
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

	handlePaddleHit(player) {
        this.vel_x *= -1;
        
        const hitPosition = (this.y + this.height / 2 - player.y) / player.height;
        const spinFactor = (hitPosition - 0.5) * 8; // -4 à +4
        this.vel_y = spinFactor;
        
        if (player.playerNumber === 1) {
            this.x = player.x + player.width;
        } else {
            this.x = player.x - this.width;
        }
    }

    checkScoring(canvasWidth = 900) {
        if (this.x < 0) {
            return 2; // Joueur 2 marque
        } else if (this.x + this.width > canvasWidth) {
            return 1; // Joueur 1 marque
        }
        return 0; // Pas de score
    }

	toJSON() {
		return {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
				vel_x: this.vel_x,
				vel_y: this.vel_y
		};
		}
}


module.exports = Ball;
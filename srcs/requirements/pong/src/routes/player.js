class Player {
    constructor(player) {
        if (player === 1) {
            this._x = 20;
            this._y = 260;
            this._width = 10;
            this._height = 100;
            this._vel_y = 0;
        } else if (player === 2) {
            this._x = 872;
            this._y = 260;
            this._width = 8;
            this._height = 80;
            this._vel_y = 0;
        }
    }


    // Convert to JSON
    toJSON() {
        return {
        player: {
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            vel_y: this._vel_y
        }
        };
    }
}

module.exports = Player;
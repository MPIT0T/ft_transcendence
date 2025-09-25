class Player {
    constructor({player} = {}) {
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

    // Getters
    get x() { return this._x; }
    get y() { return this._y; }
    get width() { return this._width; }
    get height() { return this._height; }
    get vel_y() { return this._vel_y; }

    // Setters
    set set_yx(value) { this._x = value; }
    set set_yy(value) { this._y = value; }
    set set_ywidth(value) { this._width = value; }
    set set_yheight(value) { this._height = value; }
    set set_yvel_y(value) { this._vel_y = value; }

    // Convert to JSON
    toJSON() {
        return {
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            vel_y: this._vel_y
        };
    }
}

module.exports = Player;
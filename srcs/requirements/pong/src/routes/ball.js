class Ball {
    x: 450,
		y: 300,
		width: 8,
		height: 8,
		vel_x: 6,
		vel_y: 4

    // Getters
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get vel_x() {
        return this._vel_x;
    }

    get vel_y() {
        return this._vel_y;
    }

    // Setters
    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

    set width(value) {
        this._width = value;
    }

    set height(value) {
        this._height = value;
    }

    set vel_x(value) {
        this._vel_x = value;
    }

    set vel_y(value) {
        this._vel_y = value;
    }
    toJS() {
        return {
            ball:{
                x: this._x,
                y: this._y,
                width: this._width,
                height: this._height,
                vel_x: this._vel_x,
                vel_y: this._vel_y
            }
        };
        }
}


module.exports = Ball;
class Ball {
	constructor() {
		this._x = 450;
		this._y = 300;
		this._width = 8;
		this._height = 8;
		this._vel_x = 5;
		this._vel_y = 4;
	}

	// Convert to JSON
	toJSON() {
		return {
			ball: {
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
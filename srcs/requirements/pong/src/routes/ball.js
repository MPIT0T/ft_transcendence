class Ball {
	constructor() {
		this._x = 450;
		this._y = 300;
		this._width = 8;
		this._height = 8;
		this._vel_x = 6;
		this._vel_y = 4;
	}

	// Getters
	get x() {return this._x;}
	get y() {return this._y;}
	get width() {return this._width;}
	get height() {return this._height;}
	get vel_x() {return this._vel_x;}
	get vel_y() {return this._vel_y;}

	// Setters
	set set_y(value) {this._y = value;}
	set set_width(value) {this._width = value;}
	set set_height(value) {this._height = value;}
	set set_vel_x(value) {this._vel_x = value;}
	set set_vel_y(value) {this._vel_y = value;}

	// Convert to JSON
	toJS() {
		return {
				x: this._x,
				y: this._y,
				width: this._width,
				height: this._height,
				vel_x: this._vel_x,
				vel_y: this._vel_y
		};
		}
}


module.exports = Ball;
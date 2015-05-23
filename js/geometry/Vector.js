define(function () {
	function Vector(arg1, arg2) {		//Vector(x, y), Vector(vec)
		if(typeof arg1 === "object") {
			this.x = arg1.x;
			this.y = arg1.y;
		}
		else {
			this.x = arg1;
			this.y = arg2;
		}
		return this;
	}
	Vector.prototype.getDistance = function(vec) {
		return Math.sqrt((vec.x-this.x)*(vec.x-this.x) + (vec.y-this.y)*(vec.y-this.y));
	}
	Vector.prototype.getLength = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	Vector.prototype.add = function(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}
	Vector.prototype.subtract = function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}
	Vector.prototype.invert = function() {
		this.x *= -1;
		this.y *= -1;
		return this;
	}
	Vector.prototype.extendBy = function(dl) {
		var length = this.getLength();
		var sin = this.y / length;
		var cos = this.x / length;
		this.x += dl*cos;
		this.y += dl*sin;
		return this;
	}
	Vector.prototype.multiplyBy = function(n) {
		var length = this.getLength();
		var newLength = n*length;
		var sin = this.y / length;
		var cos = this.x / length;
		this.x = newLength*cos;
		this.y = newLength*sin;
		return this;
	}
	Vector.prototype.getNormalVector = function(vec) {
		return new Vector(this).subtract(this.getTangentVector(vec));
	}
	Vector.prototype.getTangentVector = function(vec) {
		var vecLength = vec.getLength();
		var L = (this.x*vec.x + this.y*vec.y)/vecLength;
		var cos = vec.x/vecLength;
		var sin = vec.y/vecLength;
		return new Vector(L*cos,L*sin);
	}
	return Vector;
});
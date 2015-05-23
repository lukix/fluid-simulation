define(['./LineSegment', './Vector'], function (LineSegment, Vector) {
	function Polygon() {
		this.coords = new Vector(0, 0);
		this.angle = 0;
		this.sides = [];
		if(arguments.length <= 2) {
			//throw new Error("Trying to create Polygon with "+arguments.length+" vertices");
		}
		for(var i = 0; i < arguments.length; i++) {
			this.sides.push(new LineSegment(arguments[i], arguments[(i+1)%arguments.length]));
		}
	}
	Polygon.prototype.setCoords = function (coords) {
		this.coords = coords;
		return this;
	}
	Polygon.prototype.minPoint = function (absolute) {	//Default: absolute = true;
		var minPoint = new Vector(this.sides[0].p1.x, this.sides[0].p1.y);
		for(var i = 0; i < this.sides.length; i++) {
			if(this.sides[i].p2.x < minPoint.x) {
				minPoint.x = this.sides[i].p2.x;
			}
			if(this.sides[i].p2.y < minPoint.y) {
				minPoint.y = this.sides[i].p2.y;
			}
		}
		if(typeof absolute === "undefined" || absolute) {
			minPoint.add(this.coords);
		}
		return minPoint;
	}
	Polygon.prototype.maxPoint = function (absolute) {	//Default: absolute = true;
		var maxPoint = new Vector(this.sides[0].p1.x, this.sides[0].p1.y);
		for(var i = 0; i < this.sides.length; i++) {
			if(this.sides[i].p2.x > maxPoint.x) {
				maxPoint.x = this.sides[i].p2.x;
			}
			if(this.sides[i].p2.y > maxPoint.y) {
				maxPoint.y = this.sides[i].p2.y;
			}
		}
		if(typeof absolute === "undefined" || absolute) {
			maxPoint.add(this.coords);
		}
		return maxPoint;
	}
	Polygon.prototype.containsPoint = function (point, absolute) {	//May not work for points on the side of polygon //Default: absolute = true;
		var relativePoint = new Vector(point);
		if(typeof absolute === "undefined" || absolute) {
			relativePoint.subtract(this.coords);
		}
		var minPoint = this.minPoint();
		var outsidePoint = new Vector(minPoint.x-1.23456789, minPoint.y-1.23456789);
		var ray = new LineSegment(outsidePoint, relativePoint);
		var intersections = 0;
		for(var i = 0; i < this.sides.length; i++) {
			if(ray.crossingPoint(this.sides[i]) != null) {
				intersections++;
			}
		}
		return !!(intersections%2);
	}
	Polygon.prototype.getVolume = function () {		//Faster and more precisious method needed
		var minPoint = this.minPoint(false);
		var maxPoint = this.maxPoint(false);
		const n = 100;
		var stepX = (maxPoint.x - minPoint.x)/n;
		var stepY = (maxPoint.y - minPoint.y)/n;
		var volume = 0;
		for(var x = minPoint.x; x < maxPoint.x; x += stepX) {
			for(var y = minPoint.y; y < maxPoint.y; y += stepY) {
				if(this.containsPoint(new Vector(x, y), false)) {
					volume += stepX*stepY;
				}
			}
		}
		return volume;
	}
	Polygon.prototype.getMomentOfInertia = function () {		//Faster and more precisious method needed
		var minPoint = this.minPoint(false);
		var maxPoint = this.maxPoint(false);
		const n = 100;
		var stepX = (maxPoint.x - minPoint.x)/n;
		var stepY = (maxPoint.y - minPoint.y)/n;
		var result = 0;
		for(var x = minPoint.x; x < maxPoint.x; x += stepX) {
			for(var y = minPoint.y; y < maxPoint.y; y += stepY) {
				if(this.containsPoint(new Vector(x, y), false)) {
					var distanceSquared = (x + stepX/2)*(x + stepX/2) + (y + stepY/2)*(y + stepY/2);
					result += stepX*stepY*distanceSquared;
				}
			}
		}
		return result;
	}
	Polygon.prototype.getExtractedPoint = function (point) {	//Method don't work if point is already outside of the poloygon	//Absolute
		var relativePoint = new Vector(point).subtract(this.coords);
		const margin = 0.01;
		var closestSideIndex = 0;
		var ep;
		var i = 0;
		while((ep = this.sides[i].getProjectedPoint(relativePoint)) == null) {
			i++
		};
		console.log(i);
		var minDistance = ep.getDistance(relativePoint);
		for(; i < this.sides.length; i++) {
			ep = this.sides[i].getProjectedPoint(relativePoint);
			if(ep != null) {
				if(ep.getDistance(relativePoint) < minDistance) {
					minDistance = ep.getDistance(relativePoint);
					closestSideIndex = i;
				}
			}
		}
		var edgePoint = this.sides[closestSideIndex].getProjectedPoint(relativePoint);
		var displacementVector = edgePoint.subtract(relativePoint).extendBy(margin);
		relativePoint.add(this.coords);
		return new Vector(relativePoint).add(displacementVector);
	}
	return Polygon;
});
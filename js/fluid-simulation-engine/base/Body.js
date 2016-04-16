define(
	[
		 '../geometry/Polygon'
		,'../geometry/LineSegment'
		,'../geometry/Vector'
		,'../others/inheritFrom'
		,'../base/Particle'
	], function (Polygon, LineSegment, Vector, inheritFrom, Particle) {
	Body.inheritFrom = inheritFrom;
	Body.inheritFrom(Polygon);
	function Body() {
		Polygon.apply(this, arguments);
	}
	Body.prototype.getPotentialStickingForceVectors = function (particle) {
		var relativePoint = new Vector(particle.coords).subtract(this.coords);
		var vectors = [];
		var verticles = new Array(this.sides.length);
		verticles.fill(true);

		for(var i = 0; i < this.sides.length; i++) {
			var projectedPoint;
			if((projectedPoint = this.sides[i].getProjectedPoint(relativePoint)) !== null) {
				//Push vector
				var line = new LineSegment(relativePoint, projectedPoint);
				var vec = line.getUnitVector().multiplyBy(line.getLength());
				vectors.push(vec);

				verticles[i] = false;
				verticles[(i+1)%this.sides.length] = false;
			}
		}
		for(var i = 0; i < verticles.length; i++) {
			if(verticles[i]) {
				//Push vector
				var line = new LineSegment(relativePoint, this.sides[i].p1);
				var vec = line.getUnitVector().multiplyBy(line.getLength());
				vectors.push(vec);
			}
		}
		return vectors;
	}
	Body.prototype.getExtractedPoint = function (point) {	//Method doesn't work if point is already outside of the polygon	//Absolute
		const margin = 0.001;
		var relativePoint = new Vector(point).subtract(this.coords);
		var vectors = this.getPotentialStickingForceVectors(new Particle(point.x, point.y));
		var shortestVector = vectors[vectors.length - 1];
		var shortestLength = shortestVector.getLength();
		for(var k = vectors.length - 2; k >= 0; k--) {
			var length = vectors[k].getLength();
			if(length < shortestLength) {
				shortestVector = vectors[k];
				shortestLength = shortestVector.getLength();
			}
		}
		relativePoint.add(this.coords);
		return new Vector(relativePoint).add(shortestVector);
	}
	Body.prototype.render = function (ctx) {
		ctx.save();
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.translate(this.coords.x, this.coords.y);
		ctx.beginPath();
		ctx.moveTo(this.sides[0].p1.x, this.sides[0].p1.y);
		for(var i = 1; i < this.sides.length; i++) {
			ctx.lineTo(this.sides[i].p1.x, this.sides[i].p1.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	return Body;
});

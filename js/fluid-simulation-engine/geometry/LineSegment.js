define(['./Vector'], function (Vector) {
	function LineSegment(point1, point2) {
		this.p1 = point1;
		this.p2 = point2;
	}
	LineSegment.prototype.getLinearEquation = function() {	//Ax + By + C = 0
		var point1, point2;
		if(this.p2.x > this.p1.x) {
			point1 = new Vector(this.p1);
			point2 = new Vector(this.p2);
		}
		else {
			point1 = new Vector(this.p2);
			point2 = new Vector(this.p1);
		}
		var eq = {
			A: point2.y - point1.y,
			B: point1.x - point2.x,
			C: (point2.x - point1.x) * point1.y - (point2.y - point1.y) * point1.x
		}
		var k = 1;
		for(var i in eq) {
			if(eq[i] != 0) {
				k = eq[i];
				break;
			}
		}
		for(var i in eq)
			eq[i] /= k;
		return eq;
	}
	LineSegment.prototype.getUnitVector = function() {
		var vec = new Vector(this.p2).subtract(this.p1);
		return vec.multiplyBy(1/vec.getLength());
	}
	LineSegment.prototype.crossingPoint = function(lineSegment) { //returns null if crossing point doesn't exist
		var eq1 = this.getLinearEquation();
		var eq2 = lineSegment.getLinearEquation();
		var crossingPoint = new Vector();
		if((eq1.A*eq2.B - eq2.A*eq1.B) == 0) {	//parallel
			crossingPoint = null;
		}
		else if(eq1.B == 0 || eq2.B == 0) {	//First lineSegment is vertical
			if(eq2.B == 0) {	//Swap values
				var eq_temp = eq1;
				eq1 = eq2;
				eq2 = eq_temp;
			}
			//Now first lineSegment is veritcal and second is not
			crossingPoint.x = -eq1.C/eq1.A;
			crossingPoint.y = -(eq2.A*crossingPoint.x+eq2.C)/eq2.B;
			if(!this.containsPoint(crossingPoint) || !lineSegment.containsPoint(crossingPoint)) {
				crossingPoint = null;
			}
		}
		else {
			crossingPoint.x = (eq2.C/eq2.B - eq1.C/eq1.B)/(eq1.A/eq1.B - eq2.A/eq2.B);
			crossingPoint.y = -(eq2.A*crossingPoint.x+eq2.C)/eq2.B;
			if(!this.containsPoint(crossingPoint) || !lineSegment.containsPoint(crossingPoint)) {
				crossingPoint = null;
			}
		}
		return crossingPoint;
	}
	LineSegment.prototype.containsPoint = function(point) {	//Warning! Method only checks if point is within rectangle made of LineSegment's edge points
		return (
				point.x >= Math.min(this.p1.x, this.p2.x)
			&&	point.x <= Math.max(this.p1.x, this.p2.x)
			&&	point.y >= Math.min(this.p1.y, this.p2.y)
			&&	point.y <= Math.max(this.p1.y, this.p2.y)
		);
	}
	LineSegment.prototype.getProjectedPoint = function(point) {
		var eq = this.getLinearEquation();
		var projectedPoint = new Vector();
		if(eq.B == 0) {	//Vertical
			projectedPoint.x = -eq.C/eq.A;
			projectedPoint.y = point.y;
			if(!(projectedPoint.y >= Math.min(this.p1.y, this.p2.y) && projectedPoint.y <= Math.max(this.p1.y, this.p2.y))) {
				projectedPoint = null;
			}
		}
		else if(eq.A == 0) {	//Horizontal
			projectedPoint.x = point.x;
			projectedPoint.y = -eq.C/eq.B;
			if(!(projectedPoint.x >= Math.min(this.p1.x, this.p2.x) && projectedPoint.x <= Math.max(this.p1.x, this.p2.x))) {
				projectedPoint = null;
			}
		}
		else {
			var a1 = -eq.A/eq.B;
			var b1 = -eq.C/eq.B;

			var a2 = -1/a1;
			var b2 = point.y - a2*point.x;

			projectedPoint.x = (b2-b1)/(a1-a2);
			projectedPoint.y = a1*projectedPoint.x + b1;

			if(!this.containsPoint(projectedPoint)) {
				projectedPoint = null;
			}
		}
		return projectedPoint;
	}
	return LineSegment;
});

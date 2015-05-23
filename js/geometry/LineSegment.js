define(['./Vector'], function (Vector) {
	function LineSegment(point1, point2) {
		this.p1 = point1;
		this.p2 = point2;
	}
	LineSegment.prototype.getLinearEquation = function() {	//Ax + By + C = 0
		return {
			A: this.p2.y - this.p1.y,
			B: this.p1.x - this.p2.x,
			C: (this.p2.x - this.p1.x)*this.p1.y - (this.p2.y - this.p1.y)*this.p1.x
		}
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
			//Now First lineSegment is veritcal and second is not
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
			//console.log('asa');
			projectedPoint.x = point.x;
			projectedPoint.y = -eq.C/eq.B;
			/*
			console.log(Math.min(this.p1.x, this.p2.x));
			console.log(Math.max(this.p1.x, this.p2.x));
			console.log(projectedPoint.x);
			*/
			if(!(projectedPoint.x >= Math.min(this.p1.x, this.p2.x) && projectedPoint.x <= Math.max(this.p1.x, this.p2.x))) {
				projectedPoint = null;
			}
		}
		else {
			var a1 = -eq.A/eq.B;
			var b1 = -eq.C;
			
			var a2 = -1/a1;
			var b2 = point.y - a2*point.x;
			
			projectedPoint.x = (b2-b1)/(a1-a2);
			projectedPoint.y = a1*projectedPoint.x + b1;
			
			var isIn = (
					projectedPoint.x >= Math.min(this.p1.x, this.p2.x)
				&&	projectedPoint.x <= Math.max(this.p1.x, this.p2.x)
				&&	projectedPoint.y >= Math.min(this.p1.y, this.p2.y)
				&&	projectedPoint.y <= Math.max(this.p1.y, this.p2.y)
			);
			if(!isIn) {
				projectedPoint = null;
			}
		}
		return projectedPoint;
	}
	return LineSegment;
});
require(
	[
		 '../fluid-simulation-engine/geometry/LineSegment'
		,'../fluid-simulation-engine/geometry/Polygon'
		,'../fluid-simulation-engine/geometry/Vector'
		,'../fluid-simulation-engine/base/Particle'
		,'../fluid-simulation-engine/base/Body'
	], function(LineSegment, Polygon, Vector, Particle, Body) {
		QUnit.assert.close = function(number, expected, relError, message) {
			var margin = relError*expected;
			var result = number >= expected-margin && number <= expected+margin;
			this.push(result, number, expected, message);
		}
		QUnit.test("LineSegment.getLinearEquation", function (assert) {
			var line = new LineSegment(
				 new Vector(25, -50)
				,new Vector(50, 0)
			);
			assert.propEqual(line.getLinearEquation(), {A: 1, B: -0.5, C: -50});

			var line = new LineSegment(
				 new Vector(50, 0)
				,new Vector(25, -50)
			);
			assert.propEqual(line.getLinearEquation(), {A: 1, B: -0.5, C: -50});
		});
		QUnit.test("LineSegment.crossingPoint", function (assert) {
			var a = new LineSegment(new Vector(0, 0), new Vector(10, 10));
			var b = new LineSegment(new Vector(10, 0), new Vector(0, 10));
			assert.propEqual(a.crossingPoint(b), new Vector(5, 5));

			var a = new LineSegment(new Vector(4, 0), new Vector(4, 10));
			var b = new LineSegment(new Vector(0, 0), new Vector(10, 10));
			assert.propEqual(a.crossingPoint(b), new Vector(4, 4));

			var a = new LineSegment(new Vector(4, 0), new Vector(4, 10));
			var b = new LineSegment(new Vector(0, 0), new Vector(10, 10));
			assert.propEqual(b.crossingPoint(a), new Vector(4, 4));

			var a = new LineSegment(new Vector(4, 0), new Vector(4, 10));
			var b = new LineSegment(new Vector(5, 0), new Vector(5, 10));
			assert.equal(a.crossingPoint(b), null);

			var a = new LineSegment(new Vector(0, 4), new Vector(10, 4));
			var b = new LineSegment(new Vector(0, 0), new Vector(10, 10));
			assert.propEqual(a.crossingPoint(b), new Vector(4, 4));

			var a = new LineSegment(new Vector(0, 4), new Vector(10, 4));
			var b = new LineSegment(new Vector(3, 0), new Vector(3, 10));
			assert.propEqual(a.crossingPoint(b), new Vector(3, 4));

			var a = new LineSegment(new Vector(0, 4), new Vector(10, 4));
			var b = new LineSegment(new Vector(3, 0), new Vector(3, 10));
			assert.propEqual(b.crossingPoint(a), new Vector(3, 4));

			var a = new LineSegment(new Vector(4, 0), new Vector(4, 10));
			var b = new LineSegment(new Vector(5, 0), new Vector(5, 10));
			assert.equal(a.crossingPoint(b), null);

			var a = new LineSegment(new Vector(0, 0), new Vector(10, 10));
			var b = new LineSegment(new Vector(0, 1), new Vector(0, 11));
			assert.equal(a.crossingPoint(b), null);

			var a = new LineSegment(new Vector(0, 0), new Vector(2, 10));
			var b = new LineSegment(new Vector(5, 0), new Vector(4, 1));
			assert.equal(a.crossingPoint(b), null);
		});
		QUnit.test("LineSegment.getProjectedPoint", function (assert) {
			var a = new LineSegment(new Vector(0, 0), new Vector(10, 10));
			var p = new Vector(0, 5);
			assert.propEqual(a.getProjectedPoint(p), new Vector(2.5, 2.5));
			var p = new Vector(0, 30);
			assert.equal(a.getProjectedPoint(p), null);
			var p = {x: 5, y: 1};
			assert.propEqual(a.getProjectedPoint(p), {x: 3, y: 3});
			var p = {x: 3, y: 3};
			assert.propEqual(a.getProjectedPoint(p), {x: 3, y: 3});
			var p = {x: 0, y: 0};
			assert.propEqual(a.getProjectedPoint(p), {x: 0, y: 0});

			var a = new LineSegment(new Vector(25, 25), new Vector(25, -25));
			var p = new Vector(-12, -26);
			assert.equal(a.getProjectedPoint(p), null);

			var line = new LineSegment(
				new Vector(0, 0)
				,new Vector(25, -50)
		 	);
			var point = new Vector(60, -45);
			assert.equal(line.getProjectedPoint(point), null);

			var line = new LineSegment(
				new Vector(25, -50)
				,new Vector(50, 0)
			);
			var point = new Vector(90, -45);
			assert.propEqual(line.getProjectedPoint(point), new Vector(40, -20));
		});
		QUnit.test("Polygon.costructor", function (assert) {
			var polygon = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 4)
				,new Vector(4, 4)
				,new Vector(4, 0)
			).setCoords(new Vector(0, 0));
			assert.equal(polygon.sides.length, 4);

			var polygon = [
				 new Vector(0, 0)
				,new Vector(0, 4)
				,new Vector(4, 4)
				,new Vector(4, 0)
			];
			assert.equal(new Polygon(polygon).sides.length, 4);
		});
		QUnit.test("Polygon.minPoint", function (assert) {
			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(-2, 3)
				,new Vector(3, 2)
				,new Vector(5, 4)
				,new Vector(7, -1)
				,new Vector(4, 1)
			);
			assert.propEqual(p.minPoint(), {x: -2, y: -1});

			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 1)
				,new Vector(1, 1)
				,new Vector(1, 0)
			);
			assert.propEqual(p.minPoint(), {x: 0, y: 0});
		});
		QUnit.test("Polygon.maxPoint", function (assert) {
			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(-2, 3)
				,new Vector(3, 2)
				,new Vector(5, 4)
				,new Vector(7, -1)
				,new Vector(4, 1)
			);
			assert.propEqual(p.maxPoint(), {x: 7, y: 4});

			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 1)
				,new Vector(1, 1)
				,new Vector(1, 0)
			);
			assert.propEqual(p.maxPoint(), {x: 1, y: 1});
		});
		QUnit.test("Polygon.getVolume", function (assert) {
			const relErr = 0.04;
			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 1)
				,new Vector(1, 1)
				,new Vector(1, 0)
			).setCoords(new Vector(5, 12));
			assert.close(p.getVolume(), 1.0, relErr);

			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(1, 5)
				,new Vector(2, 0)
			);
			assert.close(p.getVolume(), 5.0, relErr);

			var p = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 5)
				,new Vector(2, 3)
				,new Vector(4, 5)
				,new Vector(4, 0)
				,new Vector(2, 2)
			);
			assert.close(p.getVolume(), 12.0, relErr);
		});

		QUnit.test("Polygon.getMomentOfInertia", function (assert) {
			const relErr = 0.04;

			var p = new Polygon(
				 new Vector(-0.5, -0.5)
				,new Vector(-0.5, 0.5)
				,new Vector(0.5, 0.5)
				,new Vector(0.5, -0.5)
			).setCoords(new Vector(5, 12));
			assert.close(p.getMomentOfInertia(), 1/6, relErr);
		});

		QUnit.test("Vector.getDistance", function (assert) {
			const relErr = 0.001;
			var p1 = new Vector(0, 0);

			var p2 = new Vector(10, 0);
			assert.close(p1.getDistance(p2), 10, relErr);

			var p2 = new Vector(0, 10);
			assert.close(p1.getDistance(p2), 10, relErr);

			var p2 = new Vector(10, 10);
			assert.close(p1.getDistance(p2), 10*Math.SQRT2, relErr);

			var p2 = new Vector(-10, 10);
			assert.close(p1.getDistance(p2), 10*Math.SQRT2, relErr);

			var p2 = new Vector(0, 0);
			assert.close(p1.getDistance(p2), 0, relErr);
		});

		QUnit.test("Vector.extendBy", function (assert) {
			var vec = new Vector(0, 1);
			vec.extendBy(1);
			assert.propEqual(vec, new Vector(0, 2));

			var vec = new Vector(1, 0);
			vec.extendBy(1);
			assert.propEqual(vec, new Vector(2, 0));
		});

		QUnit.test("Polygon.getClosestSide", function (assert) {
			var polygon = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 4)
				,new Vector(4, 4)
				,new Vector(4, 0)
			).setCoords(new Vector(0, 0));

			var point = new Vector(-2, 1);
			assert.propEqual(polygon.getClosestSide(point).p1, new Vector(0, 0));
			assert.propEqual(polygon.getClosestSide(point).p2, new Vector(0, 4));

			var point = new Vector(2, -1);
			assert.propEqual(polygon.getClosestSide(point).p1, new Vector(4, 0));
			assert.propEqual(polygon.getClosestSide(point).p2, new Vector(0, 0));

			var point = new Vector(-2, -1);
			assert.equal(polygon.getClosestSide(point), null);

			var polygon = new Polygon(
				 new Vector(25, 25)
				,new Vector(25, -25)
				,new Vector(-25, -25)
				,new Vector(-25, 25)
			);
			var point = new Vector(-12, -26);
			assert.propEqual(polygon.getClosestSide(point).p1, new Vector(25, -25));
			assert.propEqual(polygon.getClosestSide(point).p2, new Vector(-25, -25));

			var polygon = new Polygon([
				new Vector(0, 0)
				,new Vector(25, -50)
			 ,new Vector(50, 0)
			 ,new Vector(50, 50)
			 ,new Vector(0, 50)
		 	]);
			var point = new Vector(60, -25);
			assert.propEqual(polygon.getClosestSide(point).p1, new Vector(25, -50));
			assert.propEqual(polygon.getClosestSide(point).p2, new Vector(50, 0));

		});

		QUnit.test("Polygon.containsPoint", function (assert) {
			var point = new Vector(2, 2);
			var polygon = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 4)
				,new Vector(4, 4)
				,new Vector(4, 0)
			).setCoords(new Vector(1, 1));
			assert.ok(polygon.containsPoint(point));

			var circle = (function () {
				var R = 1;
				var resolution = 4;
				var circle = [];
				for(var i = 0; i < 2*resolution; i++) {
					circle.push(
						new Vector(
							 Math.cos(Math.PI/2-i*Math.PI/resolution)*R
							,R-Math.sin(Math.PI/2-i*Math.PI/resolution)*R
						)
					);
				}
				return circle;
			})();
			var circlePolygon = new Polygon(circle).setCoords(new Vector(0, -1));
			assert.ok(circlePolygon.containsPoint(new Vector(0, 0)));
			assert.ok(circlePolygon.containsPoint(new Vector(0.65, 0.65)));
			assert.ok(circlePolygon.containsPoint(new Vector(0, 0.8)));
			assert.ok(circlePolygon.containsPoint(new Vector(0.8, 0)));
			assert.ok(circlePolygon.containsPoint(new Vector(-0.65, -0.60)));
			assert.ok(circlePolygon.containsPoint(new Vector(0, -0.8)));

			assert.notOk(circlePolygon.containsPoint(new Vector(1.2, 1.2)));
		});

		QUnit.test("Polygon.getExtractedPoint", function (assert) {	//Poor test! :(
			var polygon = new Polygon(
				 new Vector(0, 0)
				,new Vector(0, 4)
				,new Vector(4, 4)
				,new Vector(4, 0)
			).setCoords(new Vector(1, 1));

			var point = new Vector(3.5+1, 1+1);
			assert.notOk(polygon.containsPoint(polygon.getExtractedPoint(point)));

			var point = new Vector(2+1, 2+1);
			assert.notOk(polygon.containsPoint(polygon.getExtractedPoint(point)));
		});

		QUnit.test("Vector.getTangentVector", function (assert) {
			var vec1 = new Vector(0, 3);

			var vec2 = new Vector(-1, 2);
			assert.propEqual(vec2.getTangentVector(vec1), new Vector(0, 2));

			var vec2 = new Vector(0, 3);
			assert.propEqual(vec2.getTangentVector(vec1), new Vector(0, 3));

			var vec2 = new Vector(-5, 0);
			assert.propEqual(vec2.getTangentVector(vec1), new Vector(0, 0));
		});

		QUnit.test("Vector.getNormalVector", function (assert) {
			var vec1 = new Vector(0, 3);

			var vec2 = new Vector(-1, 2);
			assert.propEqual(vec2.getNormalVector(vec1), new Vector(-1, 0));

			var vec2 = new Vector(0, 3);
			assert.propEqual(vec2.getNormalVector(vec1), new Vector(0, 0));

			var vec2 = new Vector(-5, 0);
			assert.propEqual(vec2.getNormalVector(vec1), new Vector(-5, 0));
		});

		QUnit.test("Vector.multiplyBy", function (assert) {
			const relErr = 0.001;

			var vec1 = new Vector(1, 1);
			assert.close(vec1.multiplyBy(2).x, 2, relErr);

			var vec1 = new Vector(1, 1);
			assert.close(vec1.multiplyBy(2).y, 2, relErr);


		});

		QUnit.test("LineSegment.getUnitVector", function (assert) {
			var lineSegment = new LineSegment(
				new Vector(3, 3),
				new Vector(5, 5)
			);
			assert.propEqual(lineSegment.getUnitVector(), new Vector(1/Math.SQRT2, 1/Math.SQRT2));
		});

		QUnit.test("Body.getPotentialStickingForceVectors", function (assert) {
			var shape = [
				 new Vector(0, 0)
				,new Vector(7, 0)
				,new Vector(7, 5)
				,new Vector(4, 7)
				,new Vector(0, 5)
			];
			var body = new Body(shape);
			var particle = new Particle(12, 3);
			var result = body.getPotentialStickingForceVectors(particle);
			assert.propEqual(result, {});
		});

	}
);

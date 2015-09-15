define(
	[
		 '../fluid-simulation-engine/geometry/Vector'
		,'../fluid-simulation-engine/geometry/LineSegment'
	], function (Vector, LineSegment) {
	return function () {
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
		QUnit.test("LineSegment.getUnitVector", function (assert) {
			var lineSegment = new LineSegment(
				new Vector(3, 3),
				new Vector(5, 5)
			);
			assert.propEqual(lineSegment.getUnitVector(), new Vector(1/Math.SQRT2, 1/Math.SQRT2));
		});
	};
});

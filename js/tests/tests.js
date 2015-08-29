require(
	[
		 '../fluid-simulation-engine/geometry/LineSegment'
		,'../fluid-simulation-engine/geometry/Polygon'
		,'../fluid-simulation-engine/geometry/Vector'
		,'../fluid-simulation-engine/base/Particle'
	], function(LineSegment, Polygon, Vector, Particle) {
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
			var a = new LineSegment({x: 0, y: 0}, {x: 10, y: 10});
			var b = new LineSegment({x: 10, y: 0}, {x: 0, y: 10});
			assert.propEqual(a.crossingPoint(b), {x: 5, y: 5});

			var a = new LineSegment({x: 4, y: 0}, {x: 4, y: 10});
			var b = new LineSegment({x: 0, y: 0}, {x: 10, y: 10});
			assert.propEqual(a.crossingPoint(b), {x: 4, y: 4});

			var a = new LineSegment({x: 4, y: 0}, {x: 4, y: 10});
			var b = new LineSegment({x: 0, y: 0}, {x: 10, y: 10});
			assert.propEqual(b.crossingPoint(a), {x: 4, y: 4});

			var a = new LineSegment({x: 4, y: 0}, {x: 4, y: 10});
			var b = new LineSegment({x: 5, y: 0}, {x: 5, y: 10});
			assert.equal(a.crossingPoint(b), null);

			var a = new LineSegment({x: 0, y: 4}, {x: 10, y: 4});
			var b = new LineSegment({x: 0, y: 0}, {x: 10, y: 10});
			assert.propEqual(a.crossingPoint(b), {x: 4, y: 4});

			var a = new LineSegment({x: 0, y: 4}, {x: 10, y: 4});
			var b = new LineSegment({x: 3, y: 0}, {x: 3, y: 10});
			assert.propEqual(a.crossingPoint(b), {x: 3, y: 4});

			var a = new LineSegment({x: 0, y: 4}, {x: 10, y: 4});
			var b = new LineSegment({x: 3, y: 0}, {x: 3, y: 10});
			assert.propEqual(b.crossingPoint(a), {x: 3, y: 4});

			var a = new LineSegment({x: 4, y: 0}, {x: 4, y: 10});
			var b = new LineSegment({x: 5, y: 0}, {x: 5, y: 10});
			assert.equal(a.crossingPoint(b), null);

			var a = new LineSegment({x: 0, y: 0}, {x: 10, y: 10});
			var b = new LineSegment({x: 0, y: 1}, {x: 0, y: 11});
			assert.equal(a.crossingPoint(b), null);

			var a = new LineSegment({x: 0, y: 0}, {x: 2, y: 10});
			var b = new LineSegment({x: 5, y: 0}, {x: 4, y: 1});
			assert.equal(a.crossingPoint(b), null);
		});
		QUnit.test("LineSegment.getProjectedPoint", function (assert) {
			var a = new LineSegment({x: 0, y: 0}, {x: 10, y: 10});
			var p = {x: 0, y: 5};
			assert.propEqual(a.getProjectedPoint(p), {x: 2.5, y: 2.5});
			var p = {x: 0, y: 30};
			assert.equal(a.getProjectedPoint(p), null);
			var p = {x: 5, y: 1};
			assert.propEqual(a.getProjectedPoint(p), {x: 3, y: 3});
			var p = {x: 3, y: 3};
			assert.propEqual(a.getProjectedPoint(p), {x: 3, y: 3});
			var p = {x: 0, y: 0};
			assert.propEqual(a.getProjectedPoint(p), {x: 0, y: 0});

			var a = new LineSegment({x: 25, y: 25}, {x: 25, y: -25});
			var p = {x: -12, y: -26};
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
				 {x: 0, y: 0}
				,{x: -2, y: 3}
				,{x: 3, y: 2}
				,{x: 5, y: 4}
				,{x: 7, y: -1}
				,{x: 4, y: 1}
			);
			assert.propEqual(p.minPoint(), {x: -2, y: -1});

			var p = new Polygon(
				 {x: 0, y: 0}
				,{x: 0, y: 1}
				,{x: 1, y: 1}
				,{x: 1, y: 0}
			);
			assert.propEqual(p.minPoint(), {x: 0, y: 0});
		});
		QUnit.test("Polygon.maxPoint", function (assert) {
			var p = new Polygon(
				 {x: 0, y: 0}
				,{x: -2, y: 3}
				,{x: 3, y: 2}
				,{x: 5, y: 4}
				,{x: 7, y: -1}
				,{x: 4, y: 1}
			);
			assert.propEqual(p.maxPoint(), {x: 7, y: 4});

			var p = new Polygon(
				 {x: 0, y: 0}
				,{x: 0, y: 1}
				,{x: 1, y: 1}
				,{x: 1, y: 0}
			);
			assert.propEqual(p.maxPoint(), {x: 1, y: 1});
		});
		QUnit.test("Polygon.getVolume", function (assert) {
			const relErr = 0.04;
			var p = new Polygon(
				 {x: 0, y: 0}
				,{x: 0, y: 1}
				,{x: 1, y: 1}
				,{x: 1, y: 0}
			).setCoords(new Vector(5, 12));
			assert.close(p.getVolume(), 1.0, relErr);

			var p = new Polygon(
				 {x: 0, y: 0}
				,{x: 1, y: 5}
				,{x: 2, y: 0}
			);
			assert.close(p.getVolume(), 5.0, relErr);

			var p = new Polygon(
				 {x: 0, y: 0}
				,{x: 0, y: 5}
				,{x: 2, y: 3}
				,{x: 4, y: 5}
				,{x: 4, y: 0}
				,{x: 2, y: 2}
			);
			assert.close(p.getVolume(), 12.0, relErr);
		});

		QUnit.test("Polygon.getMomentOfInertia", function (assert) {
			const relErr = 0.04;

			var p = new Polygon(
				 {x: -0.5, y: -0.5}
				,{x: -0.5, y: 0.5}
				,{x: 0.5, y: 0.5}
				,{x: 0.5, y: -0.5}
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

	}
);

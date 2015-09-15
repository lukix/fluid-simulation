define(
	[
		 '../fluid-simulation-engine/geometry/Vector'
		,'../fluid-simulation-engine/geometry/Polygon'
	], function (Vector, Polygon) {
	return function () {
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
	};
});

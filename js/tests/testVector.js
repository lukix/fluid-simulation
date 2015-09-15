define(['../fluid-simulation-engine/geometry/Vector'], function (Vector) {
	return function () {
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
	};
});

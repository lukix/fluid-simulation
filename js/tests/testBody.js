define(
	[
		 '../fluid-simulation-engine/geometry/Vector'
		,'../fluid-simulation-engine/base/Body'
		,'../fluid-simulation-engine/base/Particle'
	], function (Vector, Body, Particle) {
	return function () {
		/*
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
		//*/
	};
});

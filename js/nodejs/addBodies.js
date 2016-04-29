define(['../fluid-simulation-engine/base/Body', '../fluid-simulation-engine/geometry/Vector'], function (Body, Vector) {
	return function (world) {
		var width = 3000;
		var height = 633;
		//Bottom wall
		world.addBody(new Body(
			 new Vector(-(100-10), 0)
			,new Vector(width+(100-10), 0)
			,new Vector(width+(100-10), 100)
			,new Vector(-(100-10), 100)
		).setCoords(new Vector(0, height-10)));

		//Left wall
		world.addBody(new Body(
			 new Vector(0, 0)
			,new Vector(-100, 0)
			,new Vector(-100, 2*height+(100-10))
			,new Vector(0, 2*height+(100-10))
		).setCoords(new Vector(10, -height)));

		//Right wall
		world.addBody(new Body(
			 new Vector(0, 0)
			,new Vector(100, 0)
			,new Vector(100, 2*height+(100-10))
			,new Vector(0, 2*height+(100-10))
		).setCoords(new Vector(width-10, -height)));

		//Top wall
		world.addBody(new Body(
			 new Vector(0, 0)
			,new Vector(width, 0)
			,new Vector(width, 100)
			,new Vector(0, 100)
		).setCoords(new Vector(0, -height)));

	};
});

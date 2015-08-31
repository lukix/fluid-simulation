define(
	[
		 '../fluid-simulation-engine/base/Body'
		,'../fluid-simulation-engine/geometry/Vector'
	], function (Body, Vector) {
	return function (world) {
		var width = 1300;
		var height = 1000;
		var wallThickness = 100;

		var horizontalWall = [
			new Vector(0, 0)
		 ,new Vector(width, 0)
		 ,new Vector(width, wallThickness)
		 ,new Vector(0, wallThickness)
	 	];
		var verticalWall = [
			new Vector(0, 0)
		 ,new Vector(wallThickness, 0)
		 ,new Vector(wallThickness, height+wallThickness)
		 ,new Vector(0, height+wallThickness)
		];
		var shortHorizontalWall = [
			new Vector(0, 0)
		 ,new Vector(0, 50)
		 ,new Vector(550, 50)
		 ,new Vector(550, 0)
	 	];
		var shortVerticalWall = [
			new Vector(0, 0)
		 ,new Vector(0, 100)
		 ,new Vector(50, 100)
		 ,new Vector(50, 0)
	 	];

		world.addBody(new Body(horizontalWall).setCoords(new Vector(0, height)));	//Bottom wall
		world.addBody(new Body(verticalWall).setCoords(new Vector(0, 0)));	//Left wall
		world.addBody(new Body(verticalWall).setCoords(new Vector(width-wallThickness, 0)));	//Right wall
		world.addBody(new Body(horizontalWall).setCoords(new Vector(0, 0)));	//Top wall

		world.addBody(new Body(shortVerticalWall).setCoords(new Vector(500, 800)));
		world.addBody(new Body(shortHorizontalWall).setCoords(new Vector(0, 850)));
	};
});

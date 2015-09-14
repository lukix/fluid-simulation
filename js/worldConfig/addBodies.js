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
		 ,new Vector(width+2*wallThickness, 0)
		 ,new Vector(width+2*wallThickness, wallThickness)
		 ,new Vector(0, wallThickness)
	 	];
		world.addBody(new Body(horizontalWall).setCoords(new Vector(0, 0)));
		var lolWall = [
			 new Vector(0, 0)
			,new Vector(0, 50)
			,new Vector(550, 50)
			,new Vector(550, -50)
			,new Vector(500, -50)
			,new Vector(500, 0)
		];
		world.addBody(new Body(lolWall).setCoords(new Vector(0, 850)));

		var bigSingleWall = [
			 new Vector(0, 0)
			,new Vector(0, height+wallThickness)
			,new Vector(width+2*wallThickness, height+wallThickness)
			,new Vector(width+2*wallThickness, 0)
			,new Vector(width+wallThickness, 0)
			,new Vector(width+wallThickness, height)
			,new Vector(wallThickness, height)
			,new Vector(wallThickness, 0*wallThickness)
		];
		world.addBody(new Body(bigSingleWall).setCoords(new Vector(0, 0)));
	};
});

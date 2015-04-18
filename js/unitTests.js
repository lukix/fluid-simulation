(function () {
	var hull = getConvexHull();
	console.log(hull);
	
	//var body = new Body();
	function getConvexHull () {
		var world = new World(1000, 400).addParticlesGrid(20, 20);
		var p = [
			 new Particle(1, 3)
			,new Particle(2, 1)
			,new Particle(3, 3)
			,new Particle(3, 4)
			,new Particle(3, 5)
			,new Particle(5, 4)
			,new Particle(6, 6)
			,new Particle(7, 1)
			,new Particle(8, 4)
		];
		var hull = world.getConvexHull(p);
		return hull;
	}
})();
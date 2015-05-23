requirejs.config({
	'paths': {
		'jquery': ['./lib/jquery-1.11.2.min']
	}
});
require(
	[
		'jquery'
		,'World'
		,'Particle'
		,'WaterParticle'
		,'Body'
		,'./geometry/Vector'
		,'./ui/tiltButton'
		,'./ui/mainLoop'
		,'./ui/initCoeffsControls'
		,'./ui/mouseControls'
		,'./ui/rainModule'
	], function($, World, Particle, WaterParticle, Body, Vector, tiltButton, mainLoop, initCoeffsControls, mouseControls, rainModule) {
		myCanvas = document.getElementById('canvas');
		myCanvas.width = $(myCanvas).width();
		myCanvas.height = $(myCanvas).height();
		if (!(ctx = myCanvas.getContext('2d')))
			return false;
		const ZOOM = 0.9;
		ctx.scale(ZOOM, ZOOM);
		var world = new World(myCanvas.width/ZOOM, myCanvas.height/ZOOM);
		const PARTICLES_NUMBER = 700;
		const PARTICLES_IN_ROW = 25;
		world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 200, Particle);
		world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 900, WaterParticle);
		world.addBody(new Body(
			 new Vector(25, 25)
			,new Vector(25, -25)
			,new Vector(-25, -25)
			,new Vector(-25, 25)
		).setCoords(new Vector(25, 500)));
		
		mainLoop(world);
		(function render() {
			world.render(ctx);
			requestAnimationFrame(render);
		})();
		initCoeffsControls(world);
		rainModule(world);
		$('#gravityChangerButton').click(function () {
			var gx = world.gravity.x;
			var gy = world.gravity.y;
			gx = gy + (gy = gx, 0);
			world.setGravity({x: gx, y: gy});
		});
		$('form#coeffs').submit(function () {
			return false;
		});
		$('#show').click(function () {
			$('#rest').slideToggle();
		});
		$('#tiltButton').click(function () {
			tiltButton(world);
		});
		mouseControls(world, ZOOM);
	}
);
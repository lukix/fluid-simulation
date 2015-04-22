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
		,'./ui/tiltButton'
		,'./ui/mainLoop'
		,'./ui/initCoeffsControls'
		,'./ui/mouseControls'
		,'./ui/rainModule'
	], function($, World, Particle, WaterParticle, Body, tiltButton, mainLoop, initCoeffsControls, mouseControls, rainModule) {
		myCanvas = document.getElementById('canvas');
		myCanvas.width = $(myCanvas).width();
		myCanvas.height = $(myCanvas).height();
		if (!(ctx = myCanvas.getContext('2d')))
			return false;
		const zoom = 0.9;
		ctx.scale(zoom, zoom);
		var world = new World(myCanvas.width/zoom, myCanvas.height/zoom);
		const PARTICLES_NUMBER = 700;
		const PARTICLES_IN_ROW = 25;
		world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 200, Particle);
		world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 900, WaterParticle);
		world.addBody(new Body(
			{x: 50, y: 50, angle: Math.PI/4},
			[{x: 25, y: 25}, {x: 25, y: -25}, {x: -25, y: -25}, {x: -25, y: 25}]
		));
		
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
			$('#rest').toggle();
		});
		$('#tiltButton').click(function () {
			tiltButton(world);
		});
		//mouseControls(world);
	}
);
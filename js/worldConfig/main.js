requirejs.config({
	'paths': {
		'jquery': ['../lib/jquery-1.11.2.min']
	}
});
require(
	[
		'jquery'
		,'../fluid-simulation-engine/base/World'
		,'../fluid-simulation-engine/base/Particle'
		,'../fluid-simulation-engine/base/WaterParticle'
		,'../fluid-simulation-engine/base/Body'
		,'../fluid-simulation-engine/geometry/Vector'
		,'./ui/tiltButton'
		,'./ui/buttons'
		,'./ui/mainLoop'
		,'./ui/mouseRepulsor'
		,'../uiCommonModules/mouseCameraMove'
		,'../uiCommonModules/mouseCameraZoom'
		,'../uiCommonModules/cameraSmartPoint'
		,'./addBodies'
	], function($, World, Particle, WaterParticle, Body, Vector, buttons, mainLoop, mouseRepulsor, mouseCameraMove, mouseCameraZoom, cameraSmartPoint, addBodies) {
		var myCanvas = document.getElementById('canvas');
		myCanvas.width = $(myCanvas).width();
		myCanvas.height = $(myCanvas).height();
		var ctx = myCanvas.getContext('2d');
		if (!ctx)
			return false;
		var TRANSFORM = {x: 0, y: 0, scale_x: 1, scale_y: 1};
		ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);

		var world = new World();
		addBodies(world);
		(function () {
			var minPoint = world.getBodiesMinPoint();
			var maxPoint = world.getBodiesMaxPoint();
			world.setOutOfBoundsBehaviour(new Vector(600, -300), function (particle) {
				if(particle.coords.y > maxPoint.y || particle.coords.y < minPoint.y || particle.coords.x > maxPoint.x || particle.coords.x < minPoint.x)
					return true;
				else
					return false;
			});
		})();
		const PARTICLES_NUMBER = 1000;
		const PARTICLES_IN_ROW = 25;
		world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 50, -240, WaterParticle);

		mainLoop(world);
		(function render() {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
			ctx.restore();

			world.render(ctx);
			requestAnimationFrame(render);
		})();
		$(window).resize(function () {
			myCanvas.width = $(myCanvas).width();
			myCanvas.height = $(myCanvas).height();
			ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		});
		$('#gravityChangerButton').click(function () {
			buttons.changeGravity(world);
		});
		$('#show').click(function () {
			$('#rest').slideToggle();
		});
		cameraSmartPoint(ctx, TRANSFORM, myCanvas, world);
		mouseRepulsor(world, TRANSFORM);
		mouseCameraMove(ctx, TRANSFORM);
		mouseCameraZoom(ctx, TRANSFORM);
	}
);

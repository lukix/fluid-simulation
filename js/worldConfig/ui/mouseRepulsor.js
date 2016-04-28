define(['jquery', '../../fluid-simulation-engine/geometry/Vector'], function ($, Vector) {
	return function (world, camera) {
		var repulsor = {coords: new Vector(0, 0), strength: 0};
		const REPULSOR_STRENGTH = 4000;
		world.addRepulsiveForceSource(repulsor);
		var mouseDown = false;
		$('#canvas').mousedown(function (e) {
			if(e.button !== 0)
				return;
			mouseDown = true;
			repulsor.strength = REPULSOR_STRENGTH;
			changeRepulsorCoords(e);
		});
		$('#canvas').mouseup(function (e) {
			if(e.button !== 0)
				return;
			mouseDown = false;
			repulsor.strength = 0;
		});
		$('#canvas').mousemove(function (e) {
			if(mouseDown) {
				changeRepulsorCoords(e);
			}
		});
		function changeRepulsorCoords(e) {
			repulsor.coords.x = (1/camera.zoom*(e.pageX+camera.left)+camera.position.x);
			repulsor.coords.y = (1/camera.zoom*(-e.pageY-camera.top)+camera.position.y);
		}
	};
});

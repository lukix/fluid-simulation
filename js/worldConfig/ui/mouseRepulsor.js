define(['jquery', '../../fluid-simulation-engine/geometry/Vector'], function ($, Vector) {
	return function (world, transform) {
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
			repulsor.coords.x = (e.pageX-transform.x) / transform.scale_x;
			repulsor.coords.y = (e.pageY-transform.y) / transform.scale_y;
		}
	};
});

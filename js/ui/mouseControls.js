define(function () {
	return function (world, scale) {
		var repulsor = {coords: {x: 0, y: 0}, strength: 0};
		const REPULSOR_STRENGTH = 4000;
		world.addRepulsiveForceSource(repulsor);
		var mouseDown = false;
		$('#canvas').mousedown(function (e) {
			mouseDown = true;
			repulsor.strength = REPULSOR_STRENGTH;
			repulsor.coords.x = e.pageX / scale;
			repulsor.coords.y = e.pageY / scale;
		});
		$('#canvas').mouseup(function (e) {
			mouseDown = false;
			repulsor.strength = 0;
		});
		$('#canvas').mousemove(function (e) {
			if(mouseDown) {
				repulsor.coords.x = e.pageX / scale;
				repulsor.coords.y = e.pageY / scale;
			}
		});
	};
});
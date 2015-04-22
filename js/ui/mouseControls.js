define(function () {
	return function (world) {
		var mouseDown = false;
		var capturedParticles = [];
		const RADIUS = 100;
		$('#canvas').mousedown(function (e) {
			mouseDown = true;
			//capturedParticles = world.getNearestParticles({x: e.pageX, y: e.pageY}, RADIUS);
		});
		$('#canvas').mouseup(function (e) {
			mouseDown = false;
		});
		$('#canvas').mousemove(function (e) {
			if(!mouseDown) {
				return;
			}
			//document.title = e.pageX + ', ' + e.pageY;
		});
	};
});
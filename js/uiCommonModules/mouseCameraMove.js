define(['jquery'], function ($) {
	return function (camera) {
		var mouseDown = false;
		var mouseLastCoords = {x: null, y: null};
		$('#canvas').mousedown(function (e) {
			if(e.button !== 1)
				return;
			mouseDown = true;
			updateLastCoords(e);
		});
		$('#canvas').mouseup(function (e) {
			if(e.button !== 1)
				return;
			move(e);
			mouseDown = false;
		});
		$('#canvas').mousemove(function (e) {
			if(mouseDown) {
				move(e);
				updateLastCoords(e);
			}
		});
		function move(e) {
			const k = 1.0;
			var dx = e.pageX - mouseLastCoords.x;
			var dy = e.pageY - mouseLastCoords.y;

			camera.position.x -= dx * k / camera.zoom;
			camera.position.y += dy * k / camera.zoom;
		}
		function updateLastCoords(e) {
			mouseLastCoords.x = e.pageX;
			mouseLastCoords.y = e.pageY;
		}
	};
});

define(['jquery'], function ($) {
	return function (ctx, TRANSFORM) {
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
			var dx = e.pageX - mouseLastCoords.x;
			var dy = e.pageY - mouseLastCoords.y;
			TRANSFORM.x += dx;
			TRANSFORM.y += dy;
			ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		}
		function updateLastCoords(e) {
			mouseLastCoords.x = e.pageX;
			mouseLastCoords.y = e.pageY;
		}
	};
});

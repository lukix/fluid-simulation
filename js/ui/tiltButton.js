define(['jquery'], function ($) {
	return function (world) {
		var tilting = true;
		const STEP = 0.25;
		var step = STEP;
		var lastFrameTime = (new Date()).getTime();
		var gravity = world.gravity.y;
		var rotation = 0;
		setTimeout(function () {
			step = 0;
			setTimeout(function () {
				step = -STEP;
				setTimeout(function () {
					tilting = false;
					$('#canvas').css({transform: "rotate(0rad)"});
					adjustGravity();
				}, 1200);
			}, 3000);
		}, 1200);
		(function tilt() {
			if(!tilting)
				return;
			var time = (new Date()).getTime();
			var dt = (time - lastFrameTime);
			lastFrameTime = time;
			rotation += step*dt/1000;
			$('#canvas').css({transform: "rotate("+rotation+"rad)"});
			adjustGravity();
			requestAnimationFrame(arguments.callee);
		})();
		function adjustGravity() {
			world.gravity.y = gravity * Math.cos(rotation);
			world.gravity.x = gravity * Math.sin(rotation);
		}
	};
});
requirejs.config({
	'paths': {
		'jquery': ['../lib/jquery-1.11.2.min']
	}
});
require(
	[
	],
	function($, initWorld, ui, showPerformanceData, nansDetector, PERFORMANCE) {
		var world = initWorld();
		var uiObj = ui(world);
		uiObj.init();
		(function () {
			var lastFrameTime = new Date().getTime();
			(function loop() {
				var time = new Date().getTime();
				var dt = (time - lastFrameTime);
				dt = dt > 100 ? 20 : dt;
				lastFrameTime = time;

				world.nextStep(dt);
				nansDetector(world.particles);
				showPerformanceData(world, dt);
				uiObj.render();
				requestAnimationFrame(loop);
			})();
		})();
		setInterval(function () {
			for(var item in PERFORMANCE.data) {
				console.log(item, ":  ", PERFORMANCE.getPartOf(item, "nextStep"));
			}
		}, 500);
	}
);

requirejs.config({
	'paths': {
		'jquery': ['../lib/jquery-1.11.2.min']
	}
});
require(
	[
		'jquery', 'initWorld', './ui/ui', './ui/showPerformanceData', './debug/nansDetector'
	],
	function($, initWorld, ui, showPerformanceData, nansDetector) {
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
	}
);

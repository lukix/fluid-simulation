define(['jquery'], function ($) {
	return function (world) {
		const dtN = 15;
		var lastDts = new Array(dtN);
		var lastFrameTime = (new Date()).getTime() - 10;
		(function loop() {
			var time = (new Date()).getTime();
			var dt = (time - lastFrameTime);
			lastFrameTime = time;
			if(dt > 100)
				dt = 30;
			lastDts.push(dt);
			lastDts.shift();
			
			var str = "";
			var avgDts = getAvgVal(lastDts);
			var avgFps = 1000/avgDts;
			var avgChecks = getAvgVal(world.en);
			str += avgFps.toFixed(1) + " fps";
			str += '<br />' + avgChecks.toFixed(0) + ' checks';
			str += '<br />' + (1000000*avgDts/avgChecks).toFixed(0) + ' ns/check';
			str += '<br />' + world.particles.length + ' particles';
			
			$('#fps').html(str);
			
			world.nextStep(dt);
			setTimeout(loop, 1);
		})();
		function getAvgVal(arr) {
			var sum = 0;
			for(var i = 0; i < arr.length; i++) {
				sum += arr[i];
			}
			var avgVal = sum / arr.length;
			return avgVal;
		}
	}
});
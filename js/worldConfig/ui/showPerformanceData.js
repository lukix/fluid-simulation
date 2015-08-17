define(['jquery'], function ($) {
	var lastDts = new Array(15);
	function loop(world, dt) {
		lastDts.push(dt);
		lastDts.shift();

		var avgDts = getAvgVal(lastDts);
		var avgFps = 1000/avgDts;
		var avgChecks = getAvgVal(world.en);
		var checkTime = 1000000*avgDts/avgChecks;

		updateDOM({
			  avgChecks: {value: avgChecks, text: "checks"}
			 ,checkTime: {value: checkTime, text: "ns/check"}
			 ,particlesNumber: {value: world.particles.length, text: "particles"}
		});

	}
	function updateDOM(data) {
		$('#fps').empty();
		for(var i in data) {
				$('#fps').append(
					$('<li>').html(data[i].value.toFixed(0) + ' ' + data[i].text)
				);
		}
	}
	function getAvgVal(arr) {
		var sum = 0;
		var n = 0;
		for(var i = 0; i < arr.length; i++) {
			if(!isNaN(arr[i])) {
				sum += arr[i];
				n++;
			}
		}
		return sum / n;
	}
	return loop;
});

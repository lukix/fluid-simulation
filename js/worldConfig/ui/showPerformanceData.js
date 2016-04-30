define(['jquery'], function ($) {
	var lastDts = new Array(15);
	var lis = document.getElementById("fps").children;

	function loop(world, dt) {
		lastDts.push(dt);
		lastDts.shift();

		var avgDts = getAvgVal(lastDts);
		var avgFps = 1000/avgDts;

		updateDOM([
			 {value: avgFps, text: "fps"}
			,{value: world.particles.length, text: "particles"}
		]);

	}
	function updateDOM(data) {
		for(var i = 0; i < data.length && i < lis.length; i++) {
			lis[i].innerHTML = data[i].value.toFixed(0) + ' ' + data[i].text;
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

define(function () {
	var NANS = 0;
	return function (particles) {
		var n = 0;
		for(var i = 0; i < particles.length; i++) {
			if(isNaN(particles[i].coords.x)) {
				n++;
			}
		}
		if(n!=NANS) {
			NANS = n;
			console.log(NANS);
		}
	};
});
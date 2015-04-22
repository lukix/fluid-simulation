define(['Particle'], function (Particle) {
	return function (world) {
		var rainClock = null;// = setInterval(rainGenerator, 100);
		function rainGenerator() {
			var drops = [];
			const MARGIN = 10;
			for(var i = 0; i < 1; i++) {
				drops.push(new Particle(MARGIN+Math.random()*(world.width-2*MARGIN), -Math.random()*50));
			}
			world.addParticles(drops);
		};
		$('#rainButton').click(function () {
			if(rainClock == null)
				rainClock = setInterval(rainGenerator, 100);
			else {
				clearInterval(rainClock);
				rainClock = null;
			}
		});
	}
});
$(window).load(function () {
	var res = runSpeedTest();
	$('#control-box').html(JSON.stringify(res, null, '	'));
	function runSpeedTest() {
		var result = {};
		const width = 1000;
		const height = 400;
		const particlesX = 60;
		const particlesY = 100;
		const dt = 10.0;
		const measurements = 50;
		
		result['WorldSize'] = width + 'x' + height;
		result['ParticlesGrid'] = particlesX + 'x' + particlesY + ' (' + (particlesX*particlesY) + ')';
		//*
		var world = new World(width, height).addParticlesGrid(particlesX, particlesY);
		result['nextStep'] = runSingleTest(world.nextStep, world, [dt], measurements);
		
		var world = new World(width, height).addParticlesGrid(particlesX, particlesY);
		result['applyViscosity'] = runSingleTest(world.applyViscosity, world, [dt], measurements);
		
		var world = new World(width, height).addParticlesGrid(particlesX, particlesY);
		result['applyDoubleDensityRelaxation'] = runSingleTest(world.applyDoubleDensityRelaxation, world, [], measurements);
		//*/
		/*
		var world = new World(width, height).addParticlesGrid(particlesX, particlesY);
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');
		result['render2'] = runSingleTest(world.render2, world, [ctx], measurements);
		//*/
		
		var world = new World(width, height).addParticlesGrid(particlesX, particlesY);
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');
		result['render'] = runSingleTest(world.render, world, [ctx], measurements);
		
		return result;
	}
	function runSingleTest(func, thisArg, args, testsNumber) {
		var startTime = (new Date()).getTime();
		for(var i = 0; i < testsNumber; i++) {
			func.apply(thisArg, args);
		}
		var avgTime = ((new Date()).getTime() - startTime) / testsNumber;
		return avgTime;
	}
});
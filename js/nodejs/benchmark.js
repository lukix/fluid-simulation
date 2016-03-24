var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});
requirejs(
	[
		'../fluid-simulation-engine/base/World'
		,'../fluid-simulation-engine/base/Particle'
		,'../fluid-simulation-engine/base/WaterParticle'
		,'./addBodies'
	], function(World, Particle, WaterParticle, addBodies) {
      const config = {
        particles_in_row: 40,
        particles_number: 1000
      };
  		var world = new World();
  		world.addParticlesGrid(config.particles_in_row, (config.particles_number/2)/config.particles_in_row, 200, -500, Particle);
  		world.addParticlesGrid(config.particles_in_row, (config.particles_number/2)/config.particles_in_row, 900, -500, WaterParticle);
  		addBodies(world);

      const framesTarget = 1000;
      console.log("Benchmark started!");
      var timeStart = new Date().getTime();
  		for(var frames = 1; frames <= framesTarget; frames++) {
  				world.nextStep(30/1000);
        var	progress = 100*frames/framesTarget;
        progress = progress>100 ? 100 : progress;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
  			process.stdout.write("Progress: " + progress.toFixed(1) + "%");
  		}
      var time = new Date().getTime() - timeStart;
      var frameAvgTime = time/framesTarget;
      console.log("\n Total time: %dms \n Time per frame: %sms", time, frameAvgTime.toFixed(2));
  }
);

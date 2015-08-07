var requirejs = require('requirejs');
var fs = require('fs');
requirejs.config({
    nodeRequire: require
});
requirejs(
	[
		'../fluid-simulation-engine/base/World'
		,'../fluid-simulation-engine/base/Particle'
		,'../fluid-simulation-engine/base/WaterParticle'
		,'../fluid-simulation-engine/base/Body'
		,'../fluid-simulation-engine/geometry/Vector'
		,'./addBodies'
		,'./Recorder'
	], function(World, Particle, WaterParticle, Body, Vector, addBodies, Recorder) {
    if(process.argv.length < 3) {
      console.log("Expected simulation config file name as program's parameter");
    }
    else {
      try {
        var configJSON = fs.readFileSync(process.argv[2]);
      } catch(e) {
        console.log('Error while reading config file');
        return;
      }
      try {
        var config = JSON.parse(configJSON);
      } catch(e) {
        console.log('Error while parsing config file');
        return;
      }

  		var world = new World(config.width, config.height);
  		world.addParticlesGrid(config.particles_in_row, config.particles_number/config.particles_in_row, 200, Particle);
  		world.addParticlesGrid(config.particles_in_row, config.particles_number/config.particles_in_row, 900, WaterParticle);
  		addBodies(world, config.width, config.height);

  		console.log("Recording started!");
  		var time = new Date().getTime();
  		var recorder = new Recorder(world, config.frame_time);
  		for(var t = 0; t < config.recording_time; t+=config.frame_time) {
  			recorder.addFrame(config.decimal_places);
  			for(var i = 0; i < config.steps_per_frame; i++) {
  				world.nextStep(config.frame_time/config.steps_per_frame);
  			}
        var	progress = 100*(t+config.frame_time)/config.recording_time;
        progress = progress>100 ? 100 : progress;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
  			process.stdout.write("Progress: " + progress.toFixed(1) + "%");
  		}
  		console.log('\nWriting to file');
  		if(recorder.saveToFile(config.file_name)) {
  			console.log('Simulation saved to file "' + config.file_name + '"');
  			console.log('Time: ' + (new Date().getTime() - time) + "ms");
  		}
  		else
  			console.log('Error while writing to file');
  	}
  }
);

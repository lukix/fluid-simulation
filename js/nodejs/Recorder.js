define([], function () {
	var fs = require('fs');
	function Recorder(world, frameTime) {
		this.data = {
			 frameTime: frameTime
			,width: world.width
			,height: world.height
			,frames: []
		};
		this.world = world;
	}
	Recorder.prototype.addFrame = function (acc) {	//acc - how many decimal places
		if(typeof acc === "undefined")
			acc = 0;
		var frame = {x: [], y: [], c: []};
		var particles = this.world.particles;
		for(var i = 0; i < particles.length; i++) {
			frame.x.push(Recorder.round(particles[i].coords.x, acc));
			frame.y.push(Recorder.round(particles[i].coords.y, acc));
			frame.c.push(particles[i].color.substring(1));	//Substring removes '#' from color to reduce size
		}
		this.data.frames.push(frame);
	}
	Recorder.round = function (number, acc) {
		var p = Math.pow(10, acc);
		return Math.round(number*p)/p;
	}
	Recorder.prototype.saveToFile = function (fileName) {
		var success = true;
		fs.writeFile(fileName, JSON.stringify(this.data), function(err) {
			if(err)
				success = false;
		});
		return success;
	}
	return Recorder;
});
define([], function () {
	var fs = require('fs');
	function Recorder(world, frameTime, file) {
		this.frameTime = frameTime;
		this.world = world;
		this.filePosition = 0;
		this.file = file;
	}
	Recorder.prototype.initFile = function () {
		/*
		 	frame time - Uint32Array - 4 bytes
			width -  Uint32Array - 4 bytes
			height - Uint32Array - 4 bytes
		*/
		var bufferLength = 3 * 4;
		var buffer = new Buffer(bufferLength);
		buffer.writeUInt32LE(this.frameTime, 0*4);
		buffer.writeUInt32LE(this.world.width, 1*4);
		buffer.writeUInt32LE(this.world.height, 2*4);
		fs.writeSync(this.file, buffer, 0, bufferLength);
		this.filePosition += bufferLength;
	}
	Recorder.prototype.saveFrameToFile = function () {
		/*
			number of particles in frame - Uint32Array - 4 bytes
			For each particle:
				particle[i].coords.x - Float32Array - 4 bytes
				particle[i].coords.y - Float32Array - 4 bytes
				particle[i].color - Uint32Array - 4 bytes
		*/
		var bufferLength = 4 + this.world.particles.length * (4 + 4 + 4);
		var buffer = new Buffer(bufferLength);
		buffer.writeUInt32LE(this.world.particles.length, 0);
		for(var i = 0; i < this.world.particles.length; i++) {
			var color = this.world.particles[i].color.substring(1);
			if(color.length == 3)
				color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2];
			buffer.writeFloatLE(this.world.particles[i].coords.x, 4*(1+3*i+0));
			buffer.writeFloatLE(this.world.particles[i].coords.y, 4*(1+3*i+1));
			buffer.writeUInt32LE(parseInt(color, 16), 4*(1+3*i+2));
		}
		fs.writeSync(this.file, buffer, 0, bufferLength, this.filePosition);
		this.filePosition += bufferLength;
	}
	return Recorder;
});

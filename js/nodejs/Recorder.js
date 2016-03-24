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
		*/
		var bufferLength = 1 * 4;
		var buffer = new Buffer(bufferLength);
		buffer.writeUInt32LE(this.frameTime, 0*4);
		fs.writeSync(this.file, buffer, 0, bufferLength);
		this.filePosition += bufferLength;
	}
	Recorder.prototype.saveFrameToFile = function () {
		/*
			frame size - Uint32Array - 4 bytes
			number of particles in frame - Uint32Array - 4 bytes
			For each body:
				bodies[i].verticles.length
				For each verticle:
					bodies[i].verticles[j].x - Float32Array - 4 bytes
					bodies[i].verticles[j].y - Float32Array - 4 bytes
			For each particle:
				particle[i].coords.x - Float32Array - 4 bytes
				particle[i].coords.y - Float32Array - 4 bytes
				particle[i].color - Uint32Array - 4 bytes
		*/
		var bufferLength = this.getFrameSize();
		var buffer = new Buffer(bufferLength);
		var offset = 0;
		buffer.writeUInt32LE(bufferLength, 0);
		buffer.writeUInt32LE(this.world.particles.length, 1 * 4);
		offset += 2 * 4;
		for(var i = 0; i < this.world.bodies.length; i++) {
			buffer.writeUInt32LE(this.world.bodies[i].sides.length, offset);
			offset += 4;
			for(var j = 0; j < this.world.bodies[i].sides.length; j++) {
				buffer.writeFloatLE(this.world.bodies[i].coords.x + this.world.bodies[i].sides[j].p1.x, offset);
				buffer.writeFloatLE(this.world.bodies[i].coords.y + this.world.bodies[i].sides[j].p1.y, offset + 4);
				offset += 2 * 4;
			}
		}
		for(var i = 0; i < this.world.particles.length; i++) {
			var color = this.world.particles[i].color.substring(1);
			if(color.length === 3)
				color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2];
			buffer.writeFloatLE(this.world.particles[i].coords.x, offset + 0 * 4);
			buffer.writeFloatLE(this.world.particles[i].coords.y, offset + 1 * 4);
			buffer.writeUInt32LE(parseInt(color, 16), offset + 2 * 4);
			offset += 3 * 4;
		}
		fs.writeSync(this.file, buffer, 0, bufferLength, this.filePosition);
		this.filePosition += bufferLength;
	}
	Recorder.prototype.getFrameSize = function () {
		var frameSize = (1 + 1 + this.world.particles.length * 3) * 4;
		for(var i = 0; i < this.world.bodies.length; i++) {
			frameSize += (1 + this.world.bodies[i].sides.length * 2) * 4;
		}
		return frameSize;
	}
	return Recorder;
});

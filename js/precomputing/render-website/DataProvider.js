define(['../../fluid-simulation-engine/geometry/Vector'], function (Vector) {
		function DataProvider(file, readyCallback) {
			this.file = file;
			this.bytesRead = 0;

			this.nextFrameParticlesNumber;
			this.nextFrameSize;

			this.simulationData = {
				 frameTime: null
				,frames: []
			};
			this.loadedFrames = 5;
			this.endOfData = false;
			var THIS = this;
			this.init(function () {
				THIS.readFrames(function (last) {
					if(last)
						readyCallback();
				});
			});
		}
		DataProvider.prototype.init = function (callback) {
			var reader = new FileReader(this.file);
			this.readNextSlice(reader, 3*4);
			var THIS = this;
			reader.onload = function (e) {
				var buffer = e.target.result;
				var uint32View = new Uint32Array(buffer);
				THIS.simulationData.frameTime = uint32View[0];
				THIS.nextFrameSize = uint32View[1];
				THIS.nextFrameParticlesNumber = uint32View[2];
				callback();
			}
		}
		DataProvider.prototype.readFrames = function (callback) {
			if(this.simulationData.frames.length >= this.loadedFrames || this.endOfData) {
				callback.call(this, true, false);
				return;
			}
			var reader = new FileReader(this.file);
			this.readNextSlice(reader, this.nextFrameSize);
			var THIS = this;
			reader.onload = function (e) {
				var buffer = e.target.result;
				if(buffer.byteLength < THIS.nextFrameSize) {
					THIS.endOfData = true;
				}
				else {
					var uint32View = new Uint32Array(buffer);
					var float32View = new Float32Array(buffer);
					var frame = {
						 particles: []
						,bodies: []
					};

					//Bodies
					var bodiesPieceSize = (THIS.nextFrameSize - THIS.nextFrameParticlesNumber * 3 * 4 - 2 * 4) / 4;
					var piecesRead = 0;
					while(piecesRead < bodiesPieceSize) {
						var numberOfVerticles = uint32View[piecesRead];
						piecesRead++;
						var body = [];
						for(var j = 0; j < numberOfVerticles; j++) {
							body.push(new Vector(
								 float32View[piecesRead]
								,float32View[piecesRead + 1]
							));
							piecesRead += 2;
						}
						frame.bodies.push(body);
					}

					//Particles
					for(var i = 0; i < THIS.nextFrameParticlesNumber; i++) {
						frame.particles.push({
							 x: float32View[bodiesPieceSize + i*3+0]
							,y: float32View[bodiesPieceSize + i*3+1]
							,color: uint32View[bodiesPieceSize + i*3+2]
						});
					}

					THIS.simulationData.frames.unshift(frame);
					THIS.nextFrameSize = uint32View[buffer.byteLength/4-2];
					THIS.nextFrameParticlesNumber = uint32View[buffer.byteLength/4-1];
					if(THIS.simulationData.frames.length < THIS.loadedFrames) {
						callback.call(this, false, true);
						THIS.readNextSlice(reader, THIS.nextFrameSize);
					}
					else
						callback.call(this, true, true);
				}
			}
		}
		DataProvider.prototype.readNextSlice = function (reader, size) {
			reader.readAsArrayBuffer(this.file.slice(this.bytesRead, this.bytesRead+size));
			this.bytesRead += size;
		}
		return DataProvider;
});

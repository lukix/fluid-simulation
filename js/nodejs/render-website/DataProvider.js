define([], function () {
		function DataProvider(file, readyCallback) {
			this.file = file;
			this.bytesRead = 0;
			this.nextFrameParticlesNumber = 0;
			this.simulationData = {
				 frameTime: null
				,width: null
				,height: null
				,frames: []
			};
			this.loadedFrames = 40;
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
			this.readNextSlice(reader, 4*4);
			var THIS = this;
			reader.onload = function (e) {
				var buffer = e.target.result;
				var uint32View = new Uint32Array(buffer);
				THIS.simulationData.frameTime = uint32View[0];
				THIS.simulationData.width = uint32View[1];
				THIS.simulationData.height = uint32View[2];
				THIS.nextFrameParticlesNumber = uint32View[3];
				callback();
			}
		}
		DataProvider.prototype.readFrames = function (callback) {
			if(this.simulationData.frames.length >= this.loadedFrames || this.endOfData) {
				callback.call(this, true, false);
				return;
			}
			var reader = new FileReader(this.file);
			this.readNextSlice(reader, 4*(3*this.nextFrameParticlesNumber+1));
			var THIS = this;
			reader.onload = function (e) {
				var buffer = e.target.result;
				var uint32View = new Uint32Array(buffer);
				var float32View = new Float32Array(buffer);
				var frame = [];
				for(var i = 0; i < THIS.nextFrameParticlesNumber; i++) {
					if(i*3+2 >= uint32View.length)
						THIS.endOfData = true;
					frame.push({
						 x: float32View[i*3+0]
						,y: float32View[i*3+1]
						,color: "#"+DataProvider.decimalToHex(uint32View[i*3+2], 6)
					});
				}
				THIS.simulationData.frames.unshift(frame);
				THIS.nextFrameParticlesNumber = uint32View[buffer.byteLength/4-1];
				if(THIS.simulationData.frames.length < THIS.loadedFrames) {
					callback.call(this, false, true);
					THIS.readNextSlice(reader, 4*(3*THIS.nextFrameParticlesNumber+1));
				}
				else
					callback.call(this, true, true);
			}
		}
		DataProvider.prototype.readNextSlice = function (reader, size) {
			reader.readAsArrayBuffer(this.file.slice(this.bytesRead, this.bytesRead+size));
			this.bytesRead += size;
		}
		DataProvider.decimalToHex = function(d, padding) {
		    var hex = Number(d).toString(16);
		    padding = typeof (padding) === "undefined" || padding === null ? padding = 6 : padding;
		    while (hex.length < padding) {
		        hex = "0" + hex;
		    }
		    return hex;
		}
		return DataProvider;
});

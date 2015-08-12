define([], function () {
	return function(dataProvider, world, ctx, callback) {
		var startTime = new Date().getTime();
		var startOffset = dataProvider.simulationData.frames.length - 1;
		var offset = 0;
		(function render() {
			var dt = new Date().getTime()-startTime;
			var frameIndex = Math.round(startOffset+offset-dt/dataProvider.simulationData.frameTime);
			if(frameIndex < 0)
				callback();
			else {
				var frame = dataProvider.simulationData.frames[frameIndex];
				dataProvider.simulationData.frames.splice(frameIndex+1, dataProvider.simulationData.frames.length-(frameIndex+1));
				ctx.clearRect(0, 0, world.width*2, world.height*2);
				for(var i = 0; i < frame.length; i++) {
					ctx.fillStyle = frame[i].color;
					ctx.fillRect(frame[i].x, frame[i].y, 4, 4);
				}
				world.render(ctx);
				dataProvider.readFrames(function (last, addedSth) {
					if(addedSth)
						offset++;
				});
				requestAnimationFrame(render);
			}
		})();
	}
});

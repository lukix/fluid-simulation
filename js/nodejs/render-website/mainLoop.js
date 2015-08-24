define(['./render'], function (render) {
	return function(dataProvider, ctx, myCanvas, callback) {
		var startTime = new Date().getTime();
		var startOffset = dataProvider.simulationData.frames.length - 1;
		var offset = 0;
		(function loop() {
			var dt = new Date().getTime()-startTime;
			var frameIndex = Math.round(startOffset+offset-dt/dataProvider.simulationData.frameTime);
			if(frameIndex < 0)
				callback();
			else {
				var frame = dataProvider.simulationData.frames[frameIndex];
				dataProvider.simulationData.frames.splice(frameIndex+1, dataProvider.simulationData.frames.length-(frameIndex+1));
				render(ctx, myCanvas, frame);

				dataProvider.readFrames(function (last, addedSth) {
					if(addedSth)
						offset++;
				});
				requestAnimationFrame(loop);
			}
		})();
	}
});

define([], function () {
	return function(simulationData, world, ctx, callback) {
		var startTime = new Date().getTime();
		(function render() {
			var frameNumber = Math.round((new Date().getTime()-startTime)/simulationData.frameTime);
			if(frameNumber < simulationData.frames.length) {
				ctx.clearRect(0, 0, myCanvas.width*2, myCanvas.height*2);
				var frame = simulationData.frames[frameNumber];
				for(var i = 0; i < frame.x.length; i++) {
					ctx.fillStyle = "#"+frame.c[i];
					ctx.fillRect(frame.x[i], frame.y[i], 4, 4);
				}
				for(var i = 0; i < world.bodies.length; i++) {
					world.bodies[i].render(ctx);
				}
				requestAnimationFrame(render);
			}
			else {
					callback();
			}
		})();
	}
});

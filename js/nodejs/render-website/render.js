define([], function () {
	return function(ctx, myCanvas, frame, world) {
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
		ctx.restore();

		for(var i = 0; i < frame.length; i++) {
			ctx.fillStyle = frame[i].color;
			ctx.fillRect(frame[i].x, frame[i].y, 4, 4);
		}
		world.render(ctx);
	}
});

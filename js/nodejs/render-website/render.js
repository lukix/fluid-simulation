define([], function () {
	return function(ctx, myCanvas, frame) {
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
		ctx.restore();

		for(var i = 0; i < frame.particles.length; i++) {
			ctx.fillStyle = frame.particles[i].color;
			ctx.fillRect(frame.particles[i].x, frame.particles[i].y, 4, 4);
		}
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		for(var i = 0; i < frame.bodies.length; i++) {
			ctx.beginPath();
			ctx.moveTo(frame.bodies[i][0].x, frame.bodies[i][0].y);
			for(var j = 1; j < frame.bodies[i].length; j++) {
				ctx.lineTo(frame.bodies[i][j].x, frame.bodies[i][j].y);
			}
			ctx.closePath();
			ctx.fill();
		}
	}
});

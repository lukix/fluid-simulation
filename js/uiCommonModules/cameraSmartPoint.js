define([], function () {
	return function (ctx, TRANSFORM, myCanvas, world) {
		const MARGIN = 1.1;
		if(world.bodies.length == 0)
			return false;
		var minPoint = world.getBodiesMinPoint();
		var maxPoint = world.getBodiesMaxPoint();
		var realWidth = (maxPoint.x - minPoint.x);
		var realHeight = (maxPoint.y - minPoint.y);
		var scale_x = myCanvas.width / (realWidth * MARGIN);
		var scale_y = myCanvas.height / (realHeight * MARGIN);
		scale_x = scale_y = Math.min(scale_x, scale_y);

		TRANSFORM.scale_x = scale_x;
		TRANSFORM.scale_y = scale_y;
		TRANSFORM.x = -minPoint.x * scale_x + (myCanvas.width - realWidth * scale_x) / 2;
		TRANSFORM.y = -minPoint.y * scale_y + (myCanvas.height - realHeight * scale_y) / 2;

		ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		return true;
	};
});

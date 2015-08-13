define([], function () {
	return function (ctx, TRANSFORM, myCanvas, world) {
		const MARGIN = 1.1;
		if(world.bodies.length == 0)
			return false;
		var bounds = findBoundaries();
		var realWidth = (bounds.maxPoint.x - bounds.minPoint.x);
		var realHeight = (bounds.maxPoint.y - bounds.minPoint.y);
		var scale_x = myCanvas.width / (realWidth * MARGIN);
		var scale_y = myCanvas.height / (realHeight * MARGIN);
		scale_x = scale_y = Math.min(scale_x, scale_y);

		TRANSFORM.scale_x = scale_x;
		TRANSFORM.scale_y = scale_y;
		TRANSFORM.x = -bounds.minPoint.x * scale_x + (myCanvas.width - realWidth * scale_x) / 2;
		TRANSFORM.y = -bounds.minPoint.y * scale_y + (myCanvas.height - realHeight * scale_y) / 2;

		ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		return true;

		function findBoundaries() {
			var minPoint = world.bodies[0].minPoint();
			var maxPoint = world.bodies[0].maxPoint();
			for(var i = 0; i < world.bodies.length; i++) {
				var min = world.bodies[i].minPoint();
				var max = world.bodies[i].maxPoint();
				if(min.x < minPoint.x)
					minPoint.x = min.x;
				if(min.y < minPoint.y)
					minPoint.y = min.y;
				if(max.x > maxPoint.x)
					maxPoint.x = max.x;
				if(max.y > maxPoint.y)
					maxPoint.y = max.y;
			}
			return {minPoint: minPoint, maxPoint: maxPoint};
		}
	};
});

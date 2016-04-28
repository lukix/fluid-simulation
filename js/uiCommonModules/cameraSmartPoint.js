define(['../fluid-simulation-engine/geometry/Polygon'], function (Polygon) {
	return function (camera, polygonsArr) {
		const MARGIN = 1.05;
		if(polygonsArr.length === 0)
			return false;
		var minPoint = Polygon.getMinPointOfPolygonsArray(polygonsArr);
		var maxPoint = Polygon.getMaxPointOfPolygonsArray(polygonsArr);
		var realWidth = (maxPoint.x - minPoint.x);
		var realHeight = (maxPoint.y - minPoint.y);

		camera.position.x = minPoint.x + realWidth/2;
		camera.position.y = minPoint.y + realHeight/2;
		camera.zoom = 1/MARGIN / Math.max(
			 realWidth / (camera.right - camera.left)
			,realHeight / (camera.bottom - camera.top)
		);
		camera.updateProjectionMatrix();
		return true;
	};
});

requirejs.config({
	'paths': {
		'jquery': ['../../lib/jquery-1.11.2.min']
	}
});
require(
	[
		 'jquery'
		,'./fileHandling'
		,'../../uiCommonModules/mouseCameraMove'
		,'../../uiCommonModules/mouseCameraZoom'
	], function($, fileHandling, mouseCameraMove, mouseCameraZoom) {

		var myCanvas = document.getElementById('canvas');
		myCanvas.width = $(myCanvas).width();
		myCanvas.height = $(myCanvas).height();
		var ctx = myCanvas.getContext('2d');
		var TRANSFORM = {x: 0, y: 0, scale_x: 1, scale_y: 1};
		ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);

		$(window).resize(function () {
			myCanvas.width = $(myCanvas).width();
			myCanvas.height = $(myCanvas).height();
			ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		});

		if(!fileHandling(ctx, myCanvas, TRANSFORM))
			console.log("Your browser doesn't support file API");

		mouseCameraMove(ctx, TRANSFORM);
		mouseCameraZoom(ctx, TRANSFORM);
	}
);

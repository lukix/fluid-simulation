requirejs.config({
	'paths': {
		'jquery': ['../../lib/jquery-1.11.2.min']
	}
});
require(
	[
		 'jquery'
		,'./ui'
	], function($, ui, addBodies) {
		var ctx = (function () {
			var myCanvas = document.getElementById('canvas');
			myCanvas.width = $(myCanvas).width();
			myCanvas.height = $(myCanvas).height();
			var ctx = myCanvas.getContext('2d');
			const ZOOM = 0.9;
			ctx.scale(ZOOM, ZOOM);
			return ctx;
		})();
		if(!ui(ctx)) {
			console.log("Your browser doesn't support file API");
		}
	}
);

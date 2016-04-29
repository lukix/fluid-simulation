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
		var renderer = new THREE.WebGLRenderer({canvas: myCanvas});
		renderer.setPixelRatio(2.0);
		var camera = new THREE.OrthographicCamera(-$(myCanvas).width()/2, $(myCanvas).width()/2, -$(myCanvas).height()/2, $(myCanvas).height()/2, -1000, 1000);

		camera.rotation.x = 180 * Math.PI / 180;

		var THIS = this;
		$(window).resize(function () {
			camera.left = -$(myCanvas).width()/2;
			camera.right = $(myCanvas).width()/2;
			camera.top = -$(myCanvas).height()/2;
			camera.bottom = $(myCanvas).height()/2;
			camera.updateProjectionMatrix();
		});

		if(!fileHandling(renderer, camera))
			console.log("Your browser doesn't support file API");

		mouseCameraMove(camera);
		mouseCameraZoom(camera);
	}
);

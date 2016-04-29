define(['jquery', '../lib/jquery.mousewheel.min'], function ($, jqueryMouseWheel) {
	return function (camera) {
		$('#canvas').mousewheel(function (e) {
			if(e.originalEvent.deltaY === 0)
				return;
			const K = 1.1;
			if(e.originalEvent.deltaY > 0) {
				camera.zoom *= K;
			}
			else {
				camera.zoom /= K;
			}
			camera.updateProjectionMatrix();
		});
	};
});

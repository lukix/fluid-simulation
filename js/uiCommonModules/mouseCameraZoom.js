define(['jquery', '../lib/jquery.mousewheel.min'], function ($, jqueryMouseWheel) {
	return function (ctx, TRANSFORM) {
		$('#canvas').mousewheel(function (e) {
			if(e.originalEvent.deltaY === 0)
				return;
			var scroll = 100;
			var k = 0.011;
			var f_scale = scroll * k;
			var translate_x = (e.pageX- TRANSFORM.x) * (1 - f_scale);
			var translate_y = (e.pageY - TRANSFORM.y) * (1 - f_scale);

			if(e.originalEvent.deltaY > 0) {
				TRANSFORM.x += translate_x;
				TRANSFORM.y += translate_y;
				TRANSFORM.scale_x *= f_scale;
				TRANSFORM.scale_y *= f_scale;
			}
			else {
				TRANSFORM.x -= translate_x;
				TRANSFORM.y -= translate_y;
				TRANSFORM.scale_x /= f_scale;
				TRANSFORM.scale_y /= f_scale;
			}
			ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		});
	};
});

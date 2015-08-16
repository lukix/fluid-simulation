define(
  [
    'jquery'
    ,'./mainLoop'
		,'./buttons'
		,'./mouseRepulsor'
		,'../../uiCommonModules/mouseCameraMove'
		,'../../uiCommonModules/mouseCameraZoom'
		,'../../uiCommonModules/cameraSmartPoint'
  ], function ($, mainLoop, buttons, mouseRepulsor, mouseCameraMove, mouseCameraZoom, cameraSmartPoint) {
	return function (world) {
    var ctx;
    var TRANSFORM = {x: 0, y: 0, scale_x: 1, scale_y: 1};
    var myCanvas = document.getElementById('canvas');

		myCanvas.width = $(myCanvas).width();
		myCanvas.height = $(myCanvas).height();
		if (!(ctx = myCanvas.getContext('2d')))
			return false;
		ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);

		(function render() {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
			ctx.restore();

			world.render(ctx);
			requestAnimationFrame(render);
		})();

    mainLoop(world);
    cameraSmartPoint(ctx, TRANSFORM, myCanvas, world);
		mouseRepulsor(world, TRANSFORM);
		mouseCameraMove(ctx, TRANSFORM);
		mouseCameraZoom(ctx, TRANSFORM);

		$(window).resize(function () {
			myCanvas.width = $(myCanvas).width();
			myCanvas.height = $(myCanvas).height();
			ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
		});
		$('#gravityChangerButton').click(function () {
			buttons.changeGravity(world);
		});
		$('#show').click(function () {
			$('#rest').slideToggle();
		});

  }
});

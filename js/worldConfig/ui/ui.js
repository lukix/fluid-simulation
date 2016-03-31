define(
  [
    'jquery'
		,'./buttons'
		,'./mouseRepulsor'
		,'../../uiCommonModules/mouseCameraMove'
		,'../../uiCommonModules/mouseCameraZoom'
		,'../../uiCommonModules/cameraSmartPoint'
  ], function ($, buttons, mouseRepulsor, mouseCameraMove, mouseCameraZoom, cameraSmartPoint) {
    return function (world) {
      return {
        ctx: null,
        myCanvas: null,
        TRANSFORM: {x: 0, y: 0, scale_x: 1, scale_y: 1},
        init: function () {
          this.myCanvas = document.getElementById('canvas');
          this.ctx = this.myCanvas.getContext('2d');

      		onresize(this.myCanvas, this.ctx, this.TRANSFORM);

          cameraSmartPoint(this.ctx, this.TRANSFORM, this.myCanvas, world.bodies);
      		mouseRepulsor(world, this.TRANSFORM);
      		mouseCameraMove(this.ctx, this.TRANSFORM);
      		mouseCameraZoom(this.ctx, this.TRANSFORM);

          var THIS = this;
      		$(window).resize(function () {
            onresize(THIS.myCanvas, THIS.ctx, THIS.TRANSFORM);
          });
      		$('#gravityChangerButton').click(function () {
      			buttons.changeGravity(world);
      		});
      		$('#show').click(function () {
      			$('#rest').slideToggle();
      		});

          function onresize (myCanvas, ctx, TRANSFORM) {
            myCanvas.width = $(myCanvas).width();
            myCanvas.height = $(myCanvas).height();
            ctx.setTransform(TRANSFORM.scale_x, 0, 0, TRANSFORM.scale_y, TRANSFORM.x, TRANSFORM.y);
          }

        },
        render: function () {
          this.ctx.save();
          this.ctx.setTransform(1, 0, 0, 1, 0, 0);
          this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
          this.ctx.restore();
          world.render(this.ctx);
          if($("#showGrid").prop("checked"))
            world.grid.render(this.ctx);
        }

      }
    }
});

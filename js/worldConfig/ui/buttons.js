define(['jquery', '../../fluid-simulation-engine/geometry/Vector'], function ($, Vector) {
	return {
    changeGravity: function (world) {
      var g = world.getGravity();
      var gx = g.x;
			var gy = g.y;
			gx = gy + (gy = gx, 0);  //Swap values
			world.setGravity(new Vector(-gx, gy));
    }
  }
});

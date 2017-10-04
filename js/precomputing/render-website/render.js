define([], function () {
	return function(camera, renderer, scene, geometry, frame) {
		
		for(var i = 0; i < geometry.vertices.length; i++) {
			var x = frame.particles[i].x;
			var y = frame.particles[i].y;
			geometry.vertices[i].x = x;
			geometry.vertices[i].y = y;
		}

		renderer.render(scene, camera);
	}
});

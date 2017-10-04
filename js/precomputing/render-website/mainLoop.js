define(['./render'], function (render) {
	return function(dataProvider, camera, renderer, callback) {
		var startTime = new Date().getTime();
		var startOffset = dataProvider.simulationData.frames.length - 1;
		var offset = 0;

		var firstFrame = dataProvider.simulationData.frames[0];

		var particlesCount = firstFrame.particles.length;
		var scene = new THREE.Scene();
		var geometry = new THREE.Geometry();
		for (i = 0; i < particlesCount; i++) {
			var vertex = new THREE.Vector3(0, 0, 0);
			geometry.vertices.push(vertex);
		}
		geometry.colors = [];
		for( var i = 0; i < geometry.vertices.length; i++ )
				geometry.colors[i] = new THREE.Color(firstFrame.particles[i].color);

		var material = new THREE.PointsMaterial({size: 2, vertexColors: THREE.VertexColors, fog: false, sizeAttenuation: false});
		var particlesSystem = new THREE.Points(geometry, material);
		scene.add(particlesSystem);

		//Bodies:
		var shapes = [];
		for(var i = 0; i < firstFrame.bodies.length; i++) {
			var bodyShape = new THREE.Shape();
			bodyShape.moveTo(firstFrame.bodies[i][0].x, firstFrame.bodies[i][0].y);
			for(var j = 1; j < firstFrame.bodies[i].length; j++) {
				var p2 = firstFrame.bodies[i][j];
				bodyShape.lineTo(p2.x, p2.y);
			}
			shapes.push(bodyShape);
		}
		var bodyGeom = new THREE.ShapeGeometry(shapes);
		var bodyMesh = new THREE.Mesh(bodyGeom, new THREE.MeshBasicMaterial({color: 0xcccccc})) ;
		scene.add(bodyMesh);


		(function loop() {
			var dt = new Date().getTime()-startTime;
			var frameIndex = Math.round(startOffset+offset-dt/dataProvider.simulationData.frameTime);
			if(frameIndex < 0)
				callback();
			else {
				var frame = dataProvider.simulationData.frames[frameIndex];
				dataProvider.simulationData.frames.splice(frameIndex+1, dataProvider.simulationData.frames.length-(frameIndex+1));
				render(camera, renderer, scene, geometry, frame);
				particlesSystem.geometry.verticesNeedUpdate = true;

				dataProvider.readFrames(function (last, addedSth) {
					if(addedSth)
						offset++;
				});
				requestAnimationFrame(loop);
			}
		})();
	}
});

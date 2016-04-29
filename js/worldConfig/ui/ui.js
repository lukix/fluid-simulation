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
        renderer: null,
        scene: null,
        camera: null,
        geometry: null,
        particlesSystem: null,
        init: function () {
          var myCanvas = document.getElementById('canvas');

          this.renderer = new THREE.WebGLRenderer({canvas: myCanvas});
          this.renderer.setPixelRatio(2.0);
          this.scene = new THREE.Scene();
          this.camera = new THREE.OrthographicCamera(-$(myCanvas).width()/2, $(myCanvas).width()/2, -$(myCanvas).height()/2, $(myCanvas).height()/2, -1000, 1000);

          this.camera.rotation.x = 180 * Math.PI / 180;

          this.addToScene();
      		mouseRepulsor(world, this.camera);
          mouseCameraMove(this.camera);
          mouseCameraZoom(this.camera);
          cameraSmartPoint(this.camera, world.bodies);

          var THIS = this;
      		$(window).resize(function () {
            THIS.camera.left = -$(myCanvas).width()/2;
            THIS.camera.right = $(myCanvas).width()/2;
            THIS.camera.top = -$(myCanvas).height()/2;
            THIS.camera.bottom = $(myCanvas).height()/2;
            THIS.camera.updateProjectionMatrix();
          });
      		$('#gravityChangerButton').click(function () {
      			buttons.changeGravity(world);
      		});
      		$('#show').click(function () {
      			$('#rest').slideToggle();
      		});
        },
        addToScene: function() {
          //Particles:
          this.geometry = new THREE.Geometry();
          for (i = 0; i < world.particles.length; i++) {
            var vertex = new THREE.Vector3(0, 0, 0);
            this.geometry.vertices.push(vertex);
          }
          this.geometry.colors = [];
          for( var i = 0; i < this.geometry.vertices.length; i++ )
              this.geometry.colors[i] = new THREE.Color(world.particles[i].color);

          var material = new THREE.PointsMaterial({size: 2, vertexColors: THREE.VertexColors, fog: false, sizeAttenuation: false});
          this.particlesSystem = new THREE.Points(this.geometry, material);
          this.scene.add(this.particlesSystem);

          //Bodies:
          var shapes = [];
          for(var i = 0; i < world.bodies.length; i++) {
            var bodyShape = new THREE.Shape();
            var start = world.bodies[i].coords;
            bodyShape.moveTo(start.x+world.bodies[i].sides[0].p1.x, start.y+world.bodies[i].sides[0].p1.y);
            for(var j = 0; j < world.bodies[i].sides.length; j++) {
              var p2 = world.bodies[i].sides[j].p2;
              bodyShape.lineTo(start.x+p2.x, start.y+p2.y);
            }
            shapes.push(bodyShape);
          }
          var bodyGeom = new THREE.ShapeGeometry(shapes);
          var bodyMesh = new THREE.Mesh(bodyGeom, new THREE.MeshBasicMaterial({color: 0xcccccc})) ;
          this.scene.add(bodyMesh);
        },
        updateVertices: function () {
          for(var i = 0; i < this.geometry.vertices.length; i++) {
            this.geometry.vertices[i].x = world.particles[i].coords.x;
            this.geometry.vertices[i].y = world.particles[i].coords.y;
          }
          this.particlesSystem.geometry.verticesNeedUpdate = true;
        },
        render: function () {
          this.updateVertices();
          this.renderer.render(this.scene, this.camera);
        }
      }
    }
});

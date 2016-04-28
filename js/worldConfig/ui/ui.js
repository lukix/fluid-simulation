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
        renderer: null,
        scene: null,
        camera: null,
        geometry: null,
        particlesSystem: null,
        init: function () {
          var myCanvas = document.getElementById('canvas');
          this.myCanvas = myCanvas;

          this.renderer = new THREE.WebGLRenderer({canvas: myCanvas});//antialiasing: true
          this.renderer.setPixelRatio(2.0);
          this.scene = new THREE.Scene();
          this.camera = new THREE.OrthographicCamera(-$(myCanvas).width()/2, $(myCanvas).width()/2, -$(myCanvas).height()/2, $(myCanvas).height()/2, -1000, 1000);

          this.camera.rotation.x = 180 * Math.PI / 180;
          //this.camera.rotation.z = 180 * Math.PI / 180;
          this.camera.position.x = 750;
          this.camera.position.y = 550;
          this.camera.position.z = 550;
          this.camera.zoom = 0.5;
          this.camera.updateProjectionMatrix();
          this.addToScene();

      		//onresize(this.myCanvas);
          /*
          cameraSmartPoint(this.ctx, this.TRANSFORM, this.myCanvas, world.bodies);
      		mouseRepulsor(world, this.TRANSFORM);
      		mouseCameraMove(this.ctx, this.TRANSFORM);
      		mouseCameraZoom(this.ctx, this.TRANSFORM);
          */
          mouseCameraMove(this.camera);
          mouseCameraZoom(this.camera);

          var THIS = this;
      		$(window).resize(function () {
            THIS.camera.aspect = $(myCanvas).width() / $(myCanvas).height();
            THIS.camera.updateProjectionMatrix();
            //onresize(THIS.myCanvas);
          });
      		$('#gravityChangerButton').click(function () {
      			buttons.changeGravity(world);
      		});
      		$('#show').click(function () {
      			$('#rest').slideToggle();
      		});

          function onresize (myCanvas) {
            myCanvas.width = $(myCanvas).width();
            myCanvas.height = $(myCanvas).height();
          }

        },
        addToScene: function() {
          //Particles:
          this.geometry = new THREE.Geometry();
          for (i = 0; i < world.particles.length; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = 0;
            vertex.y = 0;
            vertex.z = 0;
            this.geometry.vertices.push(vertex);
          }
          this.geometry.colors = [];
          for( var i = 0; i < this.geometry.vertices.length; i++ )
              this.geometry.colors[i] = new THREE.Color(0x4444ff);

          var material = new THREE.PointsMaterial({size: 2, vertexColors: THREE.VertexColors, fog: false, sizeAttenuation: false});
          this.particlesSystem = new THREE.Points(this.geometry, material);
          this.scene.add(this.particlesSystem);

          //Bodies:
          //*
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

          var ambientLight = new THREE.AmbientLight(0x0c0c0c);
          this.scene.add(ambientLight);
          //*/
        },
        render: function () {
          //console.log(this.geometry.vertices.length);
          //console.log(world.particles[0].coords.x);
          for(var i = 0; i < world.particles.length; i++) {
            this.geometry.vertices[i].x = world.particles[i].coords.x;
            this.geometry.vertices[i].y = world.particles[i].coords.y;
            //this.geometry.colors[i] =
          }
          this.particlesSystem.geometry.verticesNeedUpdate = true;
          this.renderer.render(this.scene, this.camera);
        }

      }
    }
});

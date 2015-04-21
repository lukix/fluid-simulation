var W=(function () {
	myCanvas = document.getElementById('canvas');
	myCanvas.width = $(myCanvas).width();
	myCanvas.height = $(myCanvas).height();
	if (!(ctx = myCanvas.getContext('2d')))
		return false;
	const zoom = 0.9;
	ctx.scale(zoom, zoom);
	var world = new World(myCanvas.width/zoom, myCanvas.height/zoom);
	/*
	const PARTICLES_NUMBER = 2000;
	const PARTICLES_IN_ROW = 100;
	world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, Particle);
	*/
	const PARTICLES_NUMBER = 700;
	const PARTICLES_IN_ROW = 25;
	world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 200, Particle);
	world.addParticlesGrid(PARTICLES_IN_ROW, PARTICLES_NUMBER/PARTICLES_IN_ROW, 900, WaterParticle);
	
	world.addBody(new Body(
		{x: 50, y: 50, angle: Math.PI/4},
		[{x: 25, y: 25}, {x: 25, y: -25}, {x: -25, y: -25}, {x: -25, y: 25}]
	));
	initCoeffsControls(world);
	console.log(world.particles.length);
	const dtN = 15;
	var lastDts = new Array(dtN);
	var lastFrameTime = (new Date()).getTime() - 10;
	(function loop() {
		var time = (new Date()).getTime();
		var dt = (time - lastFrameTime);
		lastFrameTime = time;
		if(dt > 100)
			dt = 30;
		lastDts.push(dt);
		lastDts.shift();
		
		var str = "";
		var avgDts = getAvgVal(lastDts);
		var avgFps = 1000/avgDts;
		var avgChecks = getAvgVal(world.en);
		str += avgFps.toFixed(1) + " fps";
		str += '<br />' + avgChecks.toFixed(0) + ' checks';
		str += '<br />' + (1000000*avgDts/avgChecks).toFixed(0) + ' ns/check';
		str += '<br />' + world.particles.length + ' particles';
		
		$('#fps').html(str);
		
		world.nextStep(dt);
		setTimeout(loop, 1);
	})();
	(function render() {
		world.render(ctx);
		requestAnimationFrame(render);
	})();
	//*
	function getAvgVal(arr) {
		var sum = 0;
		for(var i = 0; i < arr.length; i++) {
			sum += arr[i];
		}
		var avgVal = sum / arr.length;
		return avgVal;
	}
	setInterval(function () {
		for(var i = 0; i < world.particles.length; i++) {
			if(isNaN(world.particles[i].coords.x) || isNaN(world.particles[i].coords.y)) {
				console.log('NaNs detected!', world.particles[i]);
				throw new Error('NaN detected!');
			}
		}
	}, 5000);
	//*/
	var rainClock = null;// = setInterval(rainGenerator, 100);
	function rainGenerator() {
		var drops = [];
		const MARGIN = 10;
		for(var i = 0; i < 1; i++) {
			drops.push(new Particle(MARGIN+Math.random()*(world.width-2*MARGIN), -Math.random()*50));
		}
		world.addParticles(drops);
	};
	function initCoeffsControls(world) {
		for(var i in world.coeffs) {
			var labelElement = $('<label></label>');
			labelElement.attr('for', 'coeffs_'+i);
			labelElement.html(i);
			var inputElement = $('<input type="number" step="0.1">');
			inputElement.attr('placeholder', i);
			inputElement.attr('title', i);
			inputElement.attr('id', 'coeffs_'+i);
			inputElement.val(world.coeffs[i]);
			$('form#coeffs').append(inputElement);
			$('form#coeffs').append(labelElement);
			$('form#coeffs').append('<br />');
		}
		$('form#coeffs input[type=number]').change(function () {
			var coeffName = $(this).attr('id').substr('coeffs_'.length);
			val = parseFloat($(this).val());
			if(isNaN(val)) {
				$(this).addClass('validateError');
			}
			else {
				$(this).removeClass('validateError');
				var coeffs = {};
				coeffs[coeffName] = val;
				world.setCoeffs(coeffs);
			}
		});
	}
	$('form#coeffs').submit(function () {
		return false;
	});
	$('#rainButton').click(function () {
		if(rainClock == null)
			rainClock = setInterval(rainGenerator, 100);
		else {
			clearInterval(rainClock);
			rainClock = null;
		}
	});
	$('#gravityChangerButton').click(function () {
		//Swap values gx, gy
		var gx = world.gravity.x;
		var gy = world.gravity.y;
		gx = gy + (gy = gx, 0);
		world.setGravity({x: gx, y: gy});
	});
	$('#show').click(function () {
		$('#rest').toggle();
	});
	$('#tiltButton').click(function () {
		var tilting = true;
		const STEP = 0.25;
		var step = STEP;
		var lastFrameTime = (new Date()).getTime();
		var gravity = world.gravity.y;
		var rotation = 0;
		setTimeout(function () {
			step = 0;
			setTimeout(function () {
				step = -STEP;
				setTimeout(function () {
					tilting = false;
					$('#canvas').css({transform: "rotate(0rad)"});
					adjustGravity();
				}, 1200);
			}, 3000);
		}, 1200);
		(function tilt() {
			if(!tilting)
				return;
			var time = (new Date()).getTime();
			var dt = (time - lastFrameTime);
			lastFrameTime = time;
			rotation += step*dt/1000;
			$('#canvas').css({transform: "rotate("+rotation+"rad)"});
			adjustGravity();
			requestAnimationFrame(arguments.callee);
		})();
		function adjustGravity() {
			world.gravity.y = gravity * Math.cos(rotation);
			world.gravity.x = gravity * Math.sin(rotation);
		}
	});
	(function (world) {
		var mouseDown = false;
		var capturedParticles = [];
		const RADIUS = 100;
		$('#canvas').mousedown(function (e) {
			mouseDown = true;
			//capturedParticles = world.getNearestParticles({x: e.pageX, y: e.pageY}, RADIUS);
		});
		$('#canvas').mouseup(function (e) {
			mouseDown = false;
		});
		$('#canvas').mousemove(function (e) {
			if(!mouseDown) {
				return;
			}
			//document.title = e.pageX + ', ' + e.pageY;
		});
	})(world);
	return world;
})();
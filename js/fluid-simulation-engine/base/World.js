define(['./Grid', '../geometry/Vector', '../geometry/LineSegment'], function (Grid, Vector, LineSegment) {
	function World() {
		this.en = new Array(50);
		this.gravity = new Vector(0.0, 0.5);
		this.timeSpeed = 1.0/60;
		this.coeffs = {
			 h: 40				//Particles' distance from each other, at which they start interacting
		};
		this.particles = [];
		this.bodies = [];
		this.repulsiveForceSources = []; // {coords: {x: number, y: number}, strength: number}
		this.grid = new Grid(this.particles, this.coeffs.h);	//cellSize doesn't change when coeffs are changed!
		this.respawnCoords;
		this.isOutOfBoundsFunc = function (particle) {
			return false;
		}
	}
	World.prototype.setOutOfBoundsBehaviour = function (respawnCoords, isOutOfBoundsFunc) {
		this.isOutOfBoundsFunc = isOutOfBoundsFunc;
		this.respawnCoords = respawnCoords;
		return this;
	}
	World.prototype.setCoeffs = function (coeffs) {
		for(var i in coeffs) {
			this.coeffs[i] = coeffs[i];
		}
		this.grid.cellSize = this.coeffs.h;
		return this;
	}
	World.prototype.addBody = function (body) {
		this.bodies.push(body);
		return this;
	}
	World.prototype.getBodiesMinPoint = function () {
		if(this.bodies.length == 0)
			return null;
		var minPoint = this.bodies[0].minPoint();
		for(var i = 0; i < this.bodies.length; i++) {
			var min = this.bodies[i].minPoint();
			if(min.x < minPoint.x)
				minPoint.x = min.x;
			if(min.y < minPoint.y)
				minPoint.y = min.y;
		}
		return minPoint;
	}
	World.prototype.getBodiesMaxPoint = function () {
		if(this.bodies.length == 0)
			return null;
		var maxPoint = this.bodies[0].maxPoint();
		for(var i = 0; i < this.bodies.length; i++) {
			var max = this.bodies[i].maxPoint();
			if(max.x > maxPoint.x)
				maxPoint.x = max.x;
			if(max.y > maxPoint.y)
				maxPoint.y = max.y;
		}
		return maxPoint;
	}
	World.prototype.addRepulsiveForceSource = function (repulsiveForceSource) {
		this.repulsiveForceSources.push(repulsiveForceSource);
		return this;
	}
	World.prototype.addParticles = function (particles) {
		if(Array.isArray(particles))
			this.particles.push.apply(this.particles, particles);
		else
			this.particles.push(particles);
		return this;
	}
	World.prototype.addParticlesGrid = function (X, Y, startX, startY, particleClass) {
		var space = 0.355;
		var particlesArr = [];
		for(var x = 0; x < X; x++) {
			for(var y = 0; y < Y; y++) {
				particlesArr.push(
					new particleClass(
						 startX + x * this.coeffs.h * space
						,startY + y * this.coeffs.h * space
					)
				);
			}
		}
		this.addParticles(particlesArr);
		return this;
	}
	World.prototype.setGravity = function(gravity) {
		this.gravity.x = gravity.x;
		this.gravity.y = gravity.y;
		return this;
	}
	World.prototype.setIsOutOfBoundsFunc = function(func) {
		this.isOutOfBoundsFunc = func;
		return this;
	}
	World.prototype.nextStep = function (dt) {
		dt *= this.timeSpeed;

		//apply gravity
		for(var i in this.particles) {
			var mass = this.particles[i].coeffs.mass;
			this.particles[i].clearForces();
			this.particles[i].applyForce(this.gravity.x*mass, this.gravity.y*mass);
		}

		this.applyDoubleDensityRelaxation()
			.applyViscosity(dt)
			.applyRepulsiveForces()
			.applyBodiesCollisions()
			.respawnParticles();


		//Apply velocity and position change
		for(var i=0; i<this.particles.length; i++) {
			var forces = this.particles[i].getForces();
			var mass = this.particles[i].coeffs.mass;
			this.particles[i].changeVelocityBy(dt*forces.x/mass, dt*forces.y/mass);
			this.particles[i].clearForces();
			this.particles[i].changeCoordsBy(dt*this.particles[i].velocity.x, dt*this.particles[i].velocity.y);
		}
		return this;
	}
	World.prototype.applyDoubleDensityRelaxation = function () {
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].clearPressure();
		}
		this.grid.forEachPair(function (self, A, B) {
			var r = A.getDistance(B);
			var q = r / self.coeffs.h;
			if(q < 1) {
				var p = (1-q) * (1-q);
				var p_near = p * (1-q);
				A.increasePressure(p, p_near);
				B.increasePressure(p, p_near);
			}
		}, this);
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].setPressure(
				this.particles[i].coeffs.k*(this.particles[i].pressure.normal-this.particles[i].coeffs.p0),
				this.particles[i].coeffs.k_near*this.particles[i].pressure.near
			);
		}
		this.grid.forEachPair(function (self, A, B) {
			var r = A.getDistance(B);
			var q = r / self.coeffs.h;
			if(q < 1) {
				var xr = (A.coords.x-B.coords.x)/r;
				var yr = (A.coords.y-B.coords.y)/r;

				var a1=(A.pressure.normal*(1-q)+A.pressure.near*(1-q)*(1-q))/2;
				var a2=(B.pressure.normal*(1-q)+B.pressure.near*(1-q)*(1-q))/2;

				A.applyForce((a1+a2)*xr, (a1+a2)*yr);
				B.applyForce(-(a1+a2)*xr, -(a1+a2)*yr);
			}
		}, this);
		return this;
	}
	World.prototype.applyViscosity = function (dt) {
		this.grid.forEachPair(function (self, A, B) {
			var r = A.getDistance(B);
			var q = r / self.coeffs.h;
			if(q < 1) {
				var ux = A.velocity.x - B.velocity.x;
				var uy = A.velocity.y - B.velocity.y;
				var u = Math.sqrt(ux*ux+uy*uy);

				var visc_lin = A.coeffs.visc_lin * B.coeffs.visc_lin;
				var visc_qua = A.coeffs.visc_qua * B.coeffs.visc_qua;

				var I = (1-q)*(visc_lin*u+visc_qua*u*u);
				var Ix = (ux/u)*I;
				var Iy = (uy/u)*I;
				//*
				if(u == 0) {
					Ix = 0;
					Iy = 0;
				}
				//*/
				if(isNaN(Ix) || isNaN(Iy)) {
					console.error('Error');
					console.error(A.velocity.x, B.velocity.x);
					console.error(u, ux, uy, I, Ix, Iy);
				}
				//this.particles[i].applyForce(-Ix, -Iy);
				//this.particles[j].applyForce(Ix, Iy);

				A.changeVelocityBy(-dt*Ix, -dt*Iy);
				B.changeVelocityBy(dt*Ix, dt*Iy);
			}
		}, this);
		return this;
	}
	World.prototype.applyBodiesCollisions = function () {
		for(var i = 0; i < this.particles.length; i++) {
			for(var j = 0; j < this.bodies.length; j++) {
				var closestSide = this.bodies[j].getClosestSide(this.particles[i].coords);
				if(closestSide != null) {
					var relativeCoords = new Vector(this.particles[i].coords).subtract(this.bodies[j].coords);
					var projectedPoint = closestSide.getProjectedPoint(relativeCoords);
					projectedPoint.add(this.bodies[j].coords);
					var r = projectedPoint.getDistance(this.particles[i].coords);
					if(r < this.particles[i].coeffs.d_stick) {
						var F_stick =  this.particles[i].coeffs.k_stick * r * (1 - (r /  this.particles[i].coeffs.d_stick));
						var force = new LineSegment(projectedPoint, this.particles[i].coords).getUnitVector().multiplyBy(F_stick);
						if(this.bodies[j].containsPoint(this.particles[i].coords)) {
							this.particles[i].coords = this.bodies[j].getExtractedPoint(this.particles[i].coords);
							var vn = this.particles[i].velocity.getNormalVector(closestSide.getUnitVector());
							var vt = this.particles[i].velocity.getTangentVector(closestSide.getUnitVector());
							vt.multiplyBy(this.particles[i].coeffs.wall_friction);
							vn.invert().multiplyBy(this.particles[i].coeffs.wall_normal);
							var fn = this.particles[i].forces.getNormalVector(closestSide.getUnitVector());
							var ft = this.particles[i].forces.getTangentVector(closestSide.getUnitVector());
							ft.multiplyBy(this.particles[i].coeffs.wall_friction);
							fn.invert().multiplyBy(this.particles[i].coeffs.wall_normal);
							this.particles[i].velocity = vt.add(vn);
							this.particles[i].forces = ft.add(fn);
						}
					}
				}
			}
		}
		return this;
	}
	World.prototype.respawnParticles = function () {
		for(var i = 0; i < this.particles.length; i++) {
			if(this.isOutOfBoundsFunc(this.particles[i])) {
				this.particles[i].setCoords(this.respawnCoords.x, this.respawnCoords.y);
				this.particles[i].setVelocity(0, 0);
				this.particles[i].clearForces();
			}
		}
		return this;
	}
	World.prototype.applyRepulsiveForces = function () {
		for(var i = 0; i < this.repulsiveForceSources.length; i++) {
			for(var j = 0; j < this.particles.length; j++) {
				var r = this.particles[j].getDistance(this.repulsiveForceSources[i]);
				if(r != 0) {
					var F = - this.repulsiveForceSources[i].strength / (r * r);
					var Fx = F * (this.repulsiveForceSources[i].coords.x - this.particles[j].coords.x) / r;
					var Fy = F * (this.repulsiveForceSources[i].coords.y - this.particles[j].coords.y) / r;
					this.particles[j].applyForce(Fx, Fy);
				}
			}
		}
		return this;
	}
	World.prototype.render = function (ctx) {
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].render(ctx);
		}
		for(var i = 0; i < this.bodies.length; i++) {
			this.bodies[i].render(ctx);
		}
		return this;
	}
	return World;
});

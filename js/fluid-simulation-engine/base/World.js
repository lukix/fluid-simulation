define(
	[
		 './Grid'
		,'./BodiesGrid'
		,'../geometry/Vector'
		,'../geometry/LineSegment'
		,'../geometry/Polygon'
	], function (Grid, BodiesGrid, Vector, LineSegment, Polygon) {
	function World() {
		this.gravity = new Vector(0.0, -0.5);
		this.timeSpeed = 1.0/60;
		this.coeffs = {
			 h: 40	//Particles' interacting distance
		};
		this.particles = [];
		this.bodies = [];
		this.repulsiveForceSources = [];	//{coords: Vector, strength: number, isActive: bool}
		this.grid = new Grid(this.particles, this.coeffs.h);
		this.bodiesGrid = new BodiesGrid(this.bodies, 35);
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
		this.grid.setCellSize(this.coeffs.h);
		return this;
	}
	World.prototype.addBody = function (body) {
		this.bodies.push(body);
		this.bodiesGrid.bodiesHasChanged();
		return this;
	}
	World.prototype.getBodiesMinPoint = function () {
		return Polygon.getMinPointOfPolygonsArray(this.bodies);
	}
	World.prototype.getBodiesMaxPoint = function () {
		return Polygon.getMaxPointOfPolygonsArray(this.bodies);
	}
	World.prototype.addRepulsiveForceSource = function (repulsiveForceSource) {
		this.repulsiveForceSources.push(repulsiveForceSource);
		return this;
	}
	World.prototype.addParticles = function (particles) {
		if(Array.isArray(particles)) {
			for(var i = 0; i < particles.length; i++)
				this.particles.push(particles[i]);
		}
		else
			this.particles.push(particles);
		return this;
	}
	World.prototype.addParticlesGrid = function (X, Y, startX, startY, particleClass) {
		var space = 0.340;
		var particlesArr = [];
		for(var x = 0; x < X; x++) {
			for(var y = 0; y < Y; y++) {
				particlesArr.push(
					new particleClass(
						 startX + (x + (y % 2)/2) * this.coeffs.h * space
						,startY - y * this.coeffs.h * space
					)
				);
			}
		}
		this.addParticles(particlesArr);
		return this;
	}
	World.prototype.getGravity = function() {
		return new Vector(this.gravity.x, this.gravity.y);
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
	World.prototype.getTimeSpeed = function() {
		return this.timeSpeed;
	}
	World.prototype.setTimeSpeed = function(timeSpeed) {
		this.timeSpeed = timeSpeed;
		return this;
	}
	World.prototype.nextStep = function (dt) {
		const maxDt = 33;
		dt = dt > maxDt ? maxDt : dt;
		dt *= this.timeSpeed;
		this.grid.update();
		this.bodiesGrid.update();

		this.calculateParticlesPressures();
		this.grid.forEachPair(World.particlePairFunctions.ddr_and_visocity, this);
		this.applyRepulsiveForces();
		this.applyBodiesCollisions();
		this.respawnParticles();

		for(var i=0; i<this.particles.length; i++) {
			var forces = this.particles[i].getForces();
			var mass = this.particles[i].coeffs.mass;
			this.particles[i].changeVelocityBy(dt*forces.x/mass, dt*forces.y/mass);
			this.particles[i].changeCoordsBy(dt*this.particles[i].velocity.x, dt*this.particles[i].velocity.y);
			this.particles[i].setForces(this.gravity.x*mass, this.gravity.y*mass);
		}
		return this;
	}
	World.prototype.calculateParticlesPressures = function () {
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].clearPressure();
		}
		this.grid.forEachPair(World.particlePairFunctions.pressure, this);
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].setPressure(
				this.particles[i].coeffs.k*(this.particles[i].pressure.normal-this.particles[i].coeffs.p0),
				this.particles[i].coeffs.k_near*this.particles[i].pressure.near
			);
		}
		return this;
	}
	World.prototype.applyViscosity = function () {
		this.grid.forEachPair(World.particlePairFunctions.viscosity, this);
		return this;
	}
	World.prototype.applyBodiesCollisions = function () {
		var createStickingForceObj = function (particle) {
			var sumOfWeights = 0;
			var summaryForce = new Vector(0, 0);
			return {
				 add:	function (vectors) {
						for(var k = 0; k < vectors.length; k++) {
							var r = vectors[k].getLength();
							if(r < particle.coeffs.d_stick) {
								var a = r * (1 - (r /  particle.coeffs.d_stick));
								var F_stick = a * a;
								var force = vectors[k].multiplyBy(F_stick / r);
								sumOfWeights += a;
								summaryForce.add(force);
							}
						}
					}
				,apply: function () {
					var fc = summaryForce.multiplyBy(particle.coeffs.k_stick/sumOfWeights);
					particle.applyForce(fc.x, fc.y);
				}
			}
		}

		for(var i = 0; i < this.particles.length; i++) {
			var stickingForce = createStickingForceObj(this.particles[i]);

			this.bodiesGrid.forEachBody(this.particles[i], function (self, obj) {
				var vectors = BodiesGrid.getPotentialStickingForceVectors(self.particles[i], obj);

				if(vectors.length > 0) {
					var shortestVector = Vector.findTheShortestVector(vectors);
					var shortestLength = shortestVector.getLength();
					stickingForce.add(vectors);

					if(shortestLength < self.particles[i].coeffs.d_stick && obj.body.containsPoint(self.particles[i].coords)) {
						var wall_friction = self.particles[i].coeffs.wall_friction;
						var wall_normal = self.particles[i].coeffs.wall_normal;
						self.particles[i].coords = obj.body.getExtractedPoint(self.particles[i].coords);
						self.particles[i].velocity.multiplyNormalAndTangentComponents(shortestVector, wall_friction, -wall_normal);
						self.particles[i].forces.multiplyNormalAndTangentComponents(shortestVector, wall_friction, -wall_normal);
					}
				}
			}, this);
			stickingForce.apply();
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
		const maxF = 20;
		for(var i = 0; i < this.repulsiveForceSources.length; i++) {
			if(this.repulsiveForceSources[i].isActive) {
				for(var j = 0; j < this.particles.length; j++) {
					var r = this.particles[j].getDistance(this.repulsiveForceSources[i]);
					if(r !== 0) {
						var F = this.repulsiveForceSources[i].strength / (r * r);
						F = F > maxF ? maxF : F;

						var Fx = F * (this.repulsiveForceSources[i].coords.x - this.particles[j].coords.x) / r;
						var Fy = F * (this.repulsiveForceSources[i].coords.y - this.particles[j].coords.y) / r;
						this.particles[j].applyForce(-Fx, -Fy);
					}
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
	World.particlePairFunctions = {
		pressure: function (self, A, B) {
			var r = A.getDistance(B);
			var q = r / self.coeffs.h;
			if(q < 1) {
				var p = (1-q) * (1-q);
				var p_near = p * (1-q);
				A.increasePressure(p, p_near);
				B.increasePressure(p, p_near);
			}
		}
		,ddr_and_visocity: function (self, A, B) {
			var r = A.getDistance(B);
			var q = r / self.coeffs.h;
			if(q < 1) {
				//Double Density Relaxation:
				var xr = (A.coords.x-B.coords.x)/r;
				var yr = (A.coords.y-B.coords.y)/r;

				var a1=(A.pressure.normal*(1-q)+A.pressure.near*(1-q)*(1-q))/2;
				var a2=(B.pressure.normal*(1-q)+B.pressure.near*(1-q)*(1-q))/2;

				var ddrForceA = {x: (a1+a2)*xr, y: (a1+a2)*yr};
				var ddrForceB = {x: -(a1+a2)*xr, y: -(a1+a2)*yr};

				//Viscosity:
				var ux = A.velocity.x - B.velocity.x;
				var uy = A.velocity.y - B.velocity.y;
				var u = Math.sqrt(ux*ux+uy*uy);

				var visc_lin = A.coeffs.visc_lin * B.coeffs.visc_lin;
				var visc_qua = A.coeffs.visc_qua * B.coeffs.visc_qua;

				var I = (1-q)*(visc_lin*u+visc_qua*u*u);
				var Ix = (ux/u)*I;
				var Iy = (uy/u)*I;

				if(u === 0) {
					Ix = 0;
					Iy = 0;
				}
				var viscForceA = {x: -Ix+(a1+a2)*xr, y: -Iy+(a1+a2)*yr};
				var viscForceB = {x: Ix-(a1+a2)*xr, y: Iy-(a1+a2)*yr};

				//Apply forces:
				A.applyForce(ddrForceA.x + viscForceA.x, ddrForceA.y + viscForceA.y);
				B.applyForce(ddrForceB.x + viscForceB.x, ddrForceB.y + viscForceB.y);
			}
		}
	};
	return World;
});

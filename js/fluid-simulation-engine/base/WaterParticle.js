define(['./Particle', '../geometry/Vector', '../others/inheritFrom'], function (Particle, Vector, inheritFrom) {
	WaterParticle.inheritFrom = inheritFrom;
	function WaterParticle(x, y) {
		this.coords = new Vector(x, y);
		this.color = "#88f";
		this.init();
		this.coeffs = WaterParticle.coeffs;
	}
	WaterParticle.inheritFrom(Particle);
	WaterParticle.coeffs = {};
	for(var i in Particle.coeffs) {
		WaterParticle.coeffs[i] = Particle.coeffs[i];
	}
	WaterParticle.coeffs.mass = 0.6;

	return WaterParticle;
});

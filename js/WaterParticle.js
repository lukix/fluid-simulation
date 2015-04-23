define(['Particle'], function (Particle) {
	function WaterParticle(x, y) {
		this.coords = {x: x, y: y};
		this.color = "#00f";
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
define(['Particle'], function (Particle) {
	function WaterParticle(x, y) {
		this.coords = {x: x, y: y};
		this.color = "#00f";
		this.mass = 0.6;
		this.init();
	}
	WaterParticle.inheritFrom(Particle);
	return WaterParticle;
});
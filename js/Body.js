function Body(coords, verticles) {
	this.coords = {x: coords.x, y: coords.x};
	this.verticles = JSON.parse(JSON.stringify(verticles));
}
Body.prototype.isIn = function(particle) {
	for(var i = 0; i < this.verticles.length; i++) {
		if(particle.onTheLeft(this.verticles[(i+1)%this.verticles.length], this.verticles[i]) < 0) {
			return false;
		}
	}
	return true
	
}
Body.prototype.extractParticle = function (particle) {
	
}
Body.prototype.render = function (ctx) {
	ctx.save();
	ctx.translate(this.coords.x, this.coords.y);
	ctx.beginPath();
	ctx.moveTo(this.verticles[0].x, this.verticles[0].y);
	for(var i = 1; i < this.verticles.length; i++) {
		ctx.lineTo(this.verticles[i].x, this.verticles[i].y);
	}
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}
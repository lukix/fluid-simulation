define(['../geometry/Polygon', './inheritFrom'], function (Polygon, inheritFrom) {
	Body.inheritFrom = inheritFrom;
	Body.inheritFrom(Polygon);
	function Body() {
		Polygon.apply(this, arguments);
	}
	Body.prototype.render = function (ctx) {
		ctx.save();
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.translate(this.coords.x, this.coords.y);
		ctx.beginPath();
		ctx.moveTo(this.sides[0].p1.x, this.sides[0].p1.y);
		for(var i = 1; i < this.sides.length; i++) {
			ctx.lineTo(this.sides[i].p1.x, this.sides[i].p1.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	return Body;
});

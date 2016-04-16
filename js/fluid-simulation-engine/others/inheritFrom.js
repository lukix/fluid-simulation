define([], function () {
	function inheritFrom(parentClass) {
		this.prototype = new parentClass;
		this.prototype.constructor = this;
		this.prototype.parent = parentClass.prototype;
	}
	return inheritFrom;
});

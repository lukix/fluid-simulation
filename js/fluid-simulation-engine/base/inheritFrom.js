define([], function () {
	function inheritFrom(parentClass) {
		if(parentClass.constructor == Function) {
			this.prototype = new parentClass;
			this.prototype.constructor = this;
			this.prototype.parent = parentClass.prototype;
		}
		else
			console.log('inheritFrom warning!');				//Should be deleted later
	}
	return inheritFrom;
});
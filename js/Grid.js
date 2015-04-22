define(function () {
	function Grid(particles, cellSize) {
		this.particles = particles;
		this.cellSize = cellSize;
		this.gridStart;
		this.gridArray = [];
	}
	Grid.prototype.init = function () {
		if(this.particles.length == 0)
			return;
		this.gridStart = {
			x: this.particles[0].coords.x,
			y: this.particles[0].coords.y
		};
		for(var i = 0; i < this.particles.length; i++) {
			if(this.particles[i].coords.x < this.gridStart.x)
				this.gridStart.x = this.particles[i].coords.x;
			
			if(this.particles[i].coords.y < this.gridStart.y)
				this.gridStart.y = this.particles[i].coords.y;
		}
	}
	Grid.prototype.update = function () {
		this.init();
		this.gridArray = [];
		for(var i = 0; i < this.particles.length; i++) {
			var x = Math.ceil((this.particles[i].coords.x - this.gridStart.x) / this.cellSize);
			var y = Math.ceil((this.particles[i].coords.y - this.gridStart.y) / this.cellSize);
			if(this.gridArray[x] === undefined)
				this.gridArray[x] = [];
			if(this.gridArray[x][y] === undefined)
				this.gridArray[x][y] = [];
			this.gridArray[x][y].push(this.particles[i]);
		}
	}
	Grid.prototype.forEachPair = function (callback, context) {
		this.update();
		en = 0;
		for(var X = 0; X < this.gridArray.length; X++) {
			if(this.gridArray[X] === undefined)
				continue;
			for(var Y = 0; Y < this.gridArray[X].length; Y++) {
				if(this.gridArray[X][Y] === undefined)
					continue;
				for(var i = this.gridArray[X][Y].length - 1; i >= 0; i--) {
					for(var x = X-1; x <= X+1; x++) {
						if(this.gridArray[x] === undefined)
							continue;
						for(var y = Y-1; y <= Y+1; y++) {
							if(this.gridArray[x][y] === undefined)
								continue;
							for(var j = 0; j < this.gridArray[x][y].length; j++) {
								if(X == x && Y==y && i==j)
									continue;
								callback(context, this.gridArray[X][Y][i], this.gridArray[x][y][j]);
								en++;
							}
						}
					}
					this.gridArray[X][Y].pop();
				}
			}
		}
		context.en.push(en);
		context.en.shift();
	}
	return Grid;
});
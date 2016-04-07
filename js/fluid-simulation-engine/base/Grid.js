define(function () {
	function Grid(particles, cellSize) {
		this.particles = particles;
		this.cellSize = cellSize;
		this.gridStart;
		this.gridArray = [];
	}
	Grid.prototype.setCellSize = function (cellSize) {
		this.cellSize = cellSize;
	}
	Grid.prototype.init = function () {
		if(this.particles.length === 0)
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
			var x = Math.floor((this.particles[i].coords.x - this.gridStart.x) / this.cellSize);
			var y = Math.floor((this.particles[i].coords.y - this.gridStart.y) / this.cellSize);
			if(this.gridArray[x] === undefined)
				this.gridArray[x] = [];
			if(this.gridArray[x][y] === undefined)
				this.gridArray[x][y] = [];
			this.gridArray[x][y].push(this.particles[i]);
		}
	}
	Grid.prototype.forEachPair = function (callback, context) {
		//Preparing checkArray
		var checkedArray = [];
		for(var X = 0; X < this.gridArray.length; X++) {
			if(this.gridArray[X] === undefined)
				continue;
			checkedArray[X] = [];
			for(var Y = 0; Y < this.gridArray[X].length; Y++) {
				if(this.gridArray[X][Y] === undefined)
					continue;
				checkedArray[X][Y] = [];
				for(var i = this.gridArray[X][Y].length - 1; i >= 0; i--) {
					checkedArray[X][Y][i] = false;
				}
			}
		}

		//Main loop
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
								if(checkedArray[x][y][j] || (X === x && Y === y && i === j))
									continue;
								callback(context, this.gridArray[X][Y][i], this.gridArray[x][y][j]);
							}
						}
					}
					checkedArray[X][Y][i] = true;
				}
			}
		}
	}
	Grid.prototype.render = function (ctx) {
		ctx.strokeStyle = "rgb(220, 130, 0)";
		for(var x = 0; x < this.gridArray.length; x++) {
			if(this.gridArray[x] === undefined)
				continue;
			for(var y = 0; y < this.gridArray[x].length; y++) {
				ctx.strokeRect(
					 this.gridStart.x + x * this.cellSize
					,this.gridStart.y + y * this.cellSize
					,this.cellSize
					,this.cellSize
				);
			}
		}
		return this;
	}
	return Grid;
});

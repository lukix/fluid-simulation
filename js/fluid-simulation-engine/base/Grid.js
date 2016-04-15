define(function () {
	function Grid(particles, cellSize) {
		this.particles = particles;
		this.cellSize = cellSize;
		this.gridStart;
		this.gridEnd;
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
		this.gridEnd = {
			x: this.particles[0].coords.x,
			y: this.particles[0].coords.y
		};
		for(var i = 0; i < this.particles.length; i++) {
			if(this.particles[i].coords.x < this.gridStart.x)
				this.gridStart.x = this.particles[i].coords.x;
			if(this.particles[i].coords.y < this.gridStart.y)
				this.gridStart.y = this.particles[i].coords.y;
			if(this.particles[i].coords.x > this.gridEnd.x)
				this.gridEnd.x = this.particles[i].coords.x;
			if(this.particles[i].coords.y > this.gridEnd.y)
				this.gridEnd.y = this.particles[i].coords.y;
		}
	}
	Grid.prototype.update = function () {
		this.init();
		var width = Math.ceil((this.gridEnd.x-this.gridStart.x)/this.cellSize);
		var height = Math.ceil((this.gridEnd.y-this.gridStart.y)/this.cellSize)
		this.gridArray = new Array(width);
		for(var i = 0; i < width; i++) {
			this.gridArray[i] = new Array(height);
			for(var j = 0; j < height; j++) {
				this.gridArray[i][j] = [];
			}
		}

		for(var i = 0; i < this.particles.length; i++) {
			var x = Math.floor((this.particles[i].coords.x - this.gridStart.x) / this.cellSize);
			var y = Math.floor((this.particles[i].coords.y - this.gridStart.y) / this.cellSize);
			this.gridArray[x][y].push(this.particles[i]);
		}
	}
	Grid.prototype.forEachPair = function (callback, context) {
		for(var X = 0; X < this.gridArray.length; X++) {
			for(var Y = 0; Y < this.gridArray[X].length; Y++) {
				for(var i = 0; i < this.gridArray[X][Y].length; i++) {
					for(var x = X+1; x >= X; x--) {
						if(x >= this.gridArray.length)
							continue;
						for(var y = Y+1; y >= Y+X-x; y--) {
							if(y < 0 || y >= this.gridArray[x].length)
								continue;
							var j = (X === x && Y === y) ? i+1 : 0;
							for(; j < this.gridArray[x][y].length; j++) {
								callback(context, this.gridArray[X][Y][i], this.gridArray[x][y][j]);
							}
						}
					}
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

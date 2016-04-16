define([
	 '../geometry/Vector'
	,'../geometry/LineSegment'
	,'../geometry/Polygon'
], function (Vector, LineSegment, Polygon) {
	function BodiesGrid(bodies, cellSize) {
		this.bodies = bodies;
		this.cellSize = cellSize;
		this.gridStart;
		this.gridEnd;
		this.gridArray = [];
		this.upToDate = true;
	}
	BodiesGrid.prototype.bodiesHasChanged = function () {
		this.upToDate = false;
	};
	BodiesGrid.prototype.update = function () {
		if(!this.upToDate)
			this.init();
		this.upToDate = true;
	};
	BodiesGrid.prototype.setCellSize = function (cellSize) {
		this.cellSize = cellSize;
	}
	BodiesGrid.prototype.init = function () {
		this.gridStart = Polygon.getMinPointOfPolygonsArray(this.bodies);
		this.gridEnd = Polygon.getMaxPointOfPolygonsArray(this.bodies);
		var gridXSize = Math.ceil((this.gridEnd.x - this.gridStart.x) / this.cellSize);
		var gridYSize = Math.ceil((this.gridEnd.y - this.gridStart.y) / this.cellSize);
		this.gridArray = new Array(gridXSize);
		for(var i = 0; i < this.gridArray.length; i++) {
			this.gridArray[i] = new Array(gridYSize);
			for(var j = 0; j < this.gridArray[i].length; j++) {
				this.gridArray[i][j] = [];
			}
		}
		for(var xIndex = 1; xIndex < gridXSize-1; xIndex++) {	//Vertical lines
			var x = this.gridStart.x + xIndex * this.cellSize;
			var line = new LineSegment(
				 new Vector(x, this.gridStart.y)
				,new Vector(x, this.gridEnd.y)
			);
			for(var i = 0; i < this.bodies.length; i++) {
				for(var j = 0; j < this.bodies[i].sides.length; j++) {
					var absoluteSide = new LineSegment(
						 new Vector(this.bodies[i].sides[j].p1).add(this.bodies[i].coords)
						,new Vector(this.bodies[i].sides[j].p2).add(this.bodies[i].coords)
					);
					var crossingPoint = line.crossingPoint(absoluteSide);
					if(crossingPoint !== null) {
						var y = crossingPoint.y;
						var yIndex = Math.floor((y - this.gridStart.y) / this.cellSize);

						this.addSide(xIndex, yIndex, this.bodies[i].sides[j], this.bodies[i]);
						this.addSide(xIndex-1, yIndex, this.bodies[i].sides[j], this.bodies[i]);
					}
				}
			}
		}
		for(var yIndex = 1; yIndex < gridYSize-1; yIndex++) {	//Horizontal lines
			var y = this.gridStart.y + yIndex * this.cellSize;
			var line = new LineSegment(
				 new Vector(this.gridStart.x, y)
				,new Vector(this.gridEnd.x, y)
			);
			for(var i = 0; i < this.bodies.length; i++) {
				for(var j = 0; j < this.bodies[i].sides.length; j++) {
					var absoluteSide = new LineSegment(
						 new Vector(this.bodies[i].sides[j].p1).add(this.bodies[i].coords)
						,new Vector(this.bodies[i].sides[j].p2).add(this.bodies[i].coords)
					);
					var crossingPoint = line.crossingPoint(absoluteSide);
					if(crossingPoint !== null) {
						var x = crossingPoint.x;
						var xIndex = Math.floor((x - this.gridStart.x) / this.cellSize);

						this.addSide(xIndex, yIndex, this.bodies[i].sides[j], this.bodies[i]);
						this.addSide(xIndex, yIndex-1, this.bodies[i].sides[j], this.bodies[i]);
					}
				}
			}
		}
		for(var i = 0; i < this.bodies.length; i++) {		//Verticles
			for(var j = 0; j < this.bodies[i].sides.length; j++) {
				var verticle = this.bodies[i].sides[j].p1;
				var point = new Vector(this.bodies[i].coords).add(verticle);
				var xIndex = Math.floor((point.x - this.gridStart.x) / this.cellSize);
				var yIndex = Math.floor((point.y - this.gridStart.y) / this.cellSize);
				this.addVerticle(xIndex, yIndex, verticle, this.bodies[i]);
			}
		}

		this.combineIntoBodies();
		return;
	}
	BodiesGrid.prototype.combineIntoBodies = function () {
		for(var x = 0; x < this.gridArray.length; x++) {
			for(var y = 0; y < this.gridArray[x].length; y++) {
				combineIntoBodies(this.gridArray[x][y]);
				deduplicateSth(this.gridArray[x][y]);
			}
		}
		function combineIntoBodies(cell) {
			for(var i = 0; i < cell.length; i++) {
				for(var j = cell.length - 1; j > i; j--) {
					if(cell[i].body === cell[j].body) {
						cell[i].sides = cell[i].sides.concat(cell[j].sides);
						cell[i].verticles = cell[i].verticles.concat(cell[j].verticles);
						cell.splice(j, 1);
					}
				}
			}
		}
		function deduplicateSth(cell) {		//CHANGE NAME!
			cell.forEach(function (item) {
				item.sides = item.sides.filter(function(item, pos, arr) {
					return arr.indexOf(item) === pos;
				});
				item.verticles = item.verticles.filter(function(item, pos, arr) {
					return arr.indexOf(item) === pos;
				});
			});
		}
	}
	BodiesGrid.prototype.addSide = function (x, y, side, body) {

		for(var X = x - 1; X <= x + 1; X++) {
			for(var Y = y - 1; Y <= y + 1; Y++) {
				if(this.gridArray[X] !== undefined && this.gridArray[X][Y] !== undefined)
					this.gridArray[X][Y].push({body: body, sides: [side], verticles: []});
			}
		}
	}
	BodiesGrid.prototype.addVerticle = function (x, y, verticle, body) {
		for(var X = x - 1; X <= x + 1; X++) {
			for(var Y = y - 1; Y <= y + 1; Y++) {
				if(this.gridArray[X] !== undefined && this.gridArray[X][Y] !== undefined)
					this.gridArray[X][Y].push({body: body, sides: [], verticles: [verticle]});
			}
		}
	}
	BodiesGrid.prototype.forEachBody = function (particle, callback, context) {
		var xIndex = Math.floor((particle.coords.x - this.gridStart.x) / this.cellSize);
		var yIndex = Math.floor((particle.coords.y - this.gridStart.y) / this.cellSize);
		if(this.gridArray[xIndex] !== undefined && this.gridArray[xIndex][yIndex] !== undefined) {
			for(var i = 0; i < this.gridArray[xIndex][yIndex].length; i++)
				callback(context, this.gridArray[xIndex][yIndex][i]);
		}
	}
	BodiesGrid.getPotentialStickingForceVectors = function (particle, obj) {
		var relativePoint = new Vector(particle.coords).subtract(obj.body.coords);
		var vectors = [];
		var projectedSides = [];

		for(var i = 0; i < obj.sides.length; i++) {
			var projectedPoint;
			if((projectedPoint = obj.sides[i].getProjectedPoint(relativePoint)) !== null) {
				//Push vector
				var line = new LineSegment(relativePoint, projectedPoint);
				var vec = line.getUnitVector().multiplyBy(line.getLength());
				vectors.push(vec);
				projectedSides.push(true);
			}
			else
				projectedSides.push(false);
		}
		for(var i = 0; i < obj.verticles.length; i++) {
			var checked = obj.sides.some(function (side, index) {
				if(projectedSides[index] && (obj.verticles[i] === side.p1 || obj.verticles[i] === side.p2))
					return true;
				else
					return false;
			});
			if(!checked) {
				//Push vector
				var line = new LineSegment(relativePoint, obj.verticles[i]);
				var vec = line.getUnitVector().multiplyBy(line.getLength());
				vectors.push(vec);
			}
		}
		return vectors;
	}
	BodiesGrid.prototype.render = function (ctx) {

	}
	return BodiesGrid;
});

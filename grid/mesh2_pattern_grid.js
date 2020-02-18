var Mesh2PatternGrid = (function(){

	var SuperClass = BasePatternGrid;

	function Mesh2PatternGrid(size){
		this.size = size || 60;
		
		this.width;
		this.height;
	}

	Mesh2PatternGrid.prototype = {
		calculateWidth: function(){
			return 2 * this.size * Math.round(Math.sqrt(3) / 2);
		},
		prepareCanvas: function(){
			SuperClass.prototype.prepareCanvas.call(this);

			this.width = this.calculateWidth();
			this.height = this.size;

			this.canvas.width = this.width;
			this.canvas.height = this.height;

			var context = this.canvas.getContext("2d");
			context.save();
			this.setupContext(context);

			context.beginPath();
			context.moveTo(this.width, 0);
			context.lineTo(0, this.height);
			context.lineTo(0, 0);
			context.lineTo(this.width, this.height);

			context.moveTo(0, 0);
			context.lineTo(0, this.height);

			var halfWidth = this.width / 2;
			context.moveTo(halfWidth, 0);
			context.lineTo(halfWidth, this.height);
			context.stroke();

			context.restore();
		},
		snapPosition: function(pos){
			pos = SuperClass.prototype.snapPosition.call(this, pos);
			
			var x = pos.x();
			var y = pos.y();
			var xBase = this.width * Math.floor(x / this.width);
			var yBase = this.height * Math.floor(y / this.height);
			
			var dx = (x - xBase) / this.width;
			var dy = (y - yBase) / this.height;
			var r = Math.floor((dx + dy) * 2);
			if(r === 0){
				x = xBase;
				y = yBase;
			} else if(r === 3){
				x = xBase + this.width;
				y = yBase + this.height;
			} else {
				r = Math.floor(((1 - dx) + dy) * 2);
				if(r === 0){
					x = xBase + this.width;
					y = yBase;
				} else if(r === 3){
					x = xBase;
					y = yBase + this.height;
				} else {
					x = xBase + (this.width / 2);
					y = yBase + (this.height / 2);
				}
			}
			
			pos.set(x, y);
			
			return pos;
		}
	};

	ClassUtil.extend(Mesh2PatternGrid, SuperClass);
	return Mesh2PatternGrid;

}());


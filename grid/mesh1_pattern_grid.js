var Mesh1PatternGrid = (function(){
	
	var SuperClass = BasePatternGrid;
	
	function Mesh1PatternGrid(size){
		this.size = size || 50;
	}
	
	Mesh1PatternGrid.prototype = {
		prepareCanvas: function(){
			SuperClass.prototype.prepareCanvas.call(this);
			
			this.canvas.width = this.size;
			this.canvas.height = this.size;

			var context = this.canvas.getContext("2d");
			context.save();
			this.setupContext(context);
			
			context.beginPath();
			context.moveTo(this.size, this.size);
			context.lineTo(0, 0);
			context.lineTo(this.size, 0);
			context.lineTo(0, this.size);
			context.lineTo(0, 0);
			context.stroke();
			
			context.restore();
		},
		snapPosition: function(pos){
			pos = SuperClass.prototype.snapPosition.call(this, pos);
			
                        var x = pos.x();
			var y = pos.y();
			var xBase = this.size * Math.floor(x / this.size);
			var yBase = this.size * Math.floor(y / this.size);
			
			var dx = (x - xBase) / this.size;
			var dy = (y - yBase) / this.size;
			var r = Math.floor((dx + dy) * 2);
			if(r === 0){
				x = xBase;
				y = yBase;
			} else if(r === 3){
				x = xBase + this.size;
				y = yBase + this.size;
			} else {
				r = Math.floor(((1 - dx) + dy) * 2);
				if(r === 0){
					x = xBase + this.size;
					y = yBase;
				} else if(r === 3){
					x = xBase;
					y = yBase + this.size;
				} else {
					x = xBase + (this.size / 2);
					y = yBase + (this.size / 2);
				}
			}
			pos.set(x, y);
                        
			return pos;
		}
	};
	
	ClassUtil.extend(Mesh1PatternGrid, SuperClass);
	return Mesh1PatternGrid;
	
}());


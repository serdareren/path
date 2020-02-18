var SquarePatternGrid = (function(){
	
	var SuperClass = BasePatternGrid;
	
	function SquarePatternGrid(size){
		this.size = size || 25;
	}
	
	SquarePatternGrid.prototype = {
		prepareCanvas: function(){
			SuperClass.prototype.prepareCanvas.call(this);
			
			this.canvas.width = this.size;
			this.canvas.height = this.size;

			var context = this.canvas.getContext("2d");
			context.save();
			this.setupContext(context);
			
			context.beginPath();
			context.moveTo(0, this.size);
			context.lineTo(0, 0);
			context.lineTo(this.size, 0);
			context.stroke();
			
			context.restore();
		},
		snapPosition: function(pos){
			pos = SuperClass.prototype.snapPosition.call(this, pos);
			var x = this.size * Math.round(pos.x() / this.size);
			var y = this.size * Math.round(pos.y() / this.size);
                        pos.set(x, y);
			return pos;
		}
	};
	
	ClassUtil.extend(SquarePatternGrid, SuperClass);
	return SquarePatternGrid;
	
}());


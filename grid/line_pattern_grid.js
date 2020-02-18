var LinePatternGrid = (function(){
	
	var SuperClass = BasePatternGrid;
	
	function LinePatternGrid(size){
		this.size = size || 60;
	}
	
	LinePatternGrid.prototype = {
		prepareCanvas: function(){
			SuperClass.prototype.prepareCanvas.call(this);
			
			this.canvas.width = 1;
			this.canvas.height = this.size;

			var context = this.canvas.getContext("2d");
			context.save();
			this.setupContext(context);
			
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(1, 0);
			context.stroke();
			
			context.restore();
		}
	};
	
	ClassUtil.extend(LinePatternGrid, SuperClass);
	return LinePatternGrid;
	
}());


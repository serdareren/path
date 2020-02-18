var BasePatternGrid = (function(){
	
	function BasePatternGrid(){		
		this.$elem;
		this.previousBackground;
		this.canvas;
	}
	
	BasePatternGrid.prototype = {
		prepareCanvas: function(){
			// abstract
		},
		setupContext: function(context){
			context.lineWidth = 1;
			context.strokeStyle = "#000000";
			context.globalAlpha = 0.5;
		},
		attachTo: function($elem){
			if(!$("#" + this.styleId).length){
				this.canvas = $("<canvas/>")[0];
				this.prepareCanvas();
				this.image = this.canvas.toDataURL("image/png");
			}
			this.$elem = $elem;
			this.previousBackground = this.$elem.css("background") || "";
			this.$elem.css("background", "url(" + this.image + ")");
		},
		detach: function(){
			this.$elem.css("background", this.previousBackground);
			this.previousBackground = "";
		},
		snapPosition: function(pos){
			// abstract
			return pos;
		}
	};
	
	return BasePatternGrid;
	
}());

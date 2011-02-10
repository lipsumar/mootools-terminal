(function(){
	
	Number.implement({
		'nearest': function(rounder) {
			return rounder * (this / rounder).floor();
		}
	});
	
	String.implement({
		'toElements': function() {
			var container = new Element('div');
			return container.set('html', this).getChildren();
		},
		repeat: function(times) {
			return new Array(times + 1).join(this);
		},
		'pad': function(length, mask, direction){
			if (this.length >= length) {
				return this;
			}

			var result = null,
				pad = (mask || ' ').repeat(length - this.length).substr(0, length - this.length);

			switch (direction) {
				case 'both':
					result = pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
					break;
				case 'left':
					result = pad + this;
					break;
				case 'right':
				default:
					result = this + pad;
					break;
			}

			return result;
		}
	});
	
}());
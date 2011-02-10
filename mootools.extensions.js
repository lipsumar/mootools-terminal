(function(){
	
	Number.implement({
		'nearest': function(rounder) {
			return rounder * (this / rounder).floor();
		}
	});
	
}());
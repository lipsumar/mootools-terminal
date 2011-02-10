(function(){
	
	Program.Echo = new Class({
		'Extends': Program,
		'run': function(args) {
			var parser = new OptionParser();
			console.log(parser.parse(args));
		}
	});
	
}());
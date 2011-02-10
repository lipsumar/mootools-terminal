(function(){
	
	Program.Echo = new Class({
		'Extends': Program,
		'run': function() {
			this.terminal.echo((this.args[0] || ''));
			this.exit();
		}
	});
	
}());
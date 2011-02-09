(function(){
	
	window.Program = new Class({
		'Implements': [Options, Events],
		'initialize': function(terminal, options) {
			this.setOptions(options);
			this.terminal = terminal;
		},
		'exit': function() {
			var self = this;
			setTimeout(function(){
				delete self.terminal.program;
				self.terminal.shell.prompt();
			}, 0);
		}
	});
	
}());
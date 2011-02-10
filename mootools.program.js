(function(){
	
	window.Program = new Class({
		'Implements': [Options, Events],
		'options': {
			'onRender': function(){}
		},
		'initialize': function(terminal, options) {
			this.setOptions(options);
			this.terminal = terminal;
		},
		'handle': function(e) {
			
		},
		'run': function(args) {
			
		},
		'exit': function() {
			var self = this;
			
			// wait a tick for the program to setting before removing it
			setTimeout(function(){
				delete self.terminal.program;
				self.terminal.shell.prompt();
			}, 0);
			
			// moot repeat calls to this method
			self.exit = function(){};
		}
	});
	
}());
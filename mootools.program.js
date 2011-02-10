(function(){
	
	window.Program = new Class({
		'Implements': [Options, Events],
		'options': {
			'onRender': function(){}
		},
		'initialize': function(terminal, options, args) {
			this.setOptions(options);
			this.terminal = terminal;
			this.args = args;
		},
		'handle': function(e) {
			
		},
		'run': function() {
			
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
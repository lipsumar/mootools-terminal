(function(){
	
	Program.Shell = new Class({
		'Extends': Program,
		'options': {
			'prefix': 'guest@localhost:/# ',
			'invalid': ': command not found'
		},
		'initialize': function(terminal, options) {
			this.parent(terminal, options);
			this.command = '';
		},
		'handle': function(e) {
			var self = this,
				terminal = self.terminal,
				options = terminal.options,
				data = terminal.data;
			
			switch (e.key) {
				case 'enter':
					var command = (self.command || '').trim(),
						parts = command.split(' ');
					
					if (command.length > 0) {
						if (options.programs[parts[0]] != undefined && options.programs[parts[0]].handler != null) {
							terminal.program = new options.programs[parts[0]].handler(terminal, options.programs[parts[0]].options);
						} else {
							data.buffer[++data.row] = parts[0] + self.options.invalid;
							self.prompt();
						}
					} else {
						self.prompt();
					}
					
					self.command = '';
					terminal.capture.value = '';
					break;
				default:
					self.command = e.input;
					data.buffer[data.row] = this.options.prefix + self.command;
					terminal.render();
					break;
			}
		},
		'prompt': function() {
			var data = this.terminal.data;
			data.buffer[++data.row] = this.options.prefix;
			this.terminal.render();
		}
	});
	
}());
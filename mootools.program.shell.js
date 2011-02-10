(function(){
	
	Program.Shell = new Class({
		'Extends': Program,
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
						terminal.launch(parts[0]);
					} else {
						self.prompt();
					}
					
					self.command = '';
					terminal.capture.value = '';
					break;
				default:
					self.command = e.input;
					data.buffer[data.row] = terminal.options.messages.prompt + self.command;
					terminal.render();
					break;
			}
		},
		'prompt': function() {
			var data = this.terminal.data;
			data.buffer[++data.row] = this.terminal.options.messages.prompt;
			this.terminal.render();
		}
	});
	
}());
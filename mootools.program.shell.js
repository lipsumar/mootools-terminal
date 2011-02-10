(function(){
	
	Program.Shell = new Class({
		'Extends': Program,
		'initialize': function(terminal, options) {
			this.parent(terminal, options);
			this.command = '';
			this.history = [];
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
						self.history.include(command);
						self.last = self.history.length;
						terminal.launch(parts[0], parts.slice(1));
					} else {
						self.prompt();
					}
					
					self.command = '';
					terminal.capture.value = '';
					break;
				case 'up':
					if (self.history.length > 0) {
						self.last = (self.last == 0 ? self.history.length - 1 : self.last - 1);
						self.terminal.capture.value = self.history[self.last];
						self.terminal.capture.fireEvent('keyup', [{}]);
					}
					break;
				case 'down':
					if (self.history.length > 0 && self.last != self.history.length) {
						self.last = self.last + 1;
						if (self.last == self.history.length) {
							self.terminal.echo(self.terminal.options.messages.prompt);
							self.command = '';
							break;
						}
						self.terminal.capture.value = self.history[self.last];
						self.terminal.capture.fireEvent('keyup', [{}]);
					}
					break;
				default:
					self.command = e.input;
					data.buffer[data.row] = terminal.options.messages.prompt + self.command;
					terminal.render();
					break;
			}
		},
		'prompt': function() {
			this.terminal.echo(this.terminal.options.messages.prompt);
		}
	});
	
}());
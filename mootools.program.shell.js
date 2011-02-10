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
					var command = (self.command || '').trim().split(' ');
					
					if (command.length > 0) {
						self.history.include(command);
						self.last = self.history.length;
						terminal.launch(command[0], (command.slice(1) || []).join(' '));
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
						self.terminal.capture.fireEvent('keydown', [{}]);
					}
					break;
				case 'down':
					if (self.history.length > 0 && self.last != self.history.length) {
						self.terminal.capture.value = self.history[self.last];
						self.terminal.capture.fireEvent('keydown', [{}]);
						self.last = self.last + 1;
					} else {
						self.command = '';
						self.last = self.history.length;
						terminal.echo(terminal.options.messages.prompt, 'over');
					}
					break;
				default:
					self.command = e.input;
					terminal.echo(terminal.options.messages.prompt + self.command, 'over');
					break;
			}
		},
		'prompt': function() {
			this.terminal.echo(this.terminal.options.messages.prompt);
		}
	});
	
}());
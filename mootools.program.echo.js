(function(){
	
	var _version = 'echo 0.1',
		_switches = [
			['h', 'help', 'Show this help', false],
			['v', 'version', 'Show this version', false]
		];
	
	Program.Echo = new Class({
		'Extends': Program,
		'run': function(args) {
			var self = this,
				parser = new OptionParser({
					'switches': _switches,
					'onValid': function(_switch, _value) {
						switch(_switch[1]) {
							case 'no-newline':
								self.strip = true;
								break;
							case 'help':
								self.help();
								self.abort = true;
								break;
							case 'version':
								self.version();
								self.abort = true;
								break;
						}
					},
					'onString': function(_string) {
						self.raw = _string;
					},
					'onParsed': function(results) {
						if (self.strip == true) {
							self.raw = self.raw.replace(/\n+$/, '');
						}
						if (self.abort != true) {
							self.terminal.echo(self.raw);
							self.exit();
						}
					}
				}).parse(args);
		},
		'version': function() {
			this.terminal.echo(_version);
			this.exit();
		},
		'help': function() {
			var self = this,
				_combined = '';
				
			_switches.each(function(_switch){
				_combined += _switch[0];
			});
			
			self.terminal.echo('usage: echo [-' + _combined + '] <em>some text...</em><br>', 'html');
			self.terminal.echo('switches:');
			
			_switches.each(function(_switch){
				var _line = ' '.repeat(7) + '-' + _switch[0] + ' '.repeat(5) + ('--' + _switch[1]).pad(13, ' ', 'right') + _switch[2] + (_switch[3] ? ' (optional)' : '');
				self.terminal.echo(_line);
			});
			
			self.exit();
		}
	});
	
}());
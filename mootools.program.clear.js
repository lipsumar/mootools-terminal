(function(){
	
	var _version = 'clear 0.1',
		_switches = [
			['h', 'help', 'Show this help', false],
			['v', 'version', 'Show this version', false]
		];
	
	Program.Clear = new Class({
		'Extends': Program,
		'options': {
			'onRender': function() {
				this.terminal.element.scrollTop = this.terminal.element.scrollHeight;
				this.exit();
			}
		},
		'run': function(args) {
			var self = this,
				commands = [],
				parser = new OptionParser({
					'switches': _switches,
					'onValid': function(_switch, _value) {
						switch(_switch[1]) {
							case 'help':
								self.help();
								break;
							case 'version':
								self.version();
								break;
						}
					},
					'onParsed': function(results) {
						self.terminal.echo('<div class="clear-spacer" />', 'html');
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
			
			self.terminal.echo('usage: clear [-' + _combined + ']<br>', 'html');
			self.terminal.echo('switches:');
			
			_switches.each(function(_switch){
				var _line = ' '.repeat(7) + '-' + _switch[0] + ' '.repeat(5) + ('--' + _switch[1]).pad(13, ' ', 'right') + _switch[2] + (_switch[3] ? ' (optional)' : '');
				self.terminal.echo(_line);
			});
			
			self.exit();
		}
	});
	
}());
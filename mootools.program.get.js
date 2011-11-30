(function(){
	
	var _version = 'get 0.1',
		_switches = [
			['h', 'help', 'Show this help', false],
			['v', 'version', 'Show this version', false]
		];
	
	Program.Get = new Class({
		'Extends': Program,
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
						
						if(results[0]!=''){
							var val = Cookie.read('mt_set_'+results[0]);
							self.terminal.echo((results[0]==null?'Key "'+results[0]+'" does not exists.':val));
							
						}else{
							self.terminal.echo('get: wrong usage.');
							self.help();
						}
						
						self.exit();
						
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
			
			self.terminal.echo('usage: get &lt;key&gt;<br/>', 'html');
			self.terminal.echo('switches:');
			
			_switches.each(function(_switch){
				var _line = ' '.repeat(7) + '-' + _switch[0] + ' '.repeat(5) + ('--' + _switch[1]).pad(13, ' ', 'right') + _switch[2] + (_switch[3] ? ' (optional)' : '');
				self.terminal.echo(_line);
			});
			
			self.exit();
		}
	});
	
}());
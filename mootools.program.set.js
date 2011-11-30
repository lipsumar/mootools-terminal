(function(){
	
	var _version = 'set 0.1',
		_switches = [
			['h', 'help', 'Show this help', false],
			['v', 'version', 'Show this version', false]
		];
	
	Program.Set = new Class({
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
						
						if(results.length!=2 || results[0].trim()=='' || results[1].trim()==''){
							self.terminal.echo('set: wrong usage.');
							self.help();
						}else{
							Cookie.write('mt_set_'+results[0],results[1]);
							switch(results[0]){
								case 'secret':
								case 'machineID':
									self.terminal.data[results[0]] = results[1];
									break;
							}
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
			
			self.terminal.echo('usage: set &lt;key&gt; &lt;value&gt;<br>You might need to reboot in order to have the new settings applied.<br/>', 'html');
			self.terminal.echo('switches:');
			
			_switches.each(function(_switch){
				var _line = ' '.repeat(7) + '-' + _switch[0] + ' '.repeat(5) + ('--' + _switch[1]).pad(13, ' ', 'right') + _switch[2] + (_switch[3] ? ' (optional)' : '');
				self.terminal.echo(_line);
			});
			
			self.exit();
		}
	});
	
}());
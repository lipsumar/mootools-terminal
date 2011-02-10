(function(){
	
	window.Terminal = new Class({
		'Implements': [Options, Events],
		'options': {
			'messages': {
				'prompt': 'guest@localhost:/# ',
				'unknown': ': command not found'
			},
			'programs': {
				'sh': {
					'handler': null,
					'defaults': null
				}
			}
		},
		'data': {
			'buffer': [],
			'row': 0
		},
		'initialize': function(element, options) {
			this.setOptions(options);
			
			var self = this,
				sh = self.options.programs.sh;
			
			self.element = document.id(element);
			window.addEvent('resize', function(){
				self.render();
			});
			
			if (sh.handler != null) {
				self.shell = new sh.handler(self, sh.defaults);
			} else {
				throw 'No shell (sh) program defined.';
			}
			
			self.capture = new Element('input', {
				'type': 'text',
				'class': 'capture',
				'events': {
					'keydown': function() {
						self.keyed = true;
					},
					'keyup': function(e) {
						if (self.keyed) {
							e.input = '' + this.value;
							(self.program || self.shell).handle.apply((self.program || self.shell), [e]);
						}
					}
				}
			}).inject(document.body);
			
			self.capture.focus();
			self.shell.prompt();
		},
		'getSize': function() {
			var size = window.getSize();
			
			return {
				'size': size,
				'x': (size.x / 7).floor(),
				'y': (size.y / 16).floor()
			};
		},
		'launch': function(key) {
			if (this.options.programs[key] != undefined && this.options.programs[key].handler != null) {
				this.program = new this.options.programs[key].handler(this, this.options.programs[key].defaults);
				this.program.run();
			} else {
				this.data.buffer[++this.data.row] = key + this.options.messages.unknown;
				this.shell.prompt();
			}
		},
		'render': function() {
			var self = this,
				size = self.getSize();
			
			self.element.innerHTML = '';
			
			Array.each(self.data.buffer, function(line){
				if (line.isHtml == true) {
					self.element.innerHTML += line;
				} else {
					while (line.length > size.x) {
						self.element.innerHTML += line.slice(0, size.x - 1) + '<br />';
						line = line.slice(size.x - 1);
					}
					self.element.innerHTML += line + '<br />';
				}
			});
			
			document.title = 'Terminal - ' + size.x + 'x' + size.y;
			(self.program || self.shell).fireEvent('render');
		}
	});
	
}());
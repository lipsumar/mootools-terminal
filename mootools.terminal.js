(function(){
	
	window.Terminal = new Class({
		'Implements': [Options, Events],
		'options': {
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
						self.keydowned = true;
					},
					'keyup': function(e) {
						if (self.keydowned) {
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
		'getEmptyLines': function() {
			var i = this.data.buffer.length - 1;
			
			while (i--) {
				if (this.data.buffer[i] != '') {
					break;
				}
			}
			
			return this.data.buffer.length - i - 1;
		},
		'render': function() {
			var self = this,
				size = this.getSize();
			
			self.element.innerHTML = '';
			
			Array.each(self.data.buffer, function(line){
				if (line.html == true) {
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
			
			if (self.anchor != undefined) {
				document.location = '#' + self.anchor;
			} else {
				self.element.scrollTo(0, self.element.getScrollSize().y);
			}
		}
	});
	
}());
(function(){
	
	function _clean(_items) {
		return _items.filter(function(_item){
			return (_item != ' ' && _item != '' && _item != null);
		});
	}
	
	function _unquote(_item) {
		return _item.replace(/^'|'$/g, '').replace(/^"|"$/g, '');
	}
	
	window.OptionParser = new Class({
		'Implements': [Options, Events],
		'options': {
			'switches': [
				['h', 'help', 'Displays this help', false],
				['v', 'version', 'Displays this version', false]
			]
		},
		'initialize': function(options) {
			this.setOptions(options);
		},
		'add': function(_short, _long, _description) {
			this.options.switches.include([_short, _long, _description]);
		},
		'remove': function(_short, _long) {
			this.options.switches = this.options.switches.filter(function(_switch){
				return !(_switch[0] == _short && _switch[1] == _long);
			});
		},
		'parse': function(_string) {
			var self = this,
				ignore = [],
				results = [],
				regex = /('.*?'|".*?"|\S+)/g,
				halves = _string.split(/\s+[-]{2}\s+/g),
				parts = _clean(halves[0].split(regex));
			
			parts.each(function(_split, _i){
				if (_split.match(/^[-]{2}/)) {
					_split = _split.slice(2);
					self.options.switches.each(function(_switch){
						if (_switch[1] == _split) {
							if (_switch[3] == true) {
								var next = parts[_i + 1];
								if (typeof parts[_i + 1] == 'undefined' || next.match(/^[-]{1,2}/)) {
									self.fireEvent('invalid', [_switch]);
								} else {
									self.fireEvent('valid', [_switch, next]);
									results.push([_switch, next]);
									ignore.include(_i + 1);
								}
							} else {
								self.fireEvent('valid', [_switch]);
								results.push([_switch]);
							}
						}
					});
				} else if (_split.match(/^[-]{1}/)) {
					var bits = _split.slice(1).split('');
					if (bits.length > 1) {
						bits.each(function(_bit){
							self.options.switches.each(function(_switch){
								if (_switch[0] == _bit) {
									if (_switch[3] == true) {
										self.fireEvent('invalid', [_switch]);
									} else {
										self.fireEvent('valid', [_switch]);
										results.push([_switch]);
									}
								}
							});
						});
					} else {
						self.options.switches.each(function(_switch){
							if (_switch[0] == bits[0]) {
								if (_switch[3] == true) {
									var next = parts[_i + 1];
									if (typeof parts[_i + 1] == 'undefined' || next.match(/^[-]{1,2}/)) {
										self.fireEvent('invalid', [_switch]);
									} else {
										self.fireEvent('valid', [_switch, next]);
										results.push([_switch, next]);
										ignore.include(_i + 1);
									}
								} else {
									self.fireEvent('valid', [_switch]);
								}
							}
						});
					}
				} else {
					if (ignore.indexOf(_i) == -1) {
						self.fireEvent('string', [_split]);
						results.push(_unquote(_split));
					}
				}
			});
			
			if (halves.length > 1) {
				Array.each(_clean(halves[1].split(regex)), function(item, i){
					results.push(_unquote(item));
				});
			}
			
			self.fireEvent('parsed', [results]);
			return results;
		},
		'toString': function() {
			
		}
	});
	
}());
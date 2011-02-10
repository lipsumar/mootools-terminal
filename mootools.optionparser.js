(function(){
	
	function _clean(raw) {
		return Array.filter(raw, function(item){
			return (item != ' ' && item != '' && item != null);
		});
	}
	
	function _unquote(raw) {
		return raw.replace(/^'|'$/g, '').replace(/^"|"$/g, '');
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
		'add': function(shortArg, longArg, description) {
			this.options.switches.include([shortArg, longArg, description]);
		},
		'remove': function(shortArg, longArg) {
			this.options.switches = Array.filter(this.options.switches, function(item){
				return !(item[0] == shortArg && item[1] == longArg);
			});
		},
		'parse': function(raw) {
			var self = this,
				results = [],
				regex = /('.*?'|".*?"|\S+)/g,
				parts = raw.split(/\s+[-]{2}\s+/g),
				switched = parts[0].split(regex);
			
			if (parts.length > 1) {
				Array.each(_clean(parts[1].split(regex)), function(item, i){
					results.push(_unquote(item));
				});
			}
			
			Array.each(_clean(switched), function(item, i){
				results.push(_unquote(item));
			});
			
			return results;
		},
		'toString': function() {
			
		}
	});
	
}());
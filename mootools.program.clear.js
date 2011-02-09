(function(){
	
	var _next = 0;
	
	Program.Clear = new Class({
		'Extends': Program,
		'initialize': function(terminal, options) {
			this.parent(terminal, options);
			var size = terminal.getSize(),
				rows = size.y - terminal.getEmptyLines() + 1;
			
			terminal.data.row++;
			terminal.data.buffer[terminal.data.row] = '<a class="clear-anchor" id="clear-' + ++_next + '" />';
			terminal.data.buffer[terminal.data.row].html = true;
			terminal.anchor = 'clear-' + _next;
			
			while (rows--) {
				terminal.data.buffer[terminal.data.buffer.length] = '';
			}
			
			this.exit();
		}
	});
	
}());
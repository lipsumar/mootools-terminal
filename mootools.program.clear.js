(function(){
	
	var _next = 0;
	
	Program.Clear = new Class({
		'Extends': Program,
		'options': {
			'onRender': function() {
				this.terminal.element.scrollTop = this.terminal.element.scrollHeight;
				this.exit();
			}
		},
		'run': function() {
			this.terminal.data.row++;
			this.terminal.data.buffer[this.terminal.data.row] = '<div class="clear" />';
			this.terminal.data.buffer[this.terminal.data.row].isHtml = true;
			this.terminal.render();
		}
	});
	
}());
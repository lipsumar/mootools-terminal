(function(){
	
	Program.Clear = new Class({
		'Extends': Program,
		'options': {
			'onRender': function() {
				this.terminal.element.scrollTop = this.terminal.element.scrollHeight;
				this.exit();
			}
		},
		'run': function() {
			this.terminal.echo('<div class="clear-spacer" />', 'html');
		}
	});
	
}());
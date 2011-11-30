(function(){
	
	function _escape(raw) {
		if(!raw) return '';
		var replacements = {
			'&': '&amp;',
			' ': '&nbsp;',
			'<': '&lt;',
			'>': '&gt;'
		};
		
		Object.each(replacements, function(_value, _key){
			raw = raw.replace(new RegExp(_key, 'g'), _value);
		});
		
		return raw;
	}
	
	window.Terminal = new Class({
		'Implements': [Options, Events],
		'options': {
			'messages': {
				'prompt': '{username}@{machineID}:/# ',
				'unknown': ': command not found',
				'blinkPrompt':'<b id="blink-prompt"></b>'
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
			'row': 0,
			'username': 'guest',
			'hostname': 'localhost',
			'machineID':''
		},
		'blinkPromptEvenOdd':true,
		'server':null,
		
		'initialize': function(element, username, server, options) {
			this.setOptions(options);
			this.data.username = (username || this.data.username);
			this.data.hostname = (server && server.hostname ? server.hostname : this.data.hostname);
			this.data.machineID = Cookie.read('mt_set_machineID') || '';
			this.data.secret = Cookie.read('mt_set_secret') || '';
			this.server = server || null;
			
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
					'keydown': function(e) {
						setTimeout(function(){
							e.input = self.capture.value;
							(self.program || self.shell).handle.apply((self.program || self.shell), [e]);
						}, 0);
					}
				}
			}).inject(document.body);
			
			self.capture.focus();
			
			
			
			self.animateBlink.periodical(500,this);
			
			if(server) self.openServerConnexion();
			else self.shell.prompt();
		},
		'getSize': function() {
			var size = window.getSize();
			
			return {
				'size': size,
				'x': (size.x / 7).floor() - 1,
				'y': (size.y / 16).floor()
			};
		},
		'launch': function(key, args) {
			if (this.options.programs[key] != undefined && this.options.programs[key].handler != null) {
				if(typeof this.options.programs[key].handler == 'string'){
					this[this.options.programs[key].handler]();
				}else{
					this.program = new this.options.programs[key].handler(this, this.options.programs[key].defaults);
					this.program.run(args);
				}
			} else {
				if(key!=''){
					this.echo(key + this.options.messages.unknown);
				}
					
				this.shell.prompt();
				
			}
		},
		'echo': function(raw, type) {
			if (type != 'over') {
				this.data.row++;
			}
			this.data.buffer[this.data.row] = {'raw': raw, 'type': (type || 'plain')};
			this.render();
		},
		'msg': function(m,elClass){
			var type = 'plain';
			if(elClass){
				m = '<span class="'+elClass+'">'+m+'</span><br/>';
				type = 'html';
			}
			this.echo(m,type);
			this.shell.prompt();
		},
		'render': function() {
			var self = this,
				size = self.getSize(),
				line=null,
				bp='';
			
			self.element.innerHTML = '';
			//self.data.buffer.each(function(line){
			for (var i=0; i < self.data.buffer.length; i++) {
				line = self.data.buffer[i];
				if(typeof line == 'undefined') continue;
				
				switch (line.type) {
					case 'html':
						self.element.innerHTML += line.raw;
						break;
					default:
						while (line.length > size.x) {
							self.element.innerHTML += _escape(line.raw.slice(0, size.x - 1)) + '<br />';
							line.raw = line.raw.slice(size.x - 1);
						}
						if(i+1==self.data.buffer.length) bp = self.options.messages.blinkPrompt;
						self.element.innerHTML += _escape(line.raw) + bp + '<br />';
						break;
				}
			};
				
			
			
			
			
			document.title = 'Terminal - ' + size.x + 'x' + size.y;
			(self.program || self.shell).fireEvent('render');
		},
		
		'animateBlink': function(){
			var el = null;
			if(el = $('blink-prompt')){
				el.setStyle('visibility',(this.blinkPromptEvenOdd?'visible':'hidden'));
				this.blinkPromptEvenOdd=!this.blinkPromptEvenOdd;
			}
		},
		
		getPrompt: function(){
			return this.options.messages.prompt.substitute({'username':this.data.username,'host':this.data.hostname,'machineID':(this.data.machineID||'machineID_undefined')});
		},
		
		serverConfigured: function(){
			return (this.server && this.server.url && this.server.url!='');
		},
		
		openServerConnexion: function(){
			
			this.echo('Requesting server connexion...');
			this.sendToServer({'cmd':'connexion-request'},{
				'onSuccess':this.openServerConnexion_onSuccess.bind(this)
			});
			
		},
		openServerConnexion_onSuccess: function(r){
			
			if(this.serverResponseOK(r)){
				switch(r.status){
					case 'ok':
						if(r['connexion-granted']){
							this.msg('Connected.','success');
						}else{
							this.msg('Connexion refused. '+(r['connexion-refused-reason']?r['connexion-refused-reason']:'Unspecified reason.'),'error');
						}
						
						break;
					default:
						this.onServerError('unhandled server status: ['+r.status+']');
				}
			}
			
		
				
		
			
			//this.pingServer.delay();
		},
		
		sendToServer: function(msg,callbacks){
			//do we have a server object at all ?
			if(!this.serverConfigured()){
				this.msg('No server configured. Please configure server and reboot.');
				return;
			}
			
			//do we have a username, machineID and secret ?
			if(this.data.username && this.data.username!=''){
				msg._username = this.data.username;
			}else{
				this.msg('No username for server connexion. Please set username.');
				return;
			}
			
			if(this.data.machineID && this.data.machineID!=''){
				msg._machineID = this.data.machineID;
			}else{
				this.msg('No machineID for server connexion. Please set machineID.');
				return;
			}
			
			if(this.data.secret && this.data.secret!=''){
				msg._sign = this.signMessage(msg);
			}else{
				this.msg('No secret for server connexion. Please set secret.');
				return;
			}
			
			//make sure there is a onError fallback
			if(!callbacks.onFailure){
				callbacks.onFailure = this.onServerError.bind(this);
			}
			
			this.request = new Request.JSON({
				'url':this.server.url+"?nc="+Math.random(),
				'method':'post',
				'data':{
					'msg':msg
				},
				onSuccess: callbacks.onSuccess,
				onFailure: callbacks.onFailure
			}).send();
		},
		
		serverResponseOK: function(r){
			if(r && r.status){
				switch(r.status){
					case 'ok': return true; 
					case 'error':
						if(r.error) this.msg('Error: '+r.error,'error');
						else this.onServerError('no error message');
						break;
					default: this.onServerError('unhandled server status: ['+r.status+']');
				}
			}else this.onServerError('empty response');
		},
		
		signMessage: function(msg){
			if(this.data.secret && this.data.secret!=''){
				var str = '';
				for (var p in msg) {
					if (msg.hasOwnProperty(p)) {
						str += p+'='+msg[p]+this.data.secret+'&';
					}
				}
				console.log('String to hash: '+str);
				var signature = str.SHA1();
				console.log('String hashed: '+signature);
				return signature;
			}else{
				this.msg('No secret to sign messsage. Please set secret.');
			}
			
		},
		
		onServerError: function(request){
			var m = (request && request.statusText ? request.statusText : (typeof request == 'string' ? request :'undefinded'));
			this.msg('Server Error: Server responded with an invalid message. ('+m+')','error');
		}
	});
	
}());
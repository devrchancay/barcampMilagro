(function(){

	"use strict";
	var socket = io('http://192.168.0.104:3000');
	var $enterButton = $("#enter");
	var $collection = $(".collection");
	var $comment    = $("#comment");
	var $user = $("#insertUser");
	var $input = $("#email");
	var emotjs = require('emotsjs');


	$enterButton.on('click',enterOnClick);
	$comment.on('keypress', keyPress);


	function replaceEmot(message){


		var re = /\:(.*?)\:/i; 
		var str = message;
		var m;

		while ((m = re.exec(str)) !== null) {
		    str = str.replace(m[0],emotjs.get(m[1]));
		}

		return str;
	}


	function keyPress(evt)
	{
		 if(evt.which == 13)
		 {
		 	
		 	var message = replaceEmot($(this).find('input').val());

			var source   = $("#entry-user").html();
			var template = Handlebars.compile(source); 	
			var value    = $input.val();
			var hash = CryptoJS.MD5(value);
			var image = 'http://www.gravatar.com/avatar/'+hash+'?s=200&d=identicon';
			var context = { avatar : image , message : message , user : value };
			var html = template(context);
			$collection.append(html);
			socket.emit('news',{data : html});
			$(this).find('input').val('');
		 }
	}

	
	function enterOnClick(event)
	{
		
		var value  = $input.val();
		var source   = $("#entry-user").html();
		var template = Handlebars.compile(source);
	
		if(value.length > 0 ) 
		{
			var hash = CryptoJS.MD5(value);
			var image = 'http://www.gravatar.com/avatar/'+hash+'?s=200&d=identicon';
			var context = { avatar : image , message : 'se ha conectado' , user : value };
			var html = template(context);
			$collection.append(html);
			socket.emit('news',{data : html});
			$user.slideUp('slow');
			$comment.removeClass('hide');
  
		}
		else
		{
			alert('ingresa un email valido');
			$input.focus();
		}

	}

	function init()
	{
		 socket.on('add' , function(data){
		 	data = data.data;
		 	$collection.append(data.data);
		 })
	}

	init();
})();
XHRJSON Plug-in for XUI
-------------

Another twist on remoting: lightweight and unobtrusive DOM databinding. Since we are often talking to a server with 
handy JSON objects we added the convienance the map property which allows you to map JSON nodes to DOM elements. 

### syntax ###

 	xhrjson(url, options);

### arguments ### 

 * {String} _url_ The URL to request.
 * {Object} _options_ The method options including a callback function to invoke when the request returns. 
 
example:
  
The available options are the same as the xhr method with the addition of map. 
 
	x$('#user').xhrjson( '/users/1.json', {
	    'map':{
	        'username':'#name',
	        'image_url':'img#avatar[@src]'
	    }
	});
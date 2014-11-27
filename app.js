//
///**
// * Module dependencies.
// */
//
//var PORT = 4000;
//var FETCH_INTERVAL = 5000;
//var PRETTY_PRINT_JSON = true;
//
//var express = require('express')
//  , routes = require('./routes')
//  , user = require('./routes/user')
//  , http = require('http')
//  , path = require('path');
//
//var io = require('socket.io');
//
//var app = express();
//
//var server = http.createServer(app);
//var io = io.listen(server);
////io.set('log level',1);
//
//// all environments
//app.set('port', process.env.PORT || 3005);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));
//
//// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}
//
////app.get('/', routes.index);
////app.get('/users', user.list);
//


//
//
//
//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
//
//var ticker = "";
//app.get('/:ticker', function(req, res) {
//	ticker = req.params.ticker;
//	res.sendfile(__dirname + '/index.html');
//});
//
//io.sockets.on('connection', function(socket) {
//	var local_ticker = ticker;
//	ticker = "";
//
//	//Run the first time immediately
//	get_quote(socket, local_ticker);
//
//	//Every N seconds
//	var timer = setInterval(function() {
//		get_quote(socket, local_ticker)
//	}, FETCH_INTERVAL);
//
//	socket.on('disconnect', function () {
//		clearInterval(timer);
//	});
//});
//
//function get_quote(p_socket, p_ticker) {
//	http.get({
//		host: 'www.google.com',
//		port: 80,
//		path: '/finance/info?client=ig&q=' + p_ticker
//	}, function(response) {
//		response.setEncoding('utf8');
//		var data = "";
//					
//		response.on('data', function(chunk) {
//			data += chunk;
//		});
//		
//		response.on('end', function() {
//			if(data.length > 0) {
//				try {
//					var data_object = JSON.parse(data.substring(3));
//				} catch(e) {
//					return;
//				}
//									
//				var quote = {};
//				quote.ticker = data_object[0].t;
//				quote.exchange = data_object[0].e;
//				quote.price = data_object[0].l_cur;
//				quote.change = data_object[0].c;
//				quote.change_percent = data_object[0].cp;
//				quote.last_trade_time = data_object[0].lt;
//				quote.dividend = data_object[0].div;
//				quote.yield = data_object[0].yld;
//				
//				p_socket.emit('quote', PRETTY_PRINT_JSON ? JSON.stringify(quote, true, '\t') : JSON.stringify(quote));
//			}
//		});
//	});
//}
//


var PORT = 4000;
var FETCH_INTERVAL = 5000;
var PRETTY_PRINT_JSON = true;

///
// START OF APPLICATION
///
var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = io.listen(server);
//io.set('log level', 1);

server.listen(PORT);

var ticker = "";
app.get('/:ticker', function(req, res) {
	ticker = req.params.ticker;
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	var local_ticker = ticker;
	ticker = "";

	//Run the first time immediately
	get_quote(socket, local_ticker);

	//Every N seconds
	var timer = setInterval(function() {
		get_quote(socket, local_ticker)
	}, FETCH_INTERVAL);

	socket.on('disconnect', function () {
		clearInterval(timer);
	});
});

function get_quote(p_socket, p_ticker) {
	http.get({
//		host: 'www.google.com',
//		port: 80,
//		path: '/finance/info?client=ig&q=' + p_ticker
				  host: 'www.nseindia.com',
				  method: 'GET',
				  path: '/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?symbol=' + p_ticker,
				  headers: {
					  	"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
					  	"Referer": "http://www.nseindia.com/",
					  	"Accept": '*/*'
				  }
	}, function(response) {
		response.setEncoding('utf8');
		var data = "";
					
		response.on('data', function(chunk) {
			data += chunk;
		});
		
		response.on('end', function() {
			if(data.length > 0) {
				
				console.log(data);
				data = JSON.parse(data);
				
//				try {
//					var data_object = JSON.parse(data.substring(3));
//				} catch(e) {
//					return;
//				}
									
//				var quote = {};
//				quote.ticker = data_object[0].t;
//				quote.exchange = data_object[0].e;
//				quote.price = data_object[0].l_cur;
//				quote.change = data_object[0].c;
//				quote.change_percent = data_object[0].cp;
//				quote.last_trade_time = data_object[0].lt;
//				quote.dividend = data_object[0].div;
//				quote.yield = data_object[0].yld;
				
				//p_socket.emit('quote', PRETTY_PRINT_JSON ? JSON.stringify(quote, true, '\t') : JSON.stringify(quote));
				p_socket.emit('quote',data);
			}
		});
	});
}



function get_quotense(p_socket, p_ticker) {
	//if(request.query.symbol && request.query.symbol.length > 0) {
		//console.log("Symbol Requested - " + request.query.symbol);
		
		var http = require('http');

//		var symbol = request.query.symbol;
		var symbol = "RCOM";
		var options = {
		  host: 'www.nseindia.com',
		  method: 'GET',
		  path: '/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?symbol=' + p_ticker,
		  headers: {
		  	"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
		  	"Referer": "http://www.nseindia.com/",
		  	"Accept": '*/*'
		  }
		};

		var resp = "";	// Hold the servers response

		var req = http.request(options, function(res) {
			res.on('error', function(e) {
				console.log("Got error: " + e.message);
			});
			res.on('data', function(data) {
				resp += data;
			});
			res.on('end', function() {
				resp = resp.trim();
				data = JSON.parse(resp);

				if(data.data.length < 1) {
					// Invalid Symbol
					response.send('<h1>Invalid Symbol</h1><p>Invalid Symbol given. Refer valid list of Symbols at <a href="http://blog.ashwanthkumar.in/2012/01/nse-valid-symbols.html">here</a></p>');
					return;
				}

				// Cleaning up the feeds
				delete data.otherSeries;
				delete data.optLink;
				delete data.futLink;
				
				// Now send the data
				
				p_socket.emit('quote',JSON.stringify(data));
				
				//response.send(data);
				
				// @TODO Can still filter to provide more precise data 
			});
		});
		req.end();
//	} else {
		// Invalid request
//		response.send(invalidRequest(), 400);
//	}
};

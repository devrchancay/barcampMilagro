"use strict";

let express  = require('express');
let http     = require('http');
let path     = require('path');
let ejs      = require('ejs');
let socketIO = require('socket.io');

const app    = express();
const server = http.createServer(app);
const VIEWS  = path.join(__dirname,'./app/views');

server.listen(3000);

const io = socketIO({});
io.listen(server);

io.on('connection' , function(socket){
   socket.on('news' , function(data){
   	  socket.broadcast.emit('add',{ data : data });
   });
});


app.set('views',VIEWS);
app.set('view engine', 'ejs');
app.use(express.static(path.join('./public')));


app.get('/', function(req,res){
	res.render('index');
});




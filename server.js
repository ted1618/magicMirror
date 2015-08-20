//////////SERVER.JS//////////////////////
//dependencies
var express    = require('express');
var path       = require('path');
var app        = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));

//static folder below set to client
app.use(express.static(__dirname+'/client'));

app.use(bodyParser.json());


//set app to listen to a port
app.listen(8000,function(){
	console.log("Listening on port 8000, chief");
})
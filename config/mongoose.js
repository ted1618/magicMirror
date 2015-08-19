//create DATABASE and initiate all the models
//////////////////////////////////////////////

var mongoose = require('mongoose');
var fs = require('fs');

//connecting the DB
mongoose.connect('mongodb://localhost/BucketList');
//path for models
var models_path = __dirname + '/../server/models';
//read all files and run 
fs.readdirSync(models_path).forEach(function(file){
	if(file.indexOf('.js')>0){
		require(models_path+'/'+file);
	}
})